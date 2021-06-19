


const { Canvas, Image } = require('canvas')
const mergeImages = require('merge-images')
const os = require("os") // access tmp folders
const { getColorFromURL } = require('color-thief-node');
const fse = require('fs-extra')
var convert = require('color-convert');

const functions = require('firebase-functions')
const admin = require('firebase-admin')
const serviceAccount = require("./serviceAccount.json")
const cors = require("cors")({origin: true})

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "nounsdao.appspot.com"
});
const storageBucket = admin.storage().bucket()
const db = admin.firestore();


/**
 * Retrieves available top-level directories within bucket
 * Returns an array of of objects, each object being a layer with its options
 */
 exports.fetchSources = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {

        const sourcePrefix = 'src-'

        try {            

            var [files] = await storageBucket.getFiles({ 
                prefix: sourcePrefix,
                delimiter: '.png'
            })
            if (files.length > 0) {

                var sourceFolders = []
                files.forEach(file => {
                    let name = file.name.split('/')[0]
                    sourceFolders.push(name)
                })
                sourceFolders = sourceFolders.unique()
                response.status(200).json({ sources: sourceFolders})
                
            } else { 
                console.log(`no source folders found.`)
                response.status(500).json({ error : 'no sources found.'})                
            }                
        } catch (e) {
            console.log(`error fetching file paths for attributes. `, e)
            response.status(500).json({ error : e})
        }        
    })
})


/**
 * Retrieves available layers and their corresponding layer.
 * Returns an array of of objects, each object being a layer with its options
 */
exports.fetchLayersAndOptionsWithSource = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {

        // root path for layer folders 
        let source = request.query.source
        const baseFolder = source + `/assets/`
        const baseLayerPath = `layer-`

        try {            
            var layersAndOptions = []

            for (var i = 0; i < 10; i++) {
                let layer = baseLayerPath + i
                var [files] = await storageBucket.getFiles({ 
                    prefix: baseFolder + layer
                })

                if (files.length > 0) {
                    // filter empty files
                    files = files.filter(file => file.name.includes('.png')) 
                    
                    // creater layer obj
                    let layerObj = {
                        name: layer,
                        options: []
                    }

                    // append options to layer obj
                    files.forEach(file => {
                        let fileName = file.name.split(layer + '/')[1]                         
                        layerObj['options'].push(fileName)
                    })
                    layersAndOptions.push(layerObj)
                    
                } else { 
                    console.log(`layer ${i} does not exist. ending!`)
                    // layer does not exists, end loop.
                    break
                }                
            }
            response.status(200).json({ layersAndOptions : layersAndOptions})
        } catch (e) {
            console.log(`error fetching file paths for attributes. `, e)
            response.status(500).json({ error : e})
        }        
    })
})

/**
 * Accepts options for layers to create noun using data. Data should be formatted as an object where
 * its keys are the layer name and values are an array of option strings. 
 * Returns the base64 string representing the finalized noun image.
 */
 exports.generateNounUsingOptionsAndSourceAndBG = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {

        // increment counter
        const docRef = db.collection('admin').doc('counters');
        await docRef.update({
            counter: admin.firestore.FieldValue.increment(1)
        });

        let options = JSON.parse(request.query.options)
        let layers = Object.keys(options.layers)
        let source = options.source

        // root path for asset folder
        const baseLayerPath = source + `/assets/`

        // GET
        try {            
            var layerPaths = []

            for (var i = 0; i < layers.length; i++) {

                // base path for layer
                let layerPath = baseLayerPath + layers[i] + '/'
                let optionForLayer = options.layers[layers[i]]

                if (optionForLayer == 'random') {
                    
                    var [files] = await storageBucket.getFiles({ prefix: layerPath})
                    
                    if (files.length > 0) {
                        // filter empty files
                        files = files.filter(file => file.name.includes('.png')) 
                        // grab random file
                        var randomFile = files[Math.floor(Math.random() * files.length)] 
                        // add                    
                        layerPaths.push(randomFile.name)
                    } else { 
                        // layer does not exists, end loop.
                        console.log(`layer ${i} does not exist. ending!`)                        
                        break
                    }
                } else {
                    // if fetching specific layer option, add path 
                    layerPath = layerPath + optionForLayer
                    layerPaths.push(layerPath)
                }                

            }
        } catch (e) {
            console.log(`error fetching file paths for attributes. `, e)
            response.status(500).json({ error : e})
        }

        // CREATE PATHS TO DOWNLOAD IMAGES TO    
        let randomInt = Math.floor(Math.random() * 1000000000);
        var pathsToDownloadImagesTo = []    
        for (var i = 0; i < layerPaths.length; i++) {
            // remove directory from filepath (saves us from having to create the directory in tmp folder)
            let pathName = layerPaths[i].split('/')[3]
            // add random int so each path is unique
            pathsToDownloadImagesTo.push(`${os.tmpdir()}/${randomInt}${pathName}`)
        }        

        // DOWNLOAD IMAGES
        try {
            for (var i = 0; i < layerPaths.length; i++) {
                console.log(`attempting to download ${layerPaths[i]} to ${pathsToDownloadImagesTo[i]}`)
                await downloadFile(pathsToDownloadImagesTo[i], layerPaths[i])
            }
            console.log('downloaded all images!')
        } catch (e) {
            console.log(`error downloading images. `, e)
            response.status(500).json({ error : e})
        }

        // ATTEMPT TO MERGE IMAGES
        var base64;
        try {
            base64 = await mergeImages(pathsToDownloadImagesTo, { 
                Canvas: Canvas,
                Image: Image
            })
        } catch (e) {
            console.log(`error merging images. `, e)
            response.status(500).json( { error: e})
        }

        // GET DOMINANT COLOR FOR BG
        const mergedImagePath = `${os.tmpdir()}/${randomInt}mergedImage.png`         
        try {
            
            // write merged noun to tmp folder
            const b64 = base64.split(';base64,').pop();
            await fse.outputFile(mergedImagePath, b64, {encoding: 'base64'})
            
            // extract color
            const dominantColorRGB = await getColorFromURL(mergedImagePath);
            
            // convert rgb to hsl
            let dominantColorHSL = convert.rgb.hsl(
                dominantColorRGB[0], 
                dominantColorRGB[1], 
                dominantColorRGB[2]
            )

            // return base64 image data
            response.status(200).json({ 
                base64: base64,
                dominantColorHSL: dominantColorHSL
            })

        } catch (e) {
            console.log(`error writing merged image to tmp folder. `, e)
            response.status(500).json( { error: e})
        }
    })
})

