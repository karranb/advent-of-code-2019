import * as R from 'ramda'
import { readFile } from 'fs'

const filterEmptyRows = R.filter(R.compose(R.not, R.isEmpty))

const parseBufferToArr = buffer => buffer.toString('utf-8').split('\n')

const parseArrToInt = R.map(item => parseInt(item, 10))

const calcMass = R.curry((total, mass) =>
  R.compose(
    x => R.subtract(x, 2),
    x => R.add(x, total),
    Math.floor,
    mass => R.divide(mass, 3)
  )(mass))

const calcWhilePositive = (value, total = 0) => R.compose(
  R.ifElse(
    R.gt(0),
    R.always(total),
    fuel => calcWhilePositive(fuel, fuel + total)
  ),
  calcMass(0)
)(value)

readFile('./day_01/input.txt', (_, buffer) => {
  const input = R.compose(parseArrToInt, filterEmptyRows, parseBufferToArr)(buffer)

  const part1 = R.reduce(calcMass, 0, input)
  console.log(`Part 1: ${part1}`)
  const part2 = R.reduce((total, item) => total + calcWhilePositive(item), 0, input)
  console.log(`Part 2: ${part2}`)
})
