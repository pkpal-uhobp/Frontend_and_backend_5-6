import React, { useEffect, useState } from "react";

export default function ProductModal({
                                         open,
                                         mode, // "create" | "edit"
                                         initialProduct,
                                         onClose,
                                         onSubmit,
                                     }) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [rating, setRating] = useState("");

    useEffect(() => {
        if (!open) return;

        setTitle(initialProduct?.title ?? "");
        setCategory(initialProduct?.category ?? "");
        setDescription(initialProduct?.description ?? "");
        setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
        setStock(initialProduct?.stock != null ? String(initialProduct.stock) : "");
        setRating(initialProduct?.rating != null ? String(initialProduct.rating) : "");
    }, [open, initialProduct]);

    if (!open) return null;

    const titleText =
        mode === "edit" ? "Редактирование товара" : "Добавление товара";

    const handleSubmit = (e) => {
        e.preventDefault();

        const t = title.trim();
        const c = category.trim();
        const d = description.trim();
        const p = Number(price);
        const s = Number(stock);

        if (!t) return alert("Введите название");
        if (!c) return alert("Введите категорию");
        if (!d) return alert("Введите описание");
        if (!Number.isFinite(p) || p <= 0) return alert("Цена должна быть > 0");
        if (!Number.isFinite(s) || s < 0 || !Number.isInteger(s))
            return alert("Количество на складе должно быть целым числом >= 0");

        let parsedRating = undefined;
        if (String(rating).trim() !== "") {
            const r = Number(rating);
            if (!Number.isFinite(r) || r < 0 || r > 5)
                return alert("Рейтинг должен быть от 0 до 5");
            parsedRating = r;
        }

        onSubmit({
            id: initialProduct?.id,
            title: t,
            category: c,
            description: d,
            price: p,
            stock: s,
            ...(parsedRating !== undefined ? { rating: parsedRating } : {}),
        });
    };

    return (
        <div className="backdrop" onMouseDown={onClose}>
            <div
                className="modal"
                onMouseDown={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="modal__header">
                    <div className="modal__title">{titleText}</div>
                    <button className="iconBtn" onClick={onClose} aria-label="Закрыть">
                        ✕
                    </button>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    <label className="label">
                        Название
                        <input
                            className="input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Например, Ноутбук..."
                            autoFocus
                        />
                    </label>

                    <label className="label">
                        Категория
                        <input
                            className="input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Например, Ноутбуки"
                        />
                    </label>

                    <label className="label">
                        Описание
                        <textarea
                            className="input textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Короткое описание товара"
                            rows={3}
                        />
                    </label>

                    <div className="row">
                        <label className="label">
                            Цена (₽)
                            <input
                                className="input"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                inputMode="numeric"
                                placeholder="Например, 49990"
                            />
                        </label>

                        <label className="label">
                            На складе (шт.)
                            <input
                                className="input"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                inputMode="numeric"
                                placeholder="Например, 10"
                            />
                        </label>
                    </div>

                    <label className="label">
                        Рейтинг (0–5, опц.)
                        <input
                            className="input"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            inputMode="decimal"
                            placeholder="Например, 4.5"
                        />
                    </label>

                    <div className="modal__footer">
                        <button type="button" className="btn" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {mode === "edit" ? "Сохранить" : "Добавить"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}