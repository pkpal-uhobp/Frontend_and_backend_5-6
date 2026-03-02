import React from "react";

export default function ProductsList({ users, onEdit, onDelete }) {
    if (!users || users.length === 0) {
        return <div className="empty">Пользователей нет</div>;
    }

    return (
        <div className="list">
            {users.map((u) => (
                <div key={u.id} className="card">
                    <div className="card__body">
                        <div className="card__title">{u.name}</div>
                        <div className="card__desc">Возраст: {u.age}</div>
                    </div>

                    <div className="card__actions">
                        <button className="btn" onClick={() => onEdit(u)}>
                            Изменить
                        </button>
                        <button className="btn btn--danger" onClick={() => onDelete(u.id)}>
                            Удалить
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}