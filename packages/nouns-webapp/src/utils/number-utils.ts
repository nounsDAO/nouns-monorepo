export function countDecimals(n: number) {
  if (Math.floor(n.valueOf()) === n.valueOf()) return 0;
  return n.toString().split('.')[1].length || 0;
}
