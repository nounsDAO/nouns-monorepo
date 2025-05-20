export const bigNumbersEqual = (a: string | number | bigint, b: string | number | bigint) => {
  const aBigInt = typeof a === 'bigint' ? a : BigInt(a.toString());
  const bBigInt = typeof b === 'bigint' ? b : BigInt(b.toString());
  return aBigInt === bBigInt;
};

export const sharedResponseHeaders = {
  'Access-Control-Allow-Origin': '*',
};
