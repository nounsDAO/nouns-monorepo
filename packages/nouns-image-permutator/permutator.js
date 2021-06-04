
const { Canvas, Image } = require('canvas');
const mergeImages = require('merge-images')
const fse = require('fs-extra') 

// should be in order of z-depth. index 0 being the background layer, index 1 going on top and so on.
const attributes = ['heads','shades','shirts']
const resultImagePath = `result.png`

generateImage()


async function generateImage() {

    // random kValue for layer picks
    let kValue = await generateKValue()    
    var layers = []
    
    // grab layer path names
    for (var i = 0; i < attributes.length; i++) {
        let layer = await getImagePathNameFor(attributes[i], kValue[i])
        layers.push(layer)
    }
    // dump layers into array
    var pathNameForLayers = []
    for (var i = 0; i < attributes.length; i++) {
        pathNameForLayers.push(pathNameFor(attributes[i], layers[i]))
    }
    // merge images
    b64 = await mergeImages(pathNameForLayers, { // PHAT TO MERGE INTO
        Canvas: Canvas,
        Image: Image
      })  

    // remove header from base64 string (contains image data)
    let base64Image = b64.split(';base64,').pop();

    // write image to file to resize
    await fse.outputFile(resultImagePath, base64Image, {encoding: 'base64'})

}

// get path name for layer
function pathNameFor(attribute, layer) {
    return `assets/${attribute}/${layer}`
}

// returns path name for file at index within attributeFolderName
async function getImagePathNameFor(attributeFolderName, index) {
    let files = await fse.readdir(`assets/${attributeFolderName}`)
    return files[Number(index)]
}

// Given number of available attributes, pick a random file within attribute folder and return array with indexes of files
// e.g. returns [0 , 2, 1, 0]
async function generateKValue() {
    
    var kValue = []
    
    for (key in attributes) {
        let files = await fse.readdir(`assets/${attributes[key]}`)
        let rand = random(files.length)
        kValue.push(rand)
    }
    return kValue
}

// returns random integer with max as passed in param
function random(max) {
    return Math.floor(Math.random() * max);
}