import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../css/viewIssue.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function ViewIssue() {
    const { id } = useParams(); 
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIssueData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://issue-tracker-c802.onrender.com/api/issues/${id}/`);
                
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log("Datos recibidos:", data);

                setIssue(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching issue:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        if (id) {
            fetchIssueData();
        }
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatDueDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Mostrar estado de carga
    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    // Mostrar estado de error
    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    // Verificar que issue exista antes de renderizar
    if (!issue) {
        return <div className="error-message">No se encontró la issue</div>;
    }

    return (
        // Eliminamos <div className="content"> externo y usamos directamente el container
        <div className="container">
            <div className="left-panel">
                <div className="issue-header">
                    <div className="issue-number">#1 string</div>
                    <div className="issue-status">
                        <span className="status-badge" style={{ backgroundColor: '#70728F' }}>
                            New
                        </span>
                    </div>
                </div>
                <p>ISSUE</p>
                <div className="issue-meta">
                    <div>
                        Created by 
                        <br />
                        17 May 2025 08:02
                    </div>
                </div>

                <div className="description-container">
                    <label htmlFor="description-input" className="description-label">Description</label>
                    <textarea id="description-input" className="description-textarea" readOnly value="None" />
                </div>

                <div className="attachments-header">
                    <div className="attachments-count">0 Attachments</div>
                </div>

                <div className="upload-form">
                </div>

                <div className="comments-section">
                </div>
            
            </div>

            <div className="right-panel">
                <div className="detail-row">
                    <div className="detail-label">Type</div>
                    <div className="detail-value">
                        Bug
                        <div className="tag-color" style={{ backgroundColor: '#E44057' }}></div>
                    </div>
                </div>

                <div className="detail-row">
                    <div className="detail-label">Severity</div>
                    <div className="detail-value">
                        Normal
                        <div className="tag-color" style={{ backgroundColor: '#40E47C' }}></div>
                    </div>
                </div>

                <div className="detail-row">
                    <div className="detail-label">Priority</div>
                    <div className="detail-value">
                        Low
                        <div className="tag-color" style={{ backgroundColor: '#A8E440' }}></div>
                    </div>
                </div>

                <hr />

                <div className="assigned-section">
                    <div className="detail-label">ASSIGNED</div>
                    
                    <div className="buttons-container">
                    </div>
                </div>

                <hr />

                <div className="watchers-section">
                    <div className="detail-label">WATCHERS</div>
                    <div className="user-list">
                    </div>
                    <div className="buttons-container">
                    </div>
                </div>

                <hr />

                <div className="bottom-actions">
                    <button><i className="fa-regular fa-clock"></i></button>
                    <button className="delete-btn"><i className="fa-solid fa-trash"></i></button>
                    <button className="delete-btn"><i className="fa-solid fa-pencil"></i></button>
                </div>
            </div>
        </div>
    );
};

export default ViewIssue;
