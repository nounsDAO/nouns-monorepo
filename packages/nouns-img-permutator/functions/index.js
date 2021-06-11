


const { Canvas, Image } = require('canvas')
const mergeImages = require('merge-images')
const os = require("os") // access tmp folders


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
 * Retrieves available layers and their corresponding layer.
 * Returns an array of of objects, each object being a layer with its options
 */
exports.fetchLayersAndOptions = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {

        // root path for layer folders 
        const baseFolder = `assets/`
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
 exports.generateNounUsingOptions = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {

        let options = JSON.parse(request.query.options)
        let layers = Object.keys(options)

        // root path for asset folder
        const baseLayerPath = `assets/`

        // FETCH ONE RANDOM IMAGE PATH FOR EACH LAYER
        try {            
            var layerPaths = []

            for (var i = 0; i < layers.length; i++) {

                // base path for layer
                let layerPath = baseLayerPath + layers[i] + '/'
                
                if (options[layers[i]] == 'random') {
                    
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
                    layerPath = layerPath + options[layers[i]] 
                    
                    var [files] = await storageBucket.getFiles({ prefix: layerPath})
                    if (files.length > 0) {
                        // filter empty files
                        files = files.filter(file => file.name.includes('.png')) 
                        // add             
                        layerPaths.push(files[0].name)
                    } else { 
                        // layer does not exists, end loop.
                        console.log(`layer ${i} does not exist. ending!`)                        
                        break
                    }
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
            let pathName = layerPaths[i].split('/')[1]
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
            // return base64 image data
            response.status(200).json( { base64: b64})
        } catch (e) {
            console.log(`error merging images. `, e)
            response.status(500).json( { error: e})
        }
    })
})


/**
 * Generates random noun.
 * Returns the base64 string representing the finalized noun image.
 */
exports.generateRandomNoun = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {

        // increment counter
        const docRef = db.collection('admin').doc('counters');
        await docRef.update({
            counter: admin.firestore.FieldValue.increment(1)
          });

        // root path for layer folders 
        const baseLayerPath = `assets/layer-`

        // FETCH ONE RANDOM IMAGE PATH FOR EACH LAYER
        try {            
            var layerPaths = []

            for (var i = 0; i < 10; i++) {
                let layer = baseLayerPath + i
                var [files] = await storageBucket.getFiles({ prefix: layer})

                if (files.length > 0) {
                    // filter empty files
                    files = files.filter(file => file.name.includes('.png')) 
                    // grab random file
                    var randomFile = files[Math.floor(Math.random() * files.length)] 
                    // add                    
                    layerPaths.push(randomFile.name)
                } else { 
                    console.log(`layer ${i} does not exist. ending!`)
                    // layer does not exists, end loop.
                    break
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
            let pathName = layerPaths[i].split('/')[1]
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
            // return base64 image data
            response.status(200).json( { base64: b64})
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
