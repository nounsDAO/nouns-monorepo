
const randomNounURL = 'https://us-central1-nounsdao.cloudfunctions.net/generateNounUsingOptionsAndSourceAndBG'
const voteURL = 'https://us-central1-nounsdao.cloudfunctions.net/addVoteToLayersINT'

// holds nouns image data
var randomNounsData = []
var voteStreak = 0
 

window.onload = async () => {
    
    await fetchRandomNouns()
    
    // remove init loading title
    document.getElementById('loading-title').remove()
    
    // show vote streak
    updateVoteStreak()

    // display noun colums
    showNounColums()
}

fetchRandomNouns = async () => {

    // show loading
    displayNounsLoading(true)

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
        console.log(json)
        randomNounsData.push(json)        
    }
    
    // reset ui
    displayNounsLoading(false)

    // set new noun imgs
    for (var i = 0; i < 2; i++) {
        let img = document.getElementById(`noun-${i}-img`)
        img.setAttribute('src', randomNounsData[i].base64)
        let hsl = `hsl(${randomNounsData[i].dominantColorHSL[0]},${randomNounsData[i].dominantColorHSL[1]-10}%,${70}%)`
        img.style.backgroundColor = hsl
    }
}
/**
 * Sends vote to backend, updates vote streak and initiates new noun fetch.
 * @param {Number} selectionIndex Index of selected noun (i.e. left = 0, right = 1)
 */
voted = async (selectionIndex) => {

    // send vote to backend and display results
    let selectedNoun = randomNounsData[selectionIndex]
    fetch(`${voteURL}?options=${JSON.stringify(selectedNoun.layers)}`)

    // update vote
    voteStreak++;
    updateVoteStreak()

    // start next round of nouns
    fetchRandomNouns()
}

/**
 * Sets noun images as 'loading nouns' and accompanying buttons.
 * @param {Boolean} loading Displays or hides loading signifier on buttons
 */
displayNounsLoading = (loading) => {

    // set "non-noun" as noun imgs
    for (var i = 0; i < 2; i++) {
        let img = document.getElementById(`noun-${i}-img`)
        img.setAttribute('src', 'assets/question-noun.png')
        img.style.backgroundColor = ''
    }
    
    // set buttons as loading
    let buttons = document.getElementsByTagName('button')
    for (var i = 0; i < buttons.length; i++) {
        if (loading) {
            setButtonLoading(buttons[i], true)
        } else {
            setButtonLoading(buttons[i], false, 'VOTE')
        }
    }
}
/**
 * Updates copy of voting streak header
 */
updateVoteStreak = () => {
    var addOn = ''

    if (voteStreak >= 3 && voteStreak <= 10) {
        addOn = '🔥'
    } else if (voteStreak >= 10 && voteStreak <= 25) {
        addOn = '⚡️'
    } else if (voteStreak >= 25 && voteStreak <= 50) {
        addOn = '🚀'
    } else if (voteStreak >= 50 && voteStreak <= 100) {
        addOn = '🧨'
    } else if (voteStreak >= 100) {
        addOn = '💣'
    } 
    
    let row = document.getElementById('vote-streak-row')
    row.innerHTML = ''
    
    let title = document.createElement('h1')
    title.classList.add('display-5')
    title.textContent = `Vote streak: ${voteStreak}${addOn}`     
    
    row.appendChild(title)
}

showNounColums = () => {
    document.getElementById(`noun-0-col`).style.display = 'block'
    document.getElementById(`noun-1-col`).style.display = 'block'
}

showLoadingTitle = () => {
    document.getElementById('loading-title').style.display = 'block'
}

hideLoadingTitle = () => {
    document.getElementById('loading-title').style.display = 'none'
}