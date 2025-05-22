import React from "react";
import '../css/assignedAndWatchers.css';
import {useNavigate, useParams} from "react-router-dom";

export default function AssignedSection({ assignedUser }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const handleAddAssigned = () => {
        navigate(`/issues/${id}/assign`);
    };
    return (
        <div className="assigned-section">
            <div className="detail-label">ASSIGNED</div>

            {assignedUser && (
                <div className="user-list">
                    <div className="user-item">
                        <span>{assignedUser}</span>
                        {/* boto per a desasignar encar per implementar*/}
                        <button className="remove-watcher" disabled>
                            ×
                        </button>
                    </div>
                </div>
            )}

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
