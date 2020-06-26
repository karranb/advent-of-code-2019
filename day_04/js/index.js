import { readFile } from 'fs'

const hasAtLeastDoubleAdjacent = arr => {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === arr[i - 1]) {
      return true
    }
  }
  return false
}

const hasExactlyDoubleAdjacent = int => {
  const arr = `${int}`.split('')
  for (let i = 1; i < arr.length; i++) {
    const next = i + 1 < arr.length ? arr[i + 1] : null
    const current = arr[i]
    if (next === current) {
      continue
    }
    const hasExactlyDoubleAdjacent = arr.slice(0, i).filter(prev => prev === current).length === 1 
    if (hasExactlyDoubleAdjacent) {
      return true
    }
  }
  return false
}

const digitsNeverDecrese = arr => {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      return false
    }
  }
  return true
}

const fitsCriteria = password => {
  const arr = `${password}`.split('')
  return hasAtLeastDoubleAdjacent(arr) && digitsNeverDecrese(arr)
}

const generatePasswordsInRange = (start, end) =>
  new Array(end - start).fill(0).map((_, i) => start + i)

const parseToInt = str => Number.parseInt(str, 10)

const parseBufferToRange = buffer =>
  buffer
    .toString('utf-8')
    .split('-')
    .map(parseToInt)

readFile('./day_04/input.txt', (_, buffer) => {
  const [start, end] = parseBufferToRange(buffer)
  const passwords = generatePasswordsInRange(start, end).filter(fitsCriteria)
  console.log(`part 1 ${passwords.length}`)
  const part2Passwords = passwords.filter(hasExactlyDoubleAdjacent)
  console.log(`part 2 ${part2Passwords.length}`)
})
