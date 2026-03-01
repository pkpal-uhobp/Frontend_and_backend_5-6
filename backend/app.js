const express = require("express");
const cors = require("cors");
const {nanoid} = require("nanoid");

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use((req, res, next) => {
    res.on("finish", () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (["POST", "PUT", "PATCH"].includes(req.method)) {
            console.log("Body:", req.body);
        }
    });
    next();
});

let products = [{
    id: nanoid(6),
    title: "Смартфон Nova X12",
    category: "Смартфоны",
    description: '6.6" OLED, 256 ГБ, 5G, NFC.',
    price: 39990,
    stock: 12,
    rating: 4.6,
}, {
    id: nanoid(6),
    title: "Ноутбук AeroBook 15",
    category: "Ноутбуки",
    description: '15.6" IPS, i5, 16 ГБ, 512 ГБ SSD.',
    price: 74990,
    stock: 7,
    rating: 4.5,
}, {
    id: nanoid(6),
    title: "Наушники SoundPro ANC",
    category: "Аудио",
    description: "Активное шумоподавление, 30 часов, Bluetooth 5.3.",
    price: 8990,
    stock: 30,
    rating: 4.4,
}, {
    id: nanoid(6),
    title: "Игровая мышь PixelMouse G7",
    category: "Периферия",
    description: "Сенсор 26K DPI, 6 кнопок, RGB.",
    price: 2490,
    stock: 40,
    rating: 4.2,
}, {
    id: nanoid(6),
    title: "Клавиатура KeyMech 87",
    category: "Периферия",
    description: "Механическая TKL, горячая замена свитчей.",
    price: 5990,
    stock: 18,
    rating: 4.3,
}, {
    id: nanoid(6),
    title: 'Монитор ViewMax 27" 144Hz',
    category: "Мониторы",
    description: "27\", 2560×1440, 144Hz, IPS, FreeSync.",
    price: 22990,
    stock: 9,
    rating: 4.5,
}, {
    id: nanoid(6),
    title: "Смарт-часы FitTime S",
    category: "Носимая электроника",
    description: "Пульс, сон, уведомления, водозащита 5ATM.",
    price: 6990,
    stock: 25,
    rating: 4.1,
}, {
    id: nanoid(6),
    title: "Внешний SSD TurboDrive 1TB",
    category: "Накопители",
    description: "USB-C, до 1050 МБ/с, прочный корпус.",
    price: 11990,
    stock: 15,
    rating: 4.7,
}, {
    id: nanoid(6),
    title: "Wi‑Fi роутер NetAir AX3000",
    category: "Сеть",
    description: "Wi‑Fi 6, MU‑MIMO, 4 антенны.",
    price: 4990,
    stock: 22,
    rating: 4.0,
}, {
    id: nanoid(6),
    title: "Колонка BoomBox Mini",
    category: "Аудио",
    description: "Bluetooth-колонка, 12 часов, защита IPX7.",
    price: 3490,
    stock: 35,
    rating: 4.3,
},];

function findProductOr404(id, res) {
    const product = products.find((p) => p.id === id);
    if (!product) {
        res.status(404).json({error: "Product not found"});
        return null;
    }
    return product;
}

function isNonEmptyString(v) {
    return typeof v === "string" && v.trim().length > 0;
}

function validateProductPayload(payload, {partial = false} = {}) {
    const errors = [];
    const checkField = (name, ok, message) => {
        if (!ok) errors.push({field: name, message});
    };

    const {title, category, description, price, stock, rating} = payload ?? {};

    if (!partial || title !== undefined) {
        checkField("title", isNonEmptyString(title), "Title is required");
    }
    if (!partial || category !== undefined) {
        checkField("category", isNonEmptyString(category), "Category is required");
    }
    if (!partial || description !== undefined) {
        checkField("description", isNonEmptyString(description), "Description is required");
    }
    if (!partial || price !== undefined) {
        const n = Number(price);
        checkField("price", Number.isFinite(n) && n > 0, "Price must be > 0");
    }
    if (!partial || stock !== undefined) {
        const n = Number(stock);
        checkField("stock", Number.isFinite(n) && n >= 0 && Number.isInteger(n), "Stock must be an integer >= 0");
    }

    if (rating !== undefined) {
        const n = Number(rating);
        checkField("rating", Number.isFinite(n) && n >= 0 && n <= 5, "Rating must be between 0 and 5");
    }

    return errors;
}

app.get("/api/products", (req, res) => {
    res.json(products);
});

app.get("/api/products/:id", (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;
    res.json(product);
});

app.post("/api/products", (req, res) => {
    const errors = validateProductPayload(req.body, {partial: false});
    if (errors.length) return res
        .status(400)
        .json({error: "Validation error", details: errors});

    const {title, category, description, price, stock, rating} = req.body;

    const newProduct = {
        id: nanoid(6),
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock), ...(rating !== undefined ? {rating: Number(rating)} : {}),
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});


app.patch("/api/products/:id", (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;

    if (req.body?.title === undefined && req.body?.category === undefined && req.body?.description === undefined && req.body?.price === undefined && req.body?.stock === undefined && req.body?.rating === undefined) {
        return res.status(400).json({error: "Nothing to update"});
    }

    const errors = validateProductPayload(req.body, {partial: true});
    if (errors.length) return res
        .status(400)
        .json({error: "Validation error", details: errors});

    const {title, category, description, price, stock, rating} = req.body;

    if (title !== undefined) product.title = title.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (rating !== undefined) product.rating = Number(rating);

    res.json(product);
});


app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const exists = products.some((p) => p.id === id);
    if (!exists) return res.status(404).json({error: "Product not found"});

    products = products.filter((p) => p.id !== id);
    return res.status(204).send();
});

app.use((req, res) => {
    res.status(404).json({error: "Not found"});
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({error: "Internal server error"});
});

app.listen(port, () => {
    console.log(`Backend API running on http://localhost:${port}`);
    console.log(`GET products: http://localhost:${port}/api/products`);
});