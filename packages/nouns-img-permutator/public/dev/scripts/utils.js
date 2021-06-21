
const fetchLayersAndOptionsURL = 'https://us-central1-nounsdao.cloudfunctions.net/fetchLayersAndOptionsWithSource'
const generateNounWithOptions = 'https://us-central1-nounsdao.cloudfunctions.net/generateNounUsingOptionsAndSourceAndBG'
const fetchSourcesURL = 'https://us-central1-nounsdao.cloudfunctions.net/fetchSources'

// object to track selected layer options
var selectedOptions = {
    source: '',
    layers: {}
}

// hold nouns base64 data strings { base64: base64String, dominantColorHSL: [H,S,L]}
var nounsData = []

// tracking display modes
const DISPLAY_MODE = {
	TILED: "tiled",
	SCALED: "scaled"
}
var selectedDisplayMode = DISPLAY_MODE.TILED;

/////////////////////////////
// UI MANIPULATION METHODS //
/////////////////////////////


/** 
 * @param {String} data Base64 image data 
 * @param {[Number]} dominantColorHSL array of values indicating hue, saturation and lightness
 * @param {DISPLAY_MODE} displayMode Mode to add noun img with 
 */
function addNounImg(data, dominantColorHSL, displayMode) {    

    var nounsDiv = document.getElementById("nouns")

    if (displayMode == DISPLAY_MODE.TILED) {
        
        let colThreeColumn = document.createElement('div')
        colThreeColumn.className = ''
        colThreeColumn.classList.add('col-lg-2')
        colThreeColumn.classList.add('col-md-4')        

        let img = document.createElement('img')
        img.setAttribute('src', data)
        img.classList.add('noun-img')
        img.classList.add('pixelated')

        // create hsl css to set as bg color 
        let hsl = `hsl(${dominantColorHSL[0]},${dominantColorHSL[1]-10}%,${70}%)`
        img.style.backgroundColor = hsl

        colThreeColumn.appendChild(img)
        nounsDiv.insertBefore(colThreeColumn, nounsDiv.children[0])

    } else {
        // SCALED
        let colThreeColumn = document.createElement('div')
        colThreeColumn.classList.add('col-sm-6')    
    
        let imgSm = document.createElement('img')
        imgSm.setAttribute('src', data)
        imgSm.classList.add('noun-img-sm')
        imgSm.classList.add('pixelated')
    
        let imgMd = document.createElement('img')
        imgMd.setAttribute('src', data)
        imgMd.classList.add('noun-img-md')
        imgMd.classList.add('pixelated')
    
        let imgLg = document.createElement('img')
        imgLg.setAttribute('src', data)
        imgLg.classList.add('noun-img-lg')
        imgLg.classList.add('pixelated')

        // create hsl css to set as bg color 
        let hsl = `hsl(${dominantColorHSL[0]},${dominantColorHSL[1]-10}%,${70}%)`
        imgSm.style.backgroundColor = hsl
        imgMd.style.backgroundColor = hsl
        imgLg.style.backgroundColor = hsl
    
        colThreeColumn.appendChild(imgSm)
        colThreeColumn.appendChild(imgMd)    
        colThreeColumn.appendChild(imgLg)
        nounsDiv.insertBefore(colThreeColumn, nounsDiv.children[0])
    }

}

/** 
 * @param {Element} element Source element from where event triggered
 */
function displayModeChanged(element) {

    var nounsDiv = document.getElementById("nouns")
    nounsDiv.innerHTML = ''

    if (element.id == 'scaled-display-radio-btn') {
        selectedDisplayMode = DISPLAY_MODE.SCALED
        nounsData.forEach(nounData => {
            console.log(nounsData)
            addNounImg(nounData.base64, nounData.dominantColorHSL, DISPLAY_MODE.SCALED)
        })
    } else {
        selectedDisplayMode = DISPLAY_MODE.TILED
        nounsData.forEach(nounData => {
            addNounImg(nounData.base64, nounData.dominantColorHSL, DISPLAY_MODE.TILED)
        })
    }
}

