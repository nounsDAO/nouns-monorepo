

const sharp = require('sharp')
const sizeOf = require('image-size')
const fse = require('fs-extra') 

// should be in order of z-depth. index 0 being the background layer, index 1 going on top and so on.
const attributes = ['background','body','decals-accessories','head','glasses']
const resultImagePath = `result.png`

generateImage()

async function generateImage() {

 
    var layerPathNames = []
    
    // grab random layer path names
    for (var i = 0; i < attributes.length; i++) {
        let layer = await getRandomImagePathNameForAttribute(attributes[i])
        layerPathNames.push(layer)
    }

    sharp(layerPathNames[0])
    .composite([
        {input: layerPathNames[1], top:21 , left: xPositionForImageAtPath(layerPathNames[1])}, // body 
        {input: layerPathNames[2], top: 21, left: xPositionForImageAtPath(layerPathNames[2])}, // decal
        {input: layerPathNames[3], top: 6, left: xPositionForImageAtPath(layerPathNames[3])}, // head
        {input: layerPathNames[4], top: 10, left: xPositionForImageAtPath(layerPathNames[4])}, //glasses
    ])
    .toFile(resultImagePath)


}

// returns path name for file at index within attributeFolderName
async function getRandomImagePathNameForAttribute(attributeFolderName) {
    let files = await fse.readdir(`../assets/noun-assets/${attributeFolderName}`)
    files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item)); // filter out hidden files (.DS_STORE)
    return `../assets/noun-assets/${attributeFolderName}/` + files[Math.floor(Math.random() * files.length)];
}

// function get width of image at path
function xPositionForImageAtPath(path) {
    const dimensions = sizeOf(path)
    return Math.round(16 - (dimensions.width / 2))
}