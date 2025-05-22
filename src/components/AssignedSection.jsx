import React, {useState} from "react";
import '../css/assignedAndWatchers.css';
import {useNavigate, useParams} from "react-router-dom";
import DeleteModal from "./deleteModal.jsx";

export default function AssignedSection({ assignedUser, refreshIssue }) {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const handleAddAssigned = () => {
        navigate(`/issues/${id}/assign`);
    };

    const unassignUser = async () => {
        const response = await fetch(`https://issue-tracker-c802.onrender.com/api/issues/${id}/assignat/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'a0e9e8d35f67afa31eb5fab93182bdf93540ee30409234dab4e5b38a453b7983',
            },
            body: JSON.stringify({ assignat: null }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Error ${response.status}: No se pudo desasignar el usuario`);
        }
        await refreshIssue();
        navigate(`/issues/${id}`);
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
                <button className="watch-button"><i className="fa-solid fa-eye"></i> Assign to me</button>
                {/* boto assign to me encara per implementar */}
            </div>
        </div>
    );
}
