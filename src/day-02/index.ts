import { parseLines, readInput } from 'io'

const input = await readInput('day-02')

const maxCubesPerColor = {
  red: 12,
  green: 13,
  blue: 14
}

type CubeColorKey = keyof typeof maxCubesPerColor

const regex = /(\d+)|(red|green|blue)/g

export const part1 = () => {
  const lines = parseLines(input)
  return lines.reduce((sum, line) => {
    const [gameIdStr, games] = line.split(':')
    const gameId = Number((gameIdStr.match(/\d+/) || [])[0])
    const sets = games.split(';')
    const isInvalidGame = sets.some((set) => {
      return set.split(',').some((cubes) => {
        const [count, color] = cubes.match(regex) || []
        return maxCubesPerColor[color as CubeColorKey] < Number(count)
      })
    })
    if (isInvalidGame) {
      return sum
    }
    return sum + gameId
  }, 0)
}

type MinCubes = {
  red: number
  green: number
  blue: number
}

export const part2 = () => {
  const lines = parseLines(input)

  return lines.reduce((sum, line) => {
    const [, games] = line.split(':')
    const sets = (games.match(/(\d+) (red|green|blue)/g) || [])
    const minCubes = sets.reduce((min: MinCubes, cubes): MinCubes => {
      const [count, color] = cubes.match(regex) || []
      return {
        ...min,
        [color]: Math.max(min[color as keyof MinCubes], Number(count)),
      }
    }, { red: 0, green: 0, blue: 0 })
    return sum + Object.values(minCubes).reduce((power, count) => power * count, 1)
  }, 0)
}
