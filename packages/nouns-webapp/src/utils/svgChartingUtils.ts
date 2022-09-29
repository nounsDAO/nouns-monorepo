export interface ChartPoint {
  x: number;
  y: number;
}

export interface ChartBounds {
  yMin: number;
  yMax: number;
  xMin: number;
  xMax: number;
}

const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const pointsPositionsCalc = (
  points: any[],
  w: any,
  h: any,
  options: { xMin: any; xMax: any; yMin: any; yMax: any },
) =>
  points.map((e: any[]) => {
    const x = map(e[0], options.xMin, options.xMax, 0, w);
    const y = map(e[1], options.yMin, options.yMax, h, 0);
    return [x, y];
  });
