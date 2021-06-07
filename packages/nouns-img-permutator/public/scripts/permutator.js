

const generateImageEndPoint = 'https://us-central1-nounsdao.cloudfunctions.net/generateRandomNoun'


/**
 * Call API endpoint to fetch base64 for random noun image
 */
async function generateImage() {

    // disable button/ show loading
    let button = document.getElementById('generate-noun-button')
    
    setButtonLoading(button, true)

    // attempt to fetch random noun
    try {
        // clear nouns 
        var nounsDiv = document.getElementById("nouns")
        nounsDiv.innerHTML = ''
        for (var i = 0; i < 12; i++) {
            let res = await fetch(generateImageEndPoint)
            let json = await res.json()
            addNounImg(json.base64)
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

function addNounImg(data) {
    
    var nounsDiv = document.getElementById("nouns")

    let colThreeColumn = document.createElement('div')
    colThreeColumn.classList.add('col-sm-3')

    let img = document.createElement('img')
    img.setAttribute('src', data)
    img.classList.add('noun-img')

    colThreeColumn.appendChild(img)
    nounsDiv.appendChild(colThreeColumn)
}
