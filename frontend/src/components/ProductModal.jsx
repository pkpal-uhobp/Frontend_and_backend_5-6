import React, { useEffect, useMemo, useState } from "react";

export default function ProductModal({ open, mode, initialUser, onClose, onSubmit }) {
    const isEdit = mode === "edit";

    const defaults = useMemo(
        () => ({
            id: initialUser?.id ?? "",
            name: initialUser?.name ?? "",
            age: initialUser?.age ?? "",
        }),
        [initialUser]
    );

    const [form, setForm] = useState(defaults);

    useEffect(() => {
        setForm(defaults);
    }, [defaults, open]);

    if (!open) return null;

    const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...(isEdit ? { id: form.id } : {}),
            name: String(form.name).trim(),
            age: Number(form.age),
        };

        if (!payload.name || Number.isNaN(payload.age)) {
            alert("Заполни имя и возраст (число)");
            return;
        }

        onSubmit(payload);
    };

    return (
        <div className="modal">
            <div className="modal__backdrop" onClick={onClose} />
            <div className="modal__content">
                <div className="modal__header">
                    <div className="modal__title">
                        {isEdit ? "Редактировать пользователя" : "Добавить пользователя"}
                    </div>
                    <button className="btn" onClick={onClose}>
                        Закрыть
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal__form">
                    <label className="field">
                        <div className="field__label">Имя</div>
                        <input
                            className="input"
                            value={form.name}
                            onChange={(e) => setField("name", e.target.value)}
                            placeholder="Например: Иван"
                        />
                    </label>

                    <label className="field">
                        <div className="field__label">Возраст</div>
                        <input
                            className="input"
                            type="number"
                            value={form.age}
                            onChange={(e) => setField("age", e.target.value)}
                            placeholder="Например: 18"
                        />
                    </label>

                    <div className="modal__actions">
                        <button className="btn btn--primary" type="submit">
                            {isEdit ? "Сохранить" : "Создать"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}