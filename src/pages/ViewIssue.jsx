import React, { useState, useEffect } from 'react';
import DeleteModal from '../components/deleteModal'; // Importamos el componente de eliminación
import {Link, useNavigate, useParams} from 'react-router-dom';
import '../css/viewIssue.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AssignedSection from "../components/AssignedSection.jsx";
import WatchersSection from "../components/WatchersSection.jsx";

function ViewIssue() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [attachmentToDelete, setAttachmentToDelete] = useState(null); 


    useEffect(() => {
        const fetchIssueData = async () => {
            try {
                setLoading(true);
                const [issueRes, attachmentsRes] = await Promise.all([
                    fetch(`https://issue-tracker-c802.onrender.com/api/issues/${id}/`),
                    fetch(`https://issue-tracker-c802.onrender.com/api/attachments/per-issue/${id}/`)
                ]);

                if (!issueRes.ok || !attachmentsRes.ok) throw new Error("Error al obtener datos");

                const issueData = await issueRes.json();
                const attachmentsData = await attachmentsRes.json();

                setIssue(issueData);
                setAttachments(attachmentsData.attachments);
                console.log(issueData);
                
            } catch (err) {
                console.error("Error fetching issue or attachments:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchIssueData();
        }
    }, [id]);

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const files = e.target.files.files;

        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
        }
        formData.append('issue', id);

        try {
            const response = await fetch('https://issue-tracker-c802.onrender.com/api/attachments/', {
                method: 'POST',
                headers: {
                    'Authorization': '5d835a42496a91a23a02fe988257a1d7ae6e4561399843f71275e010cf398e43'
                },
                body: formData
            });

            if (!response.ok) throw new Error('Error al subir archivo(s)');

            const newAttachment = await response.json();
            setAttachments(prev => [...prev, newAttachment.data]);

        } catch (err) {
            console.error("Error uploading file:", err);
        }
    };

    const handleDeleteAttachment = async (attachmentId) => {
        setAttachmentToDelete(attachmentId);
        setIsDeleteModalOpen(true);
    };

    const customDeleteAttachment = async () => {
        if (!attachmentToDelete) return;

        try {
            const response = await fetch(`https://issue-tracker-c802.onrender.com/api/attachments/${attachmentToDelete.id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': '5d835a42496a91a23a02fe988257a1d7ae6e4561399843f71275e010cf398e43'
            }
            });

            if (response.status === 204) {
            setAttachments(prev => prev.filter(att => att.id !== attachmentToDelete.id));
            } else {
            throw new Error(`Error al eliminar el archivo. Código: ${response.status}`);
            }
        } catch (err) {
            console.error("Error deleting attachment:", err);
            throw err;  // Para que el modal muestre el error
        }
        };


    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleEditClick = () => {
        navigate(`/issues/${id}/edit`);
    };

    const handleDateClick = () => {
        navigate(`/issues/${id}/due_date`);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const refreshIssue = async () => {
        try {
            const response = await fetch(`https://issue-tracker-c802.onrender.com/api/issues/${id}/`);
            if (!response.ok) throw new Error("Error recargando issue");
            const data = await response.json();
            setIssue(data);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    if (!issue) {
        return <div className="error-message">No se encontró la issue</div>;
    }
    console.log("Rendering attachments", attachments);

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

                    <textarea id="description-input" className="description-textarea" readOnly value={issue.descripcio ? issue.descripcio : "None"} />
                </div>

                <div className="attachments-header">
                    <div className="attachments-count">{attachments.length} Attachments</div>
                </div>

                <div className="attachments-list">
                    {attachments.map(att => (
                        <div className="attachment-item" key={att.id}>
                            <div className="attachment-info">
                                <i className="fas fa-file attachment-icon"></i>
                                <a className="attachment-name" href={att.file} target="_blank" rel="noopener noreferrer">
                                {att.file.split('/').pop()}
                                </a>
                            </div>
                            <div className="attachment-actions">
                                   <button
                                       className="delete-attachment-btn"
                                       onClick={() => handleDeleteAttachment(att)}
                                       title="Eliminar archivo"
                                   >
                                       <i className="fas fa-trash"></i>
                                   </button>
                               </div>
                        </div>
                    ))}
                    </div>

                <div className="upload-form">
                    <form onSubmit={handleUpload}>
                        <input type="file" name="files" multiple required />
                        <button type="submit">Upload File(s)</button>
                    </form>
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
                <AssignedSection assignedUser={issue.assignat} refreshIssue={refreshIssue} />
                <hr />
                <WatchersSection watchers={issue.watchers} refreshIssue={refreshIssue}/>
                <hr />

                {issue.due_date && (
                    <>
                        <div className="due-date-section" style={{ textAlign: 'left' }}>
                            <div className="detail-label">DUE DATE</div>
                            <div>
                                {new Date(issue.due_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                        <hr />
                    </>
                )}

                <div className="bottom-actions">
                    <button><i className="fa-regular fa-clock" onClick={handleDateClick}></i></button>
                    <button className="delete-btn" onClick={handleDeleteClick}>
                        <i className="fa-solid fa-trash"></i>
                    </button>
                    <button className="edit" onClick={handleEditClick}>
                        <i className="fa-solid fa-pencil"></i>
                    </button>
                </div>
            </div>
        </div>

        <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            title="Delete Issue"
            itemName={issue?.subject || 'this issue'}
            entityType="issue"
            itemId={id}
            apiEndpoint="https://issue-tracker-c802.onrender.com/api/issues"
            redirectUrl="/issues"
        />

        <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
                setIsDeleteModalOpen(false);
                setAttachmentToDelete(null);
            }}
            title="Delete Attachment"
            itemName={attachmentToDelete?.file.split('/').pop() || ''}
            entityType="attachment"
            itemId={attachmentToDelete?.id}
            apiEndpoint="https://issue-tracker-c802.onrender.com/api/attachments"
            redirectUrl={null}  
            customDeleteFunction={customDeleteAttachment}
        />
      </div>
    );
};

export default ViewIssue;