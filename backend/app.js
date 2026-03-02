const express = require("express");
const { nanoid } = require("nanoid");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.on("finish", () => {
        console.log(
            `[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`
        );
        if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
            console.log("Body:", req.body);
        }
    });
    next();
});

let users = [
    { id: nanoid(6), name: "Петр", age: 16 },
    { id: nanoid(6), name: "Иван", age: 18 },
    { id: nanoid(6), name: "Дарья", age: 20 },
    { id: nanoid(6), name: "Мария", age: 22 },
    { id: nanoid(6), name: "Алексей", age: 19 }
];

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API управления пользователями",
            version: "1.0.0",
            description: "Простое REST API для CRUD-операций над пользователями"
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: "Локальный сервер"
            }
        ]
    },
    apis: ["./app.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: CRUD операции над пользователями
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - age
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID пользователя
 *           example: "abc123"
 *         name:
 *           type: string
 *           description: Имя пользователя
 *           example: "Петр"
 *         age:
 *           type: integer
 *           description: Возраст пользователя
 *           example: 16
 *     UserCreate:
 *       type: object
 *       required:
 *         - name
 *         - age
 *       properties:
 *         name:
 *           type: string
 *           example: "Петр"
 *         age:
 *           type: integer
 *           example: 16
 *     UserPatch:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Иван"
 *         age:
 *           type: integer
 *           example: 19
 *   responses:
 *     NotFound:
 *       description: Сущность не найдена
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "User not found"
 */

function findUserOr404(id, res) {
    const user = users.find((u) => u.id === id);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return null;
    }
    return user;
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Создаёт нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка в теле запроса
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Name and age are required"
 */
app.post("/api/users", (req, res) => {
    const { name, age } = req.body;

    if (!name || age === undefined) {
        return res.status(400).json({ error: "Name and age are required" });
    }

    const newUser = {
        id: nanoid(6),
        name: String(name).trim(),
        age: Number(age)
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Возвращает список всех пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get("/api/users", (req, res) => {
    res.json(users);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получает пользователя по ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
app.get("/api/users/:id", (req, res) => {
    const user = findUserOr404(req.params.id, res);
    if (!user) return;
    res.json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Обновляет данные пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPatch'
 *     responses:
 *       200:
 *         description: Обновлённый пользователь
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Нет данных для обновления
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nothing to update"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
app.patch("/api/users/:id", (req, res) => {
    const user = findUserOr404(req.params.id, res);
    if (!user) return;

    if (req.body?.name === undefined && req.body?.age === undefined) {
        return res.status(400).json({ error: "Nothing to update" });
    }

    const { name, age } = req.body;

    if (name !== undefined) user.name = String(name).trim();
    if (age !== undefined) user.age = Number(age);

    res.json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Удаляет пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       204:
 *         description: Пользователь успешно удалён (нет тела ответа)
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
app.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;

    const exists = users.some((u) => u.id === id);
    if (!exists) return res.status(404).json({ error: "User not found" });

    users = users.filter((u) => u.id !== id);
    res.status(204).send();
});

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Swagger UI: http://localhost:${port}/api-docs`);
});