import React, { useState } from "react";
import '../css/assignedAndWatchers.css';
import { useNavigate, useParams } from "react-router-dom";
import DeleteModal from "./deleteModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function WatchersSection({ watchers, refreshIssue }) {
    const [showModal, setShowModal] = useState(false);
    const [userToRemove, setUserToRemove] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const { getAuthHeaders, currentUser } = useAuth();

    const handleAddWatcher = () => {
        navigate(`/issues/${id}/watchers`);
    };

    const removeWatcher = async () => {
        const updatedWatchers = watchers.filter(w => w !== userToRemove);
        const response = await fetch(`https://issue-tracker-c802.onrender.com/api/issues/${id}/watchers/`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ watchers: updatedWatchers }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Error ${response.status}: No se pudo quitar el watcher`);
        }

        await refreshIssue();
        navigate(`/issues/${id}`);
    };

    const watchSelf = async () => {
        if (!currentUser) {
            console.error('No hay usuario autenticado');
            return;
        }

        if (watchers.includes(currentUser.username)) return;

        const updatedWatchers = [...watchers, currentUser.username];

        try {
            const response = await fetch(`https://issue-tracker-c802.onrender.com/api/issues/${id}/watchers/`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ watchers: updatedWatchers }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error(errorData.detail || `Error ${response.status}: No se pudo añadir el watcher`);
                return;
            }

            await refreshIssue();
        } catch (error) {
            console.error('Error añadiendo watcher:', error);
        }
    };

    return (
        <div className="watchers-section">
            <div className="detail-label">WATCHERS</div>

            <div className="user-list">
                {watchers.map((watcher) => (
                    <div className="user-item" key={watcher}>
                        <span>{watcher}</span>
                        <button
                            className="remove-watcher"
                            onClick={() => {
                                setUserToRemove(watcher);
                                setShowModal(true);
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <DeleteModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Remove Watcher"
                itemName={userToRemove}
                entityType="watcher"
                itemId={id}
                apiEndpoint={`https://issue-tracker-c802.onrender.com/api/issues/${id}/watchers/`}
                customDeleteFunction={removeWatcher}
            />

            <div className="buttons-container">
                <button className="add-watcher-button" onClick={handleAddWatcher}>
                    + Add watcher
                </button>

                {currentUser && !watchers.includes(currentUser.username) && (
                    <button className="watch-button" onClick={watchSelf}>
                        <i className="fa-solid fa-eye"></i> Watch this issue
                    </button>
                )}
            </div>
        </div>
    );
}
