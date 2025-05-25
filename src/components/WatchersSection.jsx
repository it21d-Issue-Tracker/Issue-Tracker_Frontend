import React, { useState } from "react";
import '../css/assignedAndWatchers.css';
import { useNavigate, useParams } from "react-router-dom";
import DeleteModal from "./deleteModal.jsx";
import {useAuth} from "../context/AuthContext.jsx";

export default function WatchersSection({ watchers, refreshIssue }) {
    const [showModal, setShowModal] = useState(false);
    const [userToRemove, setUserToRemove] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const { getAuthHeaders } = useAuth();

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

   /* Implementar quan ja hi hagi usuaris loguejats
   const handleWatchSelf = async () => {
        const response = await fetch(`https://issue-tracker-c802.onrender.com/api/issues/${id}/watchers/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '...tu_token...',
            },
            body: JSON.stringify({ watcher: currentUser }),
        });

        if (!response.ok) {
            throw new Error('No se pudo añadir como watcher');
        }

        await refreshIssue();
    };*/

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
                <button className="watch-button" /*onClick={handleWatchSelf}*/>
                    <i className="fa-solid fa-eye"></i> Watch this issue
                </button>
            </div>
        </div>
    );
}
