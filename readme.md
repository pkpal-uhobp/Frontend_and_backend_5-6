## Структура проекта

```
backend/   — Express API (порт 3000)
frontend/  — React приложение (порт 3001)
```

---

## Запуск проекта

### 1) Запуск бэкенда (Express)

Откройте терминал в папке `backend`:

```bash
cd backend
npm install
npm start
```

После запуска API будет доступно по адресу:

- http://localhost:3000/api/products

Проверка (в браузере): откройте `http://localhost:3000/api/products` — должен вернуться JSON.

---

### 2) Запуск фронтенда (React)

Откройте **второй** терминал в папке `frontend`:

```bash
cd frontend
npm install
npm run dev
```

После запуска сайт будет доступен по адресу:

- http://localhost:3001

---

## Возможные проблемы

### Ошибка CORS
Если в консоли браузера ошибка CORS, проверьте:
- фронт запущен на `http://localhost:3001`
- в `backend/app.js` CORS настроен на `origin: "http://localhost:3001"`
- после изменений перезапустите бэкенд

### `"react-scripts" не является внутренней или внешней командой`
Обычно означает, что не установились зависимости фронтенда.

Решение (в папке `frontend`):

```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

На Windows вместо `rm -rf` можно удалить папки вручную или командами PowerShell.

---

## Порты

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`