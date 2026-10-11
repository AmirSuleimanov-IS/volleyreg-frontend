import { pipeline, type FeatureExtractionPipeline } from '@huggingface/transformers'

// Многоязычная модель эмбеддингов (понимает русский). Скачивается браузером один раз, дальше берётся из кэша.
const MODEL = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2'

// у pipeline() слишком сложный тип-объединение для TypeScript, поэтому задаём сигнатуру явно
const createPipeline = pipeline as unknown as (
  task: 'feature-extraction',
  model: string,
  options: { dtype: 'q8' },
) => Promise<FeatureExtractionPipeline>

let extractor: Promise<FeatureExtractionPipeline> | null = null
const cache = new Map<string, number[]>()

function getExtractor() {
  if (!extractor) {
    extractor = createPipeline('feature-extraction', MODEL, { dtype: 'q8' })
  }
  return extractor
}

// Эмбеддинги текстов (mean pooling + нормализация); уже посчитанные берутся из кэша
export async function embed(texts: string[]): Promise<number[][]> {
  const missing = texts.filter((t) => !cache.has(t))
  if (missing.length) {
    const model = await getExtractor()
    const output = await model(missing, { pooling: 'mean', normalize: true })
    const vectors = output.tolist() as number[][]
    missing.forEach((t, i) => cache.set(t, vectors[i]))
  }
  return texts.map((t) => cache.get(t)!)
}
