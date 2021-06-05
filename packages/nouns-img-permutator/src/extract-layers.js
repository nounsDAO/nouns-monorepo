
const PSD = require('psd');
const fse = require('fs-extra')
var path = require('path');

const rootPath = path.join(__dirname, '..')

extractLayers()

async function extractLayers() {

    // get .psd path
    const psdPath = await getPsdPath()

    // parse .psd file
    var psd = PSD.fromFile(psdPath)
    psd.parse()
    let nodes = psd.tree().descendants()
    
    // iterate through nodes to indentify group nodes
    var groupIndexes = []
    for (var i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        if (node.hasChildren()) {
            groupIndexes.push(i)
        }
    }

    // extract layers to corresponding group folder
    for (var i = 0; i< groupIndexes.length; i++) {
        
        let lowerBound = groupIndexes[i]
        let upperBound = groupIndexes[i + 1]
        let groupNode = nodes[groupIndexes[i]]

        // if last group node, modify upperBound to be last node in all nodes
        if (i == groupIndexes.length - 1) {
            upperBound = nodes.length
        }

        // make folder for noun asset
        await fse.mkdir(`../assets/noun-assets/${groupNode.name}`)
        
        for (var z = lowerBound + 1; z < upperBound; z++) {
            
            // write layer node into corresponding folder 
            let layerNode = nodes[z]
            console.log(`extracting layer "${layerNode.name}" from group "${groupNode.name}" to path assets/${groupNode.name}/${layerNode.name}.png`)
            await layerNode.layer.image.saveAsPng(`../assets/noun-assets/${groupNode.name}/${layerNode.name}.png`)  
        }
    }
}

async function getPsdPath() {
    let files = await fse.readdir(`../assets/psd/`)
    var psdFilePath;
    files.forEach(file => {
        if (path.extname(file) == `.psd`) {
            psdFilePath = file
        }
    })
    return '../assets/psd/' + psdFilePath
}
