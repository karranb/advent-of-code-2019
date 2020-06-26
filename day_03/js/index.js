import { readFile } from 'fs'

const Point = (x, y, steps = 0) => ({ x, y, key: `${x},${y}`, steps })

const newPoint = (basePoint, direction) => {
  const steps = basePoint.steps + 1
  switch (direction) {
    case 'R':
      return Point(basePoint.x + 1, basePoint.y, steps)
    case 'L':
      return Point(basePoint.x - 1, basePoint.y, steps)
    case 'D':
      return Point(basePoint.x, basePoint.y + 1, steps)
    case 'U':
      return Point(basePoint.x, basePoint.y - 1, steps)
  }
}

const getLinePoints = (str, basePoint) => {
  const direction = str[0]
  let lastPoint = basePoint
  const totalDistance = Number.parseInt(str.slice(1), 10)
  return [
    new Array(totalDistance).fill(null).reduce(acc => {
      lastPoint = newPoint(lastPoint, direction)
      const key = lastPoint.key
      return key in acc ? acc : Object.assign(acc, { [lastPoint.key]: lastPoint })
    }, {}),
    lastPoint,
  ]
}

const parseStrToPoints = str => {
  let basePoint = Point(0, 0)
  return str.split(',').reduce((acc, item) => {
    const [points, lastPoint] = getLinePoints(item, basePoint)
    basePoint = lastPoint
    return Object.assign(acc, points)
  }, {})
}

const getClosestIntersectionDistance = ([wire1Points, wire2Points]) =>
  Object.entries(wire2Points)
    .filter(([key]) => key in wire1Points)
    .reduce((acc, [_, item]) => {
      const distance = Math.abs(item.x) + Math.abs(item.y)
      return distance < acc ? distance : acc
    }, Infinity)

const getClosestIntersectionSteps = ([wire1Points, wire2Points]) =>
  Object.entries(wire2Points)
    .filter(([key]) => key in wire1Points)
    .reduce((acc, [_, wire2Point]) => {
      const wire1Point = wire1Points[wire2Point.key]
      const steps = wire1Point.steps + wire2Point.steps
      return steps < acc ? steps : acc
    }, Infinity)

const parseBufferToPoints = buffer =>
  buffer
    .toString('utf-8')
    .split('\n')
    .map(parseStrToPoints)

readFile('./day_03/input.txt', (_, buffer) => {
  const wires = parseBufferToPoints(buffer)
  const distance = getClosestIntersectionDistance(wires)
  console.log(`part 1 ${distance}`)
  const steps = getClosestIntersectionSteps(wires)
  console.log(`part 2 ${steps}`)
})
