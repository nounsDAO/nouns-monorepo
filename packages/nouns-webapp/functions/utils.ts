import { BigNumber, BigNumberish } from '@ethersproject/bignumber';

export const bigNumbersEqual = (a: BigNumberish, b: BigNumberish) =>
  BigNumber.from(a).eq(BigNumber.from(b));
