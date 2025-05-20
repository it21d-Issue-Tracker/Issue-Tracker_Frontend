import React, { useState, useEffect } from 'react';
import DeleteModal from '../components/deleteModal'; // Importamos el componente de eliminación
import {Link, useNavigate, useParams} from 'react-router-dom';
import '../css/viewIssue.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function ViewIssue() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Estado para controlar la visualización del modal de eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    const handleEditClick = () => {
        navigate(`/issues/${id}/edit`);
    };

    // Mostrar estado de carga
    if (loading) {
        return <div className="loading">Loading...</div>;
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
      <div className="content"> 
        <div className="container">
            <div className="left-panel">
                <div className="issue-header">
                    <div className="issue-number">#{issue.id} {issue.subject}</div>
                    <div className="issue-status">
                        <span className="status-badge" style={{ backgroundColor: issue.estat.color }}>
                            {issue.estat}
                        </span>
                    </div>
                </div>
                <p style={{ textAlign: 'left' }}>ISSUE</p>
                <div className="issue-meta">
                    <div>
                      Created by {issue.creador}
                      <br />
                      {formatDate(issue.data_creacio)}
                    </div>
                </div>

                <div className="description-container">
                    <label htmlFor="description-input" className="description-label" style={{ textAlign: 'left', display: 'block' }}>Description</label>

                    <textarea id="description-input" className="description-textarea" readOnly value="None" />
                </div>

                <div className="attachments-header">
                    <div className="attachments-count">0 Attachments</div>
                </div>

                <div className="upload-form">
                </div>

                <div className="comments-section">
                  <button className="active">Comments</button>
                </div>
            
            </div>

            <div className="right-panel">
                <div className="detail-row">
                    <div className="detail-label">TYPE</div>
                    <div className="detail-value">
                        {issue.tipus}
                        <div className="tag-color" style={{ backgroundColor: '#E44057' }}></div>
                    </div>
                </div>

                <div className="detail-row">
                    <div className="detail-label">SEVERITY</div>
                    <div className="detail-value">
                        {issue.gravetat}
                        <div className="tag-color" style={{ backgroundColor: '#40E47C' }}></div>
                    </div>
                </div>

                <div className="detail-row">
                    <div className="detail-label">PRIORITY</div>
                    <div className="detail-value">
                        {issue.prioritat}
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
                    <button className="edit" onClick={handleEditClick}>
                        <i className="fa-solid fa-pencil"></i>
                    </button>
                </div>
            </div>
        </div>

        
      </div>
    );
};

export default ViewIssue;