


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
            var randomLayerPaths = []

            for (var i = 0; i < 10; i++) {
                let layer = baseLayerPath + i
                var [files] = await storageBucket.getFiles({ prefix: layer})

                if (files.length > 0) {
                    // filter empty files
                    files = files.filter(file => file.name.includes('.png')) 
                    // grab random file
                    var randomFile = files[Math.floor(Math.random() * files.length)] 
                    // add                    
                    randomLayerPaths.push(randomFile.name)
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
        let randomInt = getRandomInt(1000000000)
        var pathsToDownloadImagesTo = []    
        for (var i = 0; i < randomLayerPaths.length; i++) {
            // remove directory from filepath (saves us from having to create the directory in tmp folder)
            let pathName = randomLayerPaths[i].split('/')[1]
            // add random int so each path is unique
            pathsToDownloadImagesTo.push(`${os.tmpdir()}/${randomInt}${pathName}`)
        }        

        // DOWNLOAD IMAGES
        try {
            for (var i = 0; i < randomLayerPaths.length; i++) {
                console.log(`attempting to download ${randomLayerPaths[i]} to ${pathsToDownloadImagesTo[i]}`)
                await downloadFile(pathsToDownloadImagesTo[i], randomLayerPaths[i])
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


// downloads file from default bucket to destinationFileName from fileToDownloadPath
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

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }