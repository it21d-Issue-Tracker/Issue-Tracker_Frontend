import React, { useState, useEffect } from 'react';
import DeleteModal from '../components/deleteModal'; 
import {Link, useNavigate, useParams} from 'react-router-dom';
import '../css/viewIssue.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AssignedSection from "../components/AssignedSection.jsx";
import WatchersSection from "../components/WatchersSection.jsx";
import { useIssueMetadata } from '../hooks/useIssueMetadata';
import {useAuth} from "../context/AuthContext.jsx";


function ViewIssue() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [attachmentToDelete, setAttachmentToDelete] = useState(null);
    
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [userProfiles, setUserProfiles] = useState({});

    const [isDeleteIssueModalOpen, setIsDeleteIssueModalOpen] = useState(false);
    const [isDeleteAttachmentModalOpen, setIsDeleteAttachmentModalOpen] = useState(false);
    const { getAuthHeaders } = useAuth();


    const {
        loading: loadingMeta,
        tipus,
        gravetat,
        prioritat,
        estat,
        getColorByName
    } = useIssueMetadata();


    useEffect(() => {
        const fetchIssueData = async () => {
            try {
                setLoading(true);
                const [issueRes, attachmentsRes, commentsRes] = await Promise.all([
                    fetch(`https://issue-tracker-c802.onrender.com/api/issues/${id}/`),
                    fetch(`https://issue-tracker-c802.onrender.com/api/attachments/per-issue/${id}/`),
                    fetch(`https://issue-tracker-c802.onrender.com/api/comentaris/per-issue/${id}/`)
                ]);

                if (!issueRes.ok || !attachmentsRes.ok) throw new Error("Error al obtener datos");

                const issueData = await issueRes.json();
                const attachmentsData = await attachmentsRes.json();
                
                setIssue(issueData);
                setAttachments(attachmentsData.attachments);
                
                if (commentsRes.ok) {
                    const commentsData = await commentsRes.json();
                    const comments = Array.isArray(commentsData) ? commentsData : [];
                    setComments(comments);
                    
                    const uniqueUsers = [...new Set(comments.map(comment => comment.autor))];
                    uniqueUsers.forEach(username => {
                        fetchUserProfile(username);
                    });
                } else {
                    console.warn("No se pudieron cargar los comentarios");
                    setComments([]);
                }
                
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

    const fetchUserProfile = async (username) => {
        if (userProfiles[username]) {
            return userProfiles[username];
        }

        try {
            const response = await fetch(`https://issue-tracker-c802.onrender.com/api/usuaris/${username}/`, {
                headers: getAuthHeaders(),
            });
            
            if (response.ok) {
                const userData = await response.json();
                setUserProfiles(prev => ({
                    ...prev,
                    [username]: userData
                }));
                return userData;
            }
        } catch (err) {
            console.error(`Error fetching user profile for ${username}:`, err);
        }
        return null;
    };

    const fetchComments = async () => {
        try {
            setLoadingComments(true);
            const response = await fetch(`https://issue-tracker-c802.onrender.com/api/comentaris/per-issue/${id}/`);
            if (response.ok) {
                const commentsData = await response.json();
                const comments = Array.isArray(commentsData) ? commentsData : [];
                setComments(comments);
                
                const uniqueUsers = [...new Set(comments.map(comment => comment.autor))];
                uniqueUsers.forEach(username => {
                    fetchUserProfile(username);
                });
            }
        } catch (err) {
            console.error("Error fetching comments:", err);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setSubmittingComment(true);
            const response = await fetch('https://issue-tracker-c802.onrender.com/api/comentaris/', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    text: newComment,
                    issue: parseInt(id)
                })
            });

            if (!response.ok) throw new Error('Error al enviar comentario');

            const newCommentData = await response.json();
            setComments(prev => [...prev, newCommentData]);
            setNewComment('');
            
            fetchUserProfile(newCommentData.autor);
            
        } catch (err) {
            console.error("Error submitting comment:", err);
        } finally {
            setSubmittingComment(false);
        }
    };

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
                headers: getAuthHeaders(),
                body: formData
            });

            if (!response.ok) throw new Error('Error al subir archivo(s)');

            const newAttachment = await response.json();
            setAttachments(prev => [...prev, newAttachment.data]);

        } catch (err) {
            console.error("Error uploading file:", err);
        }
    };
    const handleDeleteAttachment = async (attachment) => {
        setAttachmentToDelete(attachment);
        setIsDeleteAttachmentModalOpen(true);
    };

    const customDeleteAttachment = async () => {
        if (!attachmentToDelete) return;

        try {
            const response = await fetch(`https://issue-tracker-c802.onrender.com/api/attachments/${attachmentToDelete.id}/`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
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

    const formatCommentDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const handleEditClick = () => {
        navigate(`/issues/${id}/edit`);
    };

    const handleDateClick = () => {
        navigate(`/issues/${id}/due_date`);
    };

    const handleDeleteClick = () => {
        setIsDeleteIssueModalOpen(true);
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

    if (loading || loadingMeta) {
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
                        <span className="status-badge" style={{ backgroundColor: getColorByName(estat, issue.estat) }}>
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
                    <form onSubmit={handleSubmitComment} className="new-comment-form">
                        <div className="input-wrapper">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="comment-input"
                                rows="3"
                                disabled={submittingComment}
                            />
                            <button 
                                type="submit" 
                                className="save-comment-btn-inside"
                                disabled={submittingComment || !newComment.trim()}
                            >
                                {submittingComment ? '...' : 'Save'}
                            </button>
                        </div>
                    </form>
                    <div className="comments">
                        {loadingComments ? (
                            <div>Loading comments...</div>
                        ) : (
                            <>
                                {comments.map(comentari => (
                                    <div key={comentari.id}>
                                        <div className="comentari">
                                            <div className="profile-picture">
                                                <img 
                                                    src={userProfiles[comentari.autor]?.profile_picture_url || '/default-avatar.png'} 
                                                    alt="Profile Picture" 
                                                    onError={(e) => {
                                                        e.target.src = '/default-avatar.png';
                                                    }}
                                                />
                                            </div>
                                            <div className="comment-content">
                                                <div className="comment-header">
                                                    <strong className="username">{comentari.autor}</strong>
                                                    <span className="comment-date">{formatCommentDate(comentari.data)}</span>
                                                </div>
                                                <div className="comment-text">
                                                    {comentari.text}
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                ))}
                                
                            </>
                        )}
                    </div>

            
            </div>
            

            <div className="right-panel">
                <div className="detail-row">
                    <div className="detail-label">TYPE</div>
                    <div className="detail-value">
                    {issue.tipus}
                    <div
                        className="tag-color"
                        style={{
                        backgroundColor: getColorByName(
                            tipus,
                            issue.tipus
                        )
                        }}
                    />
                    </div>
                </div>

                <div className="detail-row">
                    <div className="detail-label">SEVERITY</div>
                    <div className="detail-value">
                    {issue.gravetat}
                    <div
                        className="tag-color"
                        style={{
                        backgroundColor: getColorByName(
                            gravetat,
                            issue.gravetat
                        )
                        }}
                    />
                    </div>
                </div>

                <div className="detail-row">
                    <div className="detail-label">PRIORITY</div>
                    <div className="detail-value">
                    {issue.prioritat}
                    <div
                        className="tag-color"
                        style={{
                        backgroundColor: getColorByName(prioritat, issue.prioritat)
                        }}
                    />
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
            isOpen={isDeleteIssueModalOpen}
            onClose={() => setIsDeleteIssueModalOpen(false)}
            title="Delete Issue"
            itemName={issue?.subject || 'this issue'}
            entityType="issue"
            itemId={id}
            apiEndpoint="https://issue-tracker-c802.onrender.com/api/issues"
            redirectUrl="/issues"
        />

        <DeleteModal
            isOpen={isDeleteAttachmentModalOpen}
            onClose={() => {
                setIsDeleteAttachmentModalOpen(false);
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