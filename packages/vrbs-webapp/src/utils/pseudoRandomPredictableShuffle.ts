/**
 * Pseudorandomly shuffle elements on input conditioned on seed
 *
 * h/t to 9999 for this code
 *
 * @param input array of elements to be shuffeled
 * @param seed random seed
 * @returns  elements in inputs pseudorandomly shuffled as a function of seed
 */
export const pseudoRandomPredictableShuffle = (input: Array<any> = [], seed: number = 1) => {
  input = [...input];
  const output = [];

  while (input.length) {
    if (seed === 0) seed++;
    // adapted from: https://stackoverflow.com/a/19303725
    let rand = Math.sin(seed++) * 10000;
    rand -= Math.floor(rand);
    const index = Math.floor(input.length * rand);
    output.push(input[index]);
    input.splice(index, 1);
  }

  return output;
};
