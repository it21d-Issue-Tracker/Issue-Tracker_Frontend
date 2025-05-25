import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteModal from "./deleteModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AssignedSection({ assignedUser, refreshIssue }) {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const { getAuthHeaders, currentUser } = useAuth();

    const handleAddAssigned = () => {
        navigate(`/issues/${id}/assign`);
    };

    const unassignUser = async () => {
        const response = await fetch(`https://issue-tracker-c802.onrender.com/api/issues/${id}/assignat/`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ assignat: null }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Error ${response.status}: No se pudo desasignar el usuario`);
        }
        await refreshIssue();
        navigate(`/issues/${id}`);
    };

    const assignToMe = async () => {
        if (!currentUser) {
            console.error('No hay usuario autenticado');
            return;
        }

        try {
            const response = await fetch(`https://issue-tracker-c802.onrender.com/api/issues/${id}/assignat/`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ assignat: currentUser.username }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error(errorData.detail || `Error ${response.status}: No se pudo asignar el usuario`);
                return;
            }

            await refreshIssue();
        } catch (error) {
            console.error('Error asignando la issue a ti mismo:', error);
        }
    };

    return (
        <div className="assigned-section">
            <div className="detail-label">ASSIGNED</div>

            {assignedUser && (
                <div className="user-list">
                    <div className="user-item">
                        <span>{assignedUser}</span>
                        <button className="remove-watcher" onClick={() => setShowModal(true)}>
                            ×
                        </button>
                    </div>
                </div>
            )}

            <DeleteModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Unassign User"
                itemName={assignedUser}
                entityType="assigned user"
                itemId={id}
                apiEndpoint={`https://issue-tracker-c802.onrender.com/api/issues/${id}/assignat/`}
                customDeleteFunction={unassignUser}
            />

            <div className="buttons-container">
                <button className="add-watcher-button" onClick={handleAddAssigned}>
                    + Add assigned
                </button>

                {currentUser && assignedUser !== currentUser.username && (
                    <button className="watch-button" onClick={assignToMe}>
                        <i className="fa-solid fa-user-plus"></i> Assign to me
                    </button>
                )}
            </div>
        </div>
    );
}
