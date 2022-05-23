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
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};

const pointsPositionsCalc = (points: any[], w: any, h: any, options: { xMin: any; xMax: any; yMin: any; yMax: any; }) => points.map((e: any[]) => {
    const x = map(e[0], options.xMin, options.xMax, 0, w)
    const y = map(e[1], options.yMin, options.yMax, h, 0)
    return [x, y]
  })
  
  
  const line = (pointA: number[], pointB: number[]) => {
    const lengthX = pointB[0] - pointA[0]
    const lengthY = pointB[1] - pointA[1]
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    }
  }
  
  const controlPoint = (line: (arg0: any, arg1: any) => any, smooth: number) => (current: number[], previous: any, next: any, reverse: any) => {
    const p = previous || current
    const n = next || current
    const l = line(p, n)
  
    const angle = l.angle + (reverse ? Math.PI : 0)
    const length = l.length * smooth
    const x = current[0] + Math.cos(angle) * length
    const y = current[1] + Math.sin(angle) * length
    return [x, y]
  }
  
  const bezierCommand = (controlPoint: (arg0: any, arg1: any, arg2: any, arg3: boolean | undefined) => any) => (point: any[], i: number, a: string | any[]) => {
    const cps = controlPoint(a[i - 1], a[i - 2], point, undefined)
    const cpe = controlPoint(point, a[i - 1], a[i + 1], true)
    const close = i === a.length - 1 ? ' z':''
    return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}${close}`
  }
  
  const svgPath = (points: any[], command: (arg0: any, arg1: any, arg2: any) => any, h: any) => {
    const d = points.reduce((acc: any, e: any[], i: number, a: string | any[]) => i === 0
        ? `M ${a[a.length - 1][0]},${h} L ${e[0]},${h} L ${e[0]},${e[1]}`
        : `${acc} ${command(e, i, a)}`
    , '')
    return d; 
  }


/**
 * Creates a smooth (bezier curve) line graph (as SVG) from set of points
 * @param points 
 * @param lineColor (optional) - defaults to brand black
 */
export const makeSmoothSVGChart = (
    points: Array<Array<number>>,
    width: number,
    height: number,
    bounds: ChartBounds,
    smoothing?: number,
) => {

    const pointsPositions = pointsPositionsCalc(points, width, height, bounds)
    const bezierCommandCalc = bezierCommand(controlPoint(line, smoothing ?? 0.15))
    return svgPath(pointsPositions, bezierCommandCalc, height);
};