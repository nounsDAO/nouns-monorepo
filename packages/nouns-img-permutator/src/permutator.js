

const { Canvas, Image } = require('canvas')
const fse = require('fs-extra') 
const mergeImages = require('merge-images')

// should be in order of z-depth. index 0 being the background layer, index 1 going on top and so on.
const attributes = ['body','accessory','head','glasses']
const resultImagePath = `result.png`

generateImage() 

async function generateImage() {
 
    var layerPathNames = []
    
    // grab random layer path names
    for (var i = 0; i < attributes.length; i++) {
        let layer = await getRandomImagePathNameForAttribute(attributes[i])
        layerPathNames.push(layer)
    }

    // merge images with rare image
    let b64 = await mergeImages(layerPathNames, { 
        Canvas: Canvas,
        Image: Image
      })
      
    // remove header from base64 string 
    let base64Image = b64.split(';base64,').pop();
    
    // write image to file so we can upload to ipfs
    await fse.outputFile(resultImagePath, base64Image, {encoding: 'base64'})

    return resultImagePath
}

// returns path name for file at index within attributeFolderName
async function getRandomImagePathNameForAttribute(attributeFolderName) {
    let files = await fse.readdir(`../assets/noun-assets/${attributeFolderName}`)
    files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item)); // filter out hidden files (.DS_STORE)
    return `../assets/noun-assets/${attributeFolderName}/` + files[Math.floor(Math.random() * files.length)];
}

// function get width of image at path
function xPositionForImageAtPath(path) {
    // const dimensions = sizeOf(path)
    // return Math.round(16 - (dimensions.width / 2))
    return 8
}