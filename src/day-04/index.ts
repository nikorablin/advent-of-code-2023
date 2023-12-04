import { parseLines, readInput } from 'io'

const input = await readInput('day-04')

const getWinningNumbers = (numbers: string) => {
  const [winningNumbersStr, cardNumbersStr] = numbers.split(' | ')
  const winningNumbers = winningNumbersStr.match(/\d+/g) as string[]
  const cardNumbers = cardNumbersStr.match(/\d+/g) as string[]
  return winningNumbers.filter((number) => cardNumbers.includes(number))
}

export const part1 = () => {
  const lines = parseLines(input)
  return lines.reduce((total, line) => {
    const [,numbers] = line.split(': ')
    const winnersCount = getWinningNumbers(numbers).length

    if (winnersCount > 0) {
      return total + 2 ** (winnersCount - 1)
    }
    return total
  }, 0)
}

export const part2 = () => {
  const lines = parseLines(input)
  const count = lines.reduce((cardCounts, line, lineIdx) => {
    const [, numbers] = line.split(': ')
    const winningNumbers = getWinningNumbers(numbers)
    winningNumbers.forEach((val, idx) => cardCounts[lineIdx + idx + 1] += cardCounts[lineIdx])
    return cardCounts
  }, Array(lines.length).fill(1))
  return count.reduce((sum, count) => sum + count)
}
