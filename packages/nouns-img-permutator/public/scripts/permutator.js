

const generateImageEndPoint = 'https://us-central1-nounsdao.cloudfunctions.net/generateRandomNoun'


/**
 * Call API endpoint to fetch base64 for random noun image
 */
async function generateImage() {

    // disable button/ show loading
    let button = document.getElementById('generate-noun-button')
    console.log(button)
    setButtonLoading(button, true)

    // attempt to fetch random noun
    try {
        let res = await fetch(generateImageEndPoint)
        let json = await res.json()
        document.getElementById('random-noun').setAttribute('src', json.base64)
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
