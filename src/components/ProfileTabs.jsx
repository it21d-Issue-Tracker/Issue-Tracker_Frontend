import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import IssueTable from '../components/IssueTable';
import '../css/profileTabs.css';

export default function ProfileTabs({ assignedIssues, watchedIssues, comments}) {
    const [activeTab, setActiveTab] = useState('assigned');

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }) + ' ' + date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateId = (id) => {
        return id ? id.toString().slice(0, 5) : '';
    };

    const renderAssignedIssues = () => (
        <div className="issues-container">
            <IssueTable
                preloadedIssues={assignedIssues}
                showSorting={false}
                emptyMessage="No assigned issues found."
            />
        </div>
    );

    const renderWatchedIssues = () => (
        <div className="issues-container">
            <IssueTable
                preloadedIssues={watchedIssues}
                showSorting={false}
                emptyMessage="No watched issues found."
            />
        </div>
    );

    const renderComments = () => (
        <div className="comments-list">
            {comments && comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                        <div className="comment-meta">
                            <span className="comment-issue">
                                <Link to={`/issues/${comment.issue}`} className="issue-link">
                                    Issue #{truncateId(comment.issue)}
                                </Link>
                            </span>
                            <span className="comment-date">{formatDate(comment.data)}</span>
                        </div>
                        <div className="comment-text">
                            {comment.text}
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-comments">
                    <p>No comments found.</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="profile-content">
            <div className="profile-tabs">
                <button
                    className={`tab-button ${activeTab === 'assigned' ? 'active' : ''}`}
                    onClick={() => setActiveTab('assigned')}
                >
                    <i className="fas fa-list"></i> Open Assigned Issues
                </button>
                <button
                    className={`tab-button ${activeTab === 'watched' ? 'active' : ''}`}
                    onClick={() => setActiveTab('watched')}
                >
                    <i className="far fa-eye"></i> Watched Issues
                </button>
                <button
                    className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('comments')}
                >
                    <i className="far fa-comment"></i> Comments
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'assigned' && renderAssignedIssues()}
                {activeTab === 'watched' && renderWatchedIssues()}
                {activeTab === 'comments' && renderComments()}
            </div>
        </div>
    );
}