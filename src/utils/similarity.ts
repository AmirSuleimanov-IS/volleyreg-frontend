// Косинусная близость двух векторов
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0
}

// id k участников, чьи векторы описаний ближе всего к участнику id (сам участник не входит)
export function topSimilar(id: number, vectors: Map<number, number[]>, k: number): number[] {
  const target = vectors.get(id)
  if (!target) return []
  return [...vectors.entries()]
    .filter(([otherId]) => otherId !== id)
    .map(([otherId, v]) => ({ otherId, score: cosineSimilarity(target, v) }))
    .sort((x, y) => y.score - x.score)
    .slice(0, k)
    .map((x) => x.otherId)
}
