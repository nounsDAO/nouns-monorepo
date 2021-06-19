

window.onload = async () => {
    await fetchRandomNouns()
}

const randomNounURL = 'https://us-central1-nounsdao.cloudfunctions.net/generateNounUsingOptionsAndSource'
const voteURL = 'https://us-central1-nounsdao.cloudfunctions.net/addVoteToLayersEXT'
var randomNounsData = []
 
fetchRandomNouns = async () => {

    // prep UI for loading
    showNounColum(false, 0)
    showNounColum(false, 1)
    showLoadingTitle()

    // set up options for random 
    let options = {
        source: 'src-main',
        layers: {}
    }
    for (var i = 0; i < 5; i++) {
        options.layers[`layer-${i}`] = 'random'
    }
    // clear old nouns 
    randomNounsData = []
    // fetch 2 new random nouns
    for (var i = 0; i < 2; i++) {
        let res = await fetch(`${randomNounURL}?options=${JSON.stringify(options)}`)
        let json = await res.json()
        randomNounsData.push(json)        
    }
    
    // reset ui
    showNounColum(true, 0)
    showNounColum(true, 1)
    hideLoadingTitle()

    // set new noun imgs
    document.getElementById('noun-0-img').setAttribute('src', randomNounsData[0].base64)
    document.getElementById('noun-1-img').setAttribute('src', randomNounsData[1].base64)
}
/**
 * EXPLAIN
 * @param {Number} selectionIndex Index of selected noun (i.e. left = 0, right = 1)
 */
voted = async (selectionIndex, button) => {

    // set voted noun button as disabled/loading
    setButtonLoading(button, true)

    // hide non voted noun column
    let nonSelectedNounIndex = selectionIndex == 0 ? 1 : 0;
    showNounColum(false, nonSelectedNounIndex)
    
    // send vote to backend and display results
    let selectedNounData = randomNounsData[selectionIndex]
    try {
        let res = await fetch(`${voteURL}?options=${JSON.stringify(selectedNounData.layers)}`)
        let json = await res.json()        
        displayResults(json)
    } catch (e) {
        console.log(e)
    }
    
    // remove button loading
    setButtonLoading(button, false, "NEXT")

    // upate functionality of voted noun button to go to next set of nouns
    button.onclick = () => {  resetUI(selectionIndex, button) }
}

displayResults = (results) => {
    
    // colum to hold results
    let column = document.createElement('div')
    column.classList.add('col-lg-6')
    column.classList.add('d-flex')
    column.classList.add('flex-column')
    column.classList.add('justify-content-center')    
    column.classList.add('align-items-start')
    column.style.minHeight = '500px'
    column.id = 'results'

    // results
    results.updatedDocs.shift() // remove layer-0 or "background layer" from results

    // title
    let div = document.createElement('div')
    div.classList.add('fs-1')
    div.classList.add('lond-font')
    div.style.color = 'gray'
    div.textContent = "VOTE TALLY:"
    column.appendChild(div)

    results.updatedDocs.forEach(doc => {
        let div = document.createElement('div')
        div.classList.add('fs-5')
        div.classList.add('lond-font')
        div.textContent = doc.fileName + ': ' + doc.votes + ' votes'
        column.appendChild(div)
    })        

    document.getElementById('hot-or-not-content').appendChild(column)
}

resetUI = (index, button) => {

    // reset button text and `onclick`
    button.textContent = "VOTE"
    button.onclick = () => { voted(index, button) }

    // remove results div
    document.getElementById('results').remove()

    // fetch new nouns
    fetchRandomNouns()
}

showNounColum = (show, index) => {
    if (show) {
        document.getElementById(`noun-${index}-col`).style.display = 'block'
    } else {
        document.getElementById(`noun-${index}-col`).style.display = 'none'
    }
}

showLoadingTitle = () => {
    document.getElementById('loading-title').style.display = 'block'
}

hideLoadingTitle = () => {
    document.getElementById('loading-title').style.display = 'none'
}