import { parseLines, readInput } from 'io'

const input = await readInput('day-03')

const regex = /(\d+)/g

const arrayRange = (start: number, stop: number, step = 1) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index
  )

const addBorder = (input: string[]) => {
  const border = Array(input[0].length).fill('.').join('')
  return [
    border,
    ...input.map((line) => `.${line}.`),
    border
  ]
}

export const part1 = () => {
  const lines = addBorder(parseLines(input))

  return lines.reduce((total, line, idx, array) => {
    const matches = [...line.matchAll(regex)]
    const sum = matches.filter((match) => {
      if (match.index === undefined) {
        return false
      }
      const start = match.index
      const end = match.index + match[0].length - 1
      const range = arrayRange(start - 1, end + 1)
      return line[start - 1] !== '.'
      || line[end + 1] !== '.'
      || range.some((index) => array[idx - 1][index] !== '.' || array[idx + 1][index] !== '.')
    }).map((match) => match[1]).reduce((lineSum, partNum) => lineSum + Number(partNum), 0)
    return total + sum
  }, 0)
}

const getNeighbors = ([x, y]: [number, number]) => (
  [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1]
  ]
)

type ProductNumber = { productNumber: number; x: number; y: number }

const getProductNumberFromIntersection = (line: string, x: number): Omit<ProductNumber, 'y'> => {
  const match = [...line.matchAll(regex)].find((number) => {
    if (number.index === undefined) {
      return false
    }
    return number.index <= x && number.index + number[0].length >= x
  })

  return { productNumber: Number(match?.[0]), x: match?.index || 0 }
}

export const part2 = () => {
  const lines = addBorder(parseLines(input))

  return lines.reduce((sum, line, yIdx, grid) => {
    const asterisks = [...line.matchAll(/\*/g)]
    const ratios = asterisks.reduce((products, asterisk) => {
      if (asterisk.index === undefined) {
        return products
      }

      const neighbors = getNeighbors([asterisk.index, yIdx]).filter(([x, y]) => /^\d+$/.test(grid[y][x]))
      const factors = neighbors
        .map(([x, y]): ProductNumber => ({ ...getProductNumberFromIntersection(grid[y], x), y }))
        .reduce((productNumbers: ProductNumber[], { productNumber, x, y }): ProductNumber[] => {
          if (productNumbers.some(({ x: _x, y: _y }) => _y === y && _x === x)) {
            return productNumbers
          }
          return [...productNumbers, { x, y, productNumber }]
        }, [])
        .map(({ productNumber }) => productNumber)
      if (factors.length === 2) {
        return products + factors[0] * factors[1]
      }
      return products
    }, 0)
    return sum + ratios
  }, 0)
}
