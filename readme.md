# Frontend_and_backend_5-6 — React + Express (CRUD Users) + Swagger (OpenAPI)

Проект состоит из двух частей:
- **backend** — REST API на **Express** для сущности **User** (пользователь) + **Swagger UI**
- **frontend** — клиент на **React** для работы с пользователями

Swagger (OpenAPI) используется для автоматической генерации документации API и интерактивного тестирования запросов в браузере.

---

## Требования

- Node.js (рекомендуется **Node 18 LTS** или **Node 20 LTS**)
- npm

> Важно: не используйте `npm audit fix --force`, это может сломать зависимости.

---

## Структура проекта

```
backend/   — Express API + Swagger (порт 3000)
frontend/  — React приложение (порт 3001)
```

---

## Установка и запуск

### 1) Запуск backend (Express + Swagger)

Откройте терминал в папке `backend`:

```bash
cd backend
npm install
npm start
```

Backend будет доступен по адресу:
- `http://localhost:3000`

Swagger UI:
- `http://localhost:3000/api-docs`

---

### 2) Запуск frontend (React)

Откройте второй терминал в папке `frontend`:

```bash
cd frontend
npm install
npm run dev
```

Frontend будет доступен по адресу:
- `http://localhost:3001`

---

## Swagger (OpenAPI)

### Что такое Swagger
Swagger (OpenAPI) — инструмент для **документирования REST API**.  
В проекте документация генерируется автоматически из JSDoc-аннотаций в коде backend.

### Где открыть документацию
После запуска backend:
- `http://localhost:3000/api-docs`

### Что можно делать в Swagger UI
- увидеть список всех методов API
- посмотреть схемы данных (модели)
- нажать **Try it out** и отправлять реальные запросы к серверу прямо из браузера

---

## API: Users (CRUD)

Базовый URL (локально): `http://localhost:3000`

### Модель User
Пример объекта пользователя:

```json
{
  "id": "abc123",
  "name": "Петр",
  "age": 16
}
```

### Эндпоинты

- `GET /api/users` — получить список пользователей
- `GET /api/users/:id` — получить пользователя по `id`
- `POST /api/users` — создать пользователя  
  **Body (JSON):**
  ```json
  { "name": "Петр", "age": 16 }
  ```
- `PATCH /api/users/:id` — обновить пользователя (частично)  
  **Body (JSON), пример:**
  ```json
  { "age": 19 }
  ```
- `DELETE /api/users/:id` — удалить пользователя

---

## Частые проблемы

### Swagger не открывается
Проверь:
- backend запущен и работает на `http://localhost:3000`
- ты открываешь именно `http://localhost:3000/api-docs`

### Frontend не запускается и ошибка `"react-scripts" не является ...`
Обычно это означает, что зависимости не установились или сломались.

В `frontend`:
```bash
npm install
npm start
```

Также проверь `frontend/package.json`, чтобы `react-scripts` был нормальной версии (например, `5.0.1`).

---

## Полезные ссылки (локально)

- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- Swagger UI: http://localhost:3000/api-docs
- Users API: http://localhost:3000/api/users