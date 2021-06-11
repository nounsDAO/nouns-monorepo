window.onload = () => {
    loadLayersAndOptions()
}

/**
 * Loads layers and their corresponding options 
 */
 const loadLayersAndOptions = async () => {
    let res = await fetch(fetchLayersAndOptionsURL)
    let json = await res.json()
    setLayersAndOptionsUI(json.layersAndOptions)
}

/**
 * Calls API endpoint to fetch base64 for random noun image and add corresponding img element.
 */
 async function generateImage() {

    // disable button/ show loading
    let button = document.getElementById('generate-noun-button')
    
    setButtonLoading(button, true)

    // attempt to fetch random noun
    try {
        for (var i = 0; i < 16; i++) {
            let res = await fetch(`${generateNounWithOptions}?options=${JSON.stringify(selectedOptions)}`)
            let json = await res.json()
            nounsData.push(json.base64)
            addNounImg(json.base64, selectedDisplayMode)
        }

        setButtonLoading(button, false, 'GO!')
    } catch (e) {
        console.log(`error fetching random noun. `, e)
        setButtonLoading(button, false, 'GO!')
    }
}


