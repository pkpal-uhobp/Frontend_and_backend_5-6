import React, { useEffect, useState } from "react";
import "./ProductsPage.scss";

import ProductsList from "../../components/ProductsList";
import ProductModal from "../../components/ProductModal";
import { api } from "../../api";

export default function ProductsPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await api.getUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
            alert("Ошибка загрузки пользователей");
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setModalMode("create");
        setEditingUser(null);
        setModalOpen(true);
    };

    const openEdit = (user) => {
        setModalMode("edit");
        setEditingUser(user);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingUser(null);
    };

    const handleDelete = async (id) => {
        const ok = window.confirm("Удалить пользователя?");
        if (!ok) return;

        try {
            await api.deleteUser(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
            console.error(err);
            alert("Ошибка удаления пользователя");
        }
    };

    const handleSubmitModal = async (payload) => {
        try {
            if (modalMode === "create") {
                const created = await api.createUser(payload);
                setUsers((prev) => [...prev, created]);
            } else {
                const updated = await api.updateUser(payload.id, payload);
                setUsers((prev) => prev.map((u) => (u.id === payload.id ? updated : u)));
            }
            closeModal();
        } catch (err) {
            console.error(err);
            const msg =
                err?.response?.data?.error ||
                err?.message ||
                "Ошибка сохранения пользователя";
            alert(msg);
        }
    };

    return (
        <div className="page">
            <header className="header">
                <div className="header__inner">
                    <div className="brand">Tech Shop</div>
                    <div className="header__right">React + Express API</div>
                </div>
            </header>

            <main className="main">
                <div className="container">
                    <div className="toolbar">
                        <h1 className="title">Пользователи</h1>
                        <button className="btn btn--primary" onClick={openCreate}>
                            + Добавить
                        </button>
                    </div>

                    {loading ? (
                        <div className="empty">Загрузка...</div>
                    ) : (
                        <ProductsList users={users} onEdit={openEdit} onDelete={handleDelete} />
                    )}
                </div>
            </main>

            <footer className="footer">
                <div className="footer__inner">© {new Date().getFullYear()} Tech Shop</div>
            </footer>

            <ProductModal
                open={modalOpen}
                mode={modalMode}
                initialUser={editingUser}
                onClose={closeModal}
                onSubmit={handleSubmitModal}
            />
        </div>
    );
}