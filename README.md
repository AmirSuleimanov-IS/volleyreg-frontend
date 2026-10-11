# VolleyReg — фронтенд

SPA для системы регистрации команд на Первенство ЗГУ по волейболу 2026 (тема 16: участники и заявки команд).

Стек: React 18, TypeScript, Vite, React-Bootstrap, Redux Toolkit, axios (кодогенерация из Swagger), PWA, Tauri 2. Каждая лабораторная работа — отдельная ветка (`lab5-volley-spa`, `lab6-volley-fetch`, `lab7-volley-redux`, `lab8-volley-pwa`).

```
npm install
npm run dev            # http://localhost:3000, /api проксируется на бэкенд :8080
npm run dev:https      # то же по HTTPS
npm run generate-api   # кодогенерация клиента API (бэкенд должен быть запущен)
npm run build:pages    # сборка для GitHub Pages (/volleyreg-frontend/)
npm run tauri build -- --no-bundle   # нативное приложение для гостя (src-tauri/target/release/volleyreg.exe)
npm test               # vitest
```

- GitHub Pages: публикуется workflow `.github/workflows/deploy-pages.yml` при push в `main` — https://<логин>.github.io/volleyreg-frontend/
- Бэкенд: репозиторий `volleyreg-backend`.
- Для Tauri укажите IP компьютера с бэкендом в `.env.tauri`.
