export const human2ContractUSDCFormat = (humanReadableUSDCAmt: string | number) => {
  return Math.round(parseFloat(humanReadableUSDCAmt.toString()) * 1_000_000).toString();
};

export const contract2humanUSDCFormat = (contractUSCDAmt: string | number) => {
  return Math.round(parseFloat(contractUSCDAmt.toString()) / 1_000_000).toString();
};
