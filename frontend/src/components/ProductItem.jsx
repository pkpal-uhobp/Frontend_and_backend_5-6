import React from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
    const { id, title, category, description, price, stock, rating } = product;

    return (
        <div className="card">
            <div className="card__body">
                <div className="card__top">
                    <div className="card__title">{title}</div>
                    <div className="badge">{category}</div>
                </div>

                <div className="card__desc">{description}</div>

                <div className="card__meta">
                    <div className="price">{Number(price).toLocaleString("ru-RU")} ₽</div>
                    <div className="stock">На складе: {stock}</div>
                    {rating != null && (
                        <div className="rating">Рейтинг: {Number(rating).toFixed(1)} / 5</div>
                    )}
                </div>

                <div className="card__actions">
                    <button className="btn" onClick={() => onEdit(product)}>
                        Редактировать
                    </button>
                    <button className="btn btn--danger" onClick={() => onDelete(id)}>
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
}