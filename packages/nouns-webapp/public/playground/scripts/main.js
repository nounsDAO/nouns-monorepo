window.onload = () => {
  fetchSources();
};

/**
 * Fetchs sources and proceed to load corresponding layers/options for source.
 */
const fetchSources = async () => {
  let res = await fetch(fetchSourcesURL);
  let json = await res.json();
  let data = json.sources;

  // set 'src-main' as first option
  data.splice(data.indexOf('src-main'), 1);
  data.unshift('src-main');

  selectedOptions.source = data[0]; // set default source
  addSourcesDropdownButton(data); // add sources
  loadLayersAndOptions(data[0]); // load layers and corresponding options using source
};

/**
 *
 * @param {String} source Name of source folder
 */
const loadLayersAndOptions = async source => {
  let res = await fetch(`${fetchLayersAndOptionsURL}?source=${source}`);
  let json = await res.json();
  setLayersAndOptionsUI(json.layersAndOptions);
};

/**
 * Calls API endpoint to fetch base64 for noun image using `selectedOptions` and adds corresponding img element.
 */
async function generateImage() {
  // disable button/ show loading
  let generateButton = document.getElementById('generate-noun-button');
  let sourceButton = document.getElementById('source-button');
  sourceButton.disabled = true;

  setButtonLoading(generateButton, true);

  // attempt to fetch random noun
  try {
    for (var i = 0; i < 8; i++) {
      let res = await fetch(
        `${generateNounWithOptions}?options=${JSON.stringify(selectedOptions)}`,
      );
      let json = await res.json();
      nounsData.push({
        base64: json.base64,
        dominantColorHSL: json.dominantColorHSL,
      });
      addNounImg(json.base64, json.dominantColorHSL, selectedDisplayMode);
    }

    setButtonLoading(generateButton, false, 'MORE NOUNS!');
    sourceButton.disabled = false;
  } catch (e) {
    console.log(`error fetching random noun. `, e);
    setButtonLoading(generateButton, false, 'MORE NOUNS!');
    sourceButton.disabled = false;
  }
}
