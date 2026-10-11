import { describe, expect, it } from 'vitest'
import { cosineSimilarity, topSimilar } from './similarity'

describe('cosineSimilarity', () => {
  it('одинаковые векторы — 1', () => {
    expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1)
  })
  it('перпендикулярные векторы — 0', () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0)
  })
  it('противоположные векторы — -1', () => {
    expect(cosineSimilarity([1, 1], [-1, -1])).toBeCloseTo(-1)
  })
})

describe('topSimilar', () => {
  const vectors = new Map<number, number[]>([
    [1, [1, 0, 0]],
    [2, [0.9, 0.1, 0]],
    [3, [0, 1, 0]],
    [4, [0.7, 0.7, 0]],
  ])

  it('возвращает k самых близких, без самого участника, по убыванию близости', () => {
    expect(topSimilar(1, vectors, 2)).toEqual([2, 4])
  })

  it('если вектора участника нет — пустой список', () => {
    expect(topSimilar(99, vectors, 3)).toEqual([])
  })
})
