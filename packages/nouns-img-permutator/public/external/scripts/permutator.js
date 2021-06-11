
// api end point to fetch random noun img data
const generateImageEndPoint = 'https://us-central1-nounsdao.cloudfunctions.net/generateRandomNoun'

// hold nouns base64 data string
var nounsData = []

// display 
const DISPLAY_MODE = {
	TILED: "tiled",
	SCALED: "scaled"
}
var selectedDisplayMode = DISPLAY_MODE.TILED;


/**
 * Calls API endpoint to fetch base64 for random noun image and add corresponding img element.
 */
async function generateImage() {

    // disable button/ show loading
    let button = document.getElementById('generate-noun-button')
    
    setButtonLoading(button, true)

    // attempt to fetch random noun
    try {
        // clear nouns 
        var nounsDiv = document.getElementById("nouns")
        
        for (var i = 0; i < 12; i++) {
            let res = await fetch(generateImageEndPoint)
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

/** 
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
 * @param {String} data Base64 image data 
 */
function addNounImg(data, displayMode) {    
    
    var nounsDiv = document.getElementById("nouns")

    if (displayMode == DISPLAY_MODE.TILED) {
        
        let colThreeColumn = document.createElement('div')
        colThreeColumn.classList.add('col-sm-2')

        let img = document.createElement('img')
        img.setAttribute('src', data)
        img.classList.add('noun-img-md')
        img.classList.add('rounded')

        colThreeColumn.appendChild(img)
        nounsDiv.insertBefore(colThreeColumn, nounsDiv.children[0])

    } else {
        // SCALED
        let colThreeColumn = document.createElement('div')
        colThreeColumn.classList.add('col-sm-6')    
    
        let imgSm = document.createElement('img')
        imgSm.setAttribute('src', data)
        imgSm.classList.add('noun-img-sm')
        imgSm.classList.add('rounded')
    
        let imgMd = document.createElement('img')
        imgMd.setAttribute('src', data)
        imgMd.classList.add('noun-img-md')
        imgMd.classList.add('rounded')
    
        let imgLg = document.createElement('img')
        imgLg.setAttribute('src', data)
        imgLg.classList.add('noun-img-lg')
        imgLg.classList.add('rounded')
    
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
            addNounImg(nounData, DISPLAY_MODE.SCALED)
        })
    } else {
        selectedDisplayMode = DISPLAY_MODE.TILED
        nounsData.forEach(nounData => {
            addNounImg(nounData, DISPLAY_MODE.TILED)
        })
    }
}