/** 
 * Adds loading indicator to button.
 * @param {Element} element 
 * @param {Boolean} loading 
 * @param {String} originalText Not needed when setting button loading to true
 */
 function setButtonLoading(element, loading, originalText) {
    if (loading == true) {
        element.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Loading...`
        element.disabled = loading
    } else {
        element.innerHTML = originalText
        element.disabled = loading
    }
}

/**
 * Calls functions to add drop down buttons and add layers to selection display.
 * @param {[Object]} data Array of objects containing layers and their corresponding options
 */
 function setLayersAndOptionsUI(data) {
    
    // clear layer buttons
    let div = document.getElementById('layer-buttons')
    div.innerHTML = ''

    // clear legend
    let layerSelectionList = document.getElementById('layer-selection')
    layerSelectionList.innerHTML = ''

    data.forEach(layer => {
        
        // if layer-0 for source has `transparent-bg.png`, set as default
        if (layer.options.includes('transparent-bg.png') && layer.name == 'layer-0') {
            selectedOptions.layers[layer.name] = 'transparent-bg.png'
            addButtonDropdownWithOptions(layer)
            addLayerToLayerDisplay(layer, 'transparent-bg.png')
        } else {
            // else, default as random
            selectedOptions.layers[layer.name] = 'random'
            addButtonDropdownWithOptions(layer)
            addLayerToLayerDisplay(layer, 'random')
        }        
    })
}

/**
 * Add dropdown button representing layer and its corresponding options
 * @param {Object} layer Object representing a layer containing properties `object.name` and `object.options`
 */
function addButtonDropdownWithOptions(layer) {
    
    let div = document.getElementById('layer-buttons')

    let column = document.createElement('div')
    column.classList.add('col-lg-4')
    
    let btnGroup = document.createElement('div')
    btnGroup.classList.add('btn-group')
    btnGroup.id = 'layers-dropdown-buttons'    
    btnGroup.style.width = '100%'

    // button
    let button = document.createElement('button')
    button.type = 'button'
    button.classList.add('layer-btn')
    button.classList.add('btn')
    button.classList.add('btn-primary')
    button.classList.add('dropdown-toggle')
    button.setAttribute('data-toggle', 'dropdown')
    button.setAttribute('aria-haspopup', 'true')
    button.setAttribute('aria-expanded', 'false')
    button.textContent = layer.name
    button.style.width = '100%'

    let dropDownMenu = document.createElement('div')
    dropDownMenu.classList.add('dropdown-menu')

    // random option
    let randLink = document.createElement('a')
    randLink.classList.add('dropdown-item')
    randLink.href = '#'
    randLink.textContent = "random"
    randLink.dataset.layerName = layer.name
    randLink.dataset.optionName = 'random'
    randLink.onclick = () => { layerOptionSelected(randLink.getAttribute('data-layer-name'), randLink.getAttribute('data-option-name')) }
    dropDownMenu.appendChild(randLink)

    // separator
    let separatorDiv = document.createElement('div')
    separatorDiv.classList.add('dropdown-divider')
    dropDownMenu.appendChild(separatorDiv)

    // options
    layer.options.forEach(option => {
        let link = document.createElement('a')
        link.classList.add('dropdown-item')
        link.href = '#'
        link.textContent = option
        link.dataset.layerName = layer.name
        link.dataset.optionName = option
        link.onclick = () => { layerOptionSelected(link.getAttribute('data-layer-name'), link.getAttribute('data-option-name')) }
        dropDownMenu.appendChild(link)
    })

    btnGroup.appendChild(button)
    btnGroup.appendChild(dropDownMenu)
    column.appendChild(btnGroup)
    div.appendChild(column)

}

/**
 * Adds dropdown button for choosing source.
 * @param {[String]} data Array of strings corresponding to source directory names.
 */
 function addSourcesDropdownButton(data) {
    let div = document.getElementById('main-controls')

    let column = document.createElement('div')
    column.classList.add('col-lg-4')
    column.classList.add('col-md-12')
    
    let btnGroup = document.createElement('div')
    btnGroup.classList.add('btn-group')
    btnGroup.id = 'layers-dropdown-buttons'    
    btnGroup.style.width = "100%";

    // button
    let button = document.createElement('button')
    button.id = 'source-button'
    button.type = 'button'
    button.classList.add('btn')
    button.classList.add('btn-primary')
    button.classList.add('dropdown-toggle')
    button.setAttribute('data-toggle', 'dropdown')
    button.setAttribute('aria-haspopup', 'true')
    button.setAttribute('aria-expanded', 'false')
    button.textContent = data[0]
    button.style.width = "100%";

    let dropDownMenu = document.createElement('div')
    dropDownMenu.classList.add('dropdown-menu')

    // options
    data.forEach(option => {
        let link = document.createElement('a')
        link.classList.add('dropdown-item')
        link.href = '#'
        link.textContent = option
        link.dataset.optionName = option
        link.onclick = () => { sourceOptionSelected(button, link.getAttribute('data-option-name')) }
        dropDownMenu.appendChild(link)
    })

    btnGroup.appendChild(button)
    btnGroup.appendChild(dropDownMenu)
    column.appendChild(btnGroup)
    div.appendChild(column)
}

/**
 * Adds a layer to the selection display. Used to initialize layers display. 
 * @param {Object} layer Object representaining layer containing `object.name` property
 * @param {String} name Strign to set as the 
 */
function addLayerToLayerDisplay(layer, name) {

    let layerSelectionList = document.getElementById('layer-selection')

    let listItem = document.createElement('li')
    listItem.classList.add('list-group-item')
    listItem.dataset.layerName = layer.name
    listItem.textContent = layer.name + ': ' + name
    
    layerSelectionList.appendChild(listItem)
}

/**
 * Updates UI and `selectedOptions` object upon option selection in the the layer button dropdown.
 * @param {String} layerName Name of layer selected (e.g. `layer-0`)
 * @param {String} optionName Name of option selected (e.g. `head-bear.png`)
 */
function layerOptionSelected(layerName, optionName) {

    // reflect selection in ui
    let listItems = Array.from(document.querySelectorAll(`.list-group-item`))
    listItems = listItems.filter(item => { return item.dataset.layerName == layerName})
    let item = listItems[0]
    item.textContent = `${layerName}: ${optionName}`

    // update selectedItems
    selectedOptions.layers[layerName] = optionName
}

/**
 * Updates UI and `selectedOptions` object upon option selection in the the layer button dropdown.
 * @param {Element} button Button to display as loading while fetching.
 * @param {String} optionSelected Name of option selected (e.g. `src-main`)
 */
 async function sourceOptionSelected(button, optionSelected) {
    
    setButtonLoading(button, true)

    try {
        await loadLayersAndOptions(optionSelected)

        // update selected options
        selectedOptions['source'] = optionSelected

        // reflect selection in ui
        let sourceButton = document.getElementById('source-button')
        sourceButton.textContent = optionSelected

        // end button loading
        setButtonLoading(button, false, button.textContent)
    } catch (e) {
        console.log(`error loading layers and options for source. `, e)
    }
}