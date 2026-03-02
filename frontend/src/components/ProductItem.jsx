import React from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
    const { id, name, age } = product;

    return (
        <div className="card">
            <div className="card__body">
                <div className="card__top">
                    <div className="card__title">{name}</div>
                    <div className="badge">{age} лет</div>
                </div>

                <div className="card__meta">
                    <div className="stock">ID: {id}</div>
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