/**
 * Accepts options for layers to create noun using data. Data should be formatted as an object where
 * its keys are the layer name and values are an array of option strings. 
 * Returns the base64 string representing the finalized noun image.
 */
 exports.generateNounUsingOptionsAndSource = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {

        // increment counter
        const docRef = db.collection('admin').doc('counters');
        await docRef.update({
            counter: admin.firestore.FieldValue.increment(1)
        });

        let options = JSON.parse(request.query.options)
        let layers = Object.keys(options.layers)
        let source = options.source

        // root path for asset folder
        const baseLayerPath = source + `/assets/`

        // GET
        try {            
            var layerPaths = []

            for (var i = 0; i < layers.length; i++) {

                // base path for layer
                let layerPath = baseLayerPath + layers[i] + '/'
                let optionForLayer = options.layers[layers[i]]

                if (optionForLayer == 'random') {
                    
                    var [files] = await storageBucket.getFiles({ prefix: layerPath})
                    
                    if (files.length > 0) {
                        // filter empty files
                        files = files.filter(file => file.name.includes('.png')) 
                        // grab random file
                        var randomFile = files[Math.floor(Math.random() * files.length)] 
                        // add                    
                        layerPaths.push(randomFile.name)
                    } else { 
                        // layer does not exists, end loop.
                        console.log(`layer ${i} does not exist. ending!`)                        
                        break
                    }
                } else {
                    // if fetching specific layer option, add path 
                    layerPath = layerPath + optionForLayer
                    layerPaths.push(layerPath)
                }                

            }
        } catch (e) {
            console.log(`error fetching file paths for attributes. `, e)
            response.status(500).json({ error : e})
        }

        // CREATE PATHS TO DOWNLOAD IMAGES TO    
        let randomInt = Math.floor(Math.random() * 1000000000);
        var pathsToDownloadImagesTo = []    
        for (var i = 0; i < layerPaths.length; i++) {
            // remove directory from filepath (saves us from having to create the directory in tmp folder)
            let pathName = layerPaths[i].split('/')[3]
            // add random int so each path is unique
            pathsToDownloadImagesTo.push(`${os.tmpdir()}/${randomInt}${pathName}`)
        }        

        // DOWNLOAD IMAGES
        try {
            for (var i = 0; i < layerPaths.length; i++) {
                console.log(`attempting to download ${layerPaths[i]} to ${pathsToDownloadImagesTo[i]}`)
                await downloadFile(pathsToDownloadImagesTo[i], layerPaths[i])
            }
            console.log('downloaded all images!')
        } catch (e) {
            console.log(`error downloading images. `, e)
            response.status(500).json({ error : e})
        }

        // ATTEMPT TO MERGE IMAGES
        try {
            let b64 = await mergeImages(pathsToDownloadImagesTo, { 
                Canvas: Canvas,
                Image: Image
            })

            // clean up layer paths to remove everything but the final file name
            for (var i = 0; i < layerPaths.length; i++) {
                layerPaths[i] = layerPaths[i].split('/')[3]    
                layerPaths[i] = layerPaths[i].split('.')[0]                
            }

            // return base64 image data
            response.status(200).json( { base64: b64, layers: layerPaths})
        } catch (e) {
            console.log(`error merging images. `, e)
            response.status(500).json( { error: e})
        }
    })
})


/**
 * Downloads file from default bucket to destinationFileName from fileToDownloadPath 
 * @param {String} destinationFileName Path to which file will be downloaded to.
 * @param {String} fileToDownloadPath Path from Google Cloud Bucket to download from.
 * @returns {Boolean} Success or Fail.
 */
async function downloadFile(destinationFileName, fileToDownloadPath) {

    const options = {
      destination: destinationFileName
    }

    try {
      await storageBucket.file(fileToDownloadPath).download(options)
      return true // callback saying "it worked"
    } catch (e) {
      console.log(`error downloading file ${fileToDownloadPath}. error: ${e}`)
      throw `error downloading file ${fileToDownloadPath}. error: ${e}`
    }
}

Array.prototype.contains = function(v) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === v) return true;
    }
    return false;
  };
/**
 * @returns Array with unique values
 */
Array.prototype.unique = function() {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
      if (!arr.contains(this[i])) {
        arr.push(this[i]);
      }
    }
    return arr;
  }