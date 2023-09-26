export const human2ContractUSDCFormat = (humanReadableUSDCAmt: string | number) => {
  return Math.round(parseFloat(humanReadableUSDCAmt.toString()) * 1_000_000).toString();
};

export const contract2humanUSDCFormat = (
  contractUSCDAmt: string | number,
  allDecimals?: boolean,
) => {
  if (allDecimals === true) {
    return (parseFloat(contractUSCDAmt.toString()) / 1_000_000).toString();
  }

  return (parseFloat(contractUSCDAmt.toString()) / 1_000_000).toFixed(3).toString();
};
