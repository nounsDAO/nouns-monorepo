import {i18n} from "@lingui/core";

export function countDecimals(n: number) {
  if (Math.floor(n.valueOf()) === n.valueOf()) return 0;
  return n.toString().split('.')[1].length || 0;
}

export function treasuryString(f: number) {
  let _f: number
  if (f > 1.0) _f = Math.round(f)
  else if (f > 0.1) _f = Math.round(f * 10) / 10
  else _f = Math.round(f * 100) / 100

  return i18n.number(_f)
}
