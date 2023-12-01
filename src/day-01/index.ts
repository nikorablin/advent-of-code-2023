import { parseLines, readInput } from 'io'

const input = await readInput('day-01')

const isNumber = (char: string | undefined) => !Number.isNaN(Number(char))

const numberWords = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
}

type NumberWordsKey = keyof typeof numberWords

export const part1 = () => {
  const lines = parseLines(input)
  return lines.reduce((sum, str) => {
    const normalized = str.split('').filter((char) => isNumber(char))
    return sum + Number(`${normalized[0]}${normalized.slice(-1)[0]}`)
  }, 0)
}

export const part2 = () => {
  const lines = parseLines(input)
  const words = Object.keys(numberWords) as NumberWordsKey[]
  const regex = new RegExp(`(?=([0-9]${words.map((w) => `|${w}`).join('')}))`, 'g')
  return lines.reduce((sum, line) => {
    const matches = [...line.matchAll(regex)].map((match) => match[1])
    const first = matches[0]
    const last = matches.slice(-1)[0]
    const firstDigit = numberWords[first as NumberWordsKey] || first
    const lastDigit = numberWords[last as NumberWordsKey] || last || first
    return sum + Number(`${firstDigit}${lastDigit}`)
  }, 0)
}
