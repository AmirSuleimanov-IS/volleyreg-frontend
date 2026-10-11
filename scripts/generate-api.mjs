// Кодогенерация клиента API из Swagger бэкенда (как в методических указаниях lab7)
import { resolve } from 'path'
import { generateApi } from 'swagger-typescript-api'

generateApi({
  name: 'Api.ts',
  output: resolve(process.cwd(), './src/api/generated'),
  url: 'http://localhost:8080/swagger/doc.json',
  httpClientType: 'axios',
  moduleNameIndex: 1, // группировка методов по второму сегменту пути: /api/participants → api.participants
})
