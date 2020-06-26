import * as R from 'ramda'
import { readFile } from 'fs'

const filterEmptyRows = R.filter(R.compose(R.not, R.isEmpty))

const parseBufferToArr = buffer => buffer.toString('utf-8').split(',')

const parseArrToInt = R.map(item => parseInt(item, 10))

const CHUNK = 4

const opcodeOperator = {
  1: (x, y) => x + y,
  2: (x, y) => x * y,
}

const applyOpcodeFn = (opcode, input1, input2) => opcodeOperator[opcode](input1, input2)

const setParams = R.curry((noun, verb, list) =>
  R.compose(R.update(2, verb), R.update(1, noun))(list)
)

const getInput = (i, inputs) => inputs[inputs[i]]

const replaceAt = (array, index, value) => {
  const ret = [...array]
  ret[index] = value
  return ret
}


const setOutput = R.curry((i, inputs) => 
  R.update(
    inputs[i + 3],
    applyOpcodeFn(inputs[i], getInput(i + 1, inputs), getInput(i + 2, inputs)),
    inputs
  )
)

const process = R.curry((i, inputs) =>
    R.equals(99, inputs[i]) ? inputs : process(i + CHUNK, setOutput(i, inputs)))

const process2 = R.curry((i, inputs) => {
  const opcode = inputs[i]
  if (opcode === 99) return inputs
  const input1 = getInput(i+1, inputs)
  const input2 = getInput(i+2, inputs)
  const outputPosition = inputs[i + 3]
  const value = opcodeOperator[opcode](input1, input2)
  inputs[outputPosition] = value
  return process2(i + CHUNK, inputs)
})

const POSSIBLE_PARAMETERS = R.range(0, 100)

const setParamsAndProcess = R.curry((noun, verb, inputs) =>
  process2(0, setParams(noun, verb, inputs))[0])

const tryNouns = (pursuedValue, inputs, verb) =>
  R.reduceWhile(
    R.equals(false),
    (_, noun) => {
      const done = R.equals(pursuedValue, setParamsAndProcess(noun, verb, inputs))
      if (done) {
        console.log(`Part 2 ${100 * noun + verb}`)
        return true
      }
      return false
    },
    false,
    POSSIBLE_PARAMETERS
  )

const part2Calc = (pursuedValue, inputs) =>
  R.reduceWhile(
    R.equals(false),
    (_, verb) => tryNouns(pursuedValue, inputs, verb),
    false,
    POSSIBLE_PARAMETERS
  )

readFile('./day_02/input.txt', (_, buffer) => {
  const input = R.compose(parseArrToInt, filterEmptyRows, parseBufferToArr)(buffer)
  console.log(`Part 1 ${setParamsAndProcess(12, 2, input)}`)
  part2Calc(19690720, input)
})
