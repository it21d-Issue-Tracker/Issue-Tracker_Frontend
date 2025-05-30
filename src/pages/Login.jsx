import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import '../css/login.css';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'https://issue-tracker-c802.onrender.com/api';

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/usuaris/`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const userData = await response.json();
            console.log('Fetched users:', userData);
            setUsers(userData);
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUserSelect = (username) => {
        if (login(username)) {
            navigate('/issues');
        }
    };

    const getInitials = (displayName, username) => {
        if (displayName && displayName.trim()) {
            return displayName.charAt(0).toUpperCase();
        }
        return username.charAt(0).toUpperCase();
    };

    const getUserDisplayName = (user) => {
        return user.display_name || user.username;
    };

    if (loading) {
        return (
            <div className="login-container">
                <div className="login-content">
                    <div className="login-header">
                        <h1 className="login-title">Issue Tracker</h1>
                        <p className="login-subtitle">Loading users...</p>
                    </div>
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="login-container">
                <div className="login-content">
                    <div className="login-header">
                        <h1 className="login-title">Issue Tracker</h1>
                        <p className="login-subtitle error-message">{error}</p>
                    </div>
                    <button
                        className="retry-button"
                        onClick={fetchUsers}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
    const AnimatedUserStats = ({ user }) => {
        const animatedAssigned = useAnimatedCounter(user.assigned_issues_count || 0, 800);
        const animatedWatched = useAnimatedCounter(user.watched_issues_count || 0, 900);
        const animatedComments = useAnimatedCounter(user.comments_count || 0, 1000);

        return (
            <div className="user-stats">
                <div className="stat-item">
                    <span className="stat-number">{animatedAssigned}</span>
                    <span className="stat-label">Assigned</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{animatedWatched}</span>
                    <span className="stat-label">Watching</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{animatedComments}</span>
                    <span className="stat-label">Comments</span>
                </div>
            </div>
        );
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-header">
                    <h1 className="login-title">Issue Tracker</h1>
                    <p className="login-subtitle">Select your user profile to continue</p>
                </div>

                <div className="users-container">
                    {Array.from({ length: Math.ceil(users.length / 5) }, (_, rowIndex) => (
                        <div key={rowIndex} className="users-row">
                            {users.slice(rowIndex * 5, (rowIndex + 1) * 5).map((user) => (
                                <div
                                    key={user.username}
                                    className="user-card"
                                    onClick={() => handleUserSelect(user.username)}
                                >
                                    <div className="user-card-header">
                                        <div className="user-avatar-large">
                                            {user.profile_picture_url ? (
                                                <img
                                                    src={user.profile_picture_url}
                                                    alt={getUserDisplayName(user)}
                                                    className="profile-picture"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className="avatar-fallback"
                                                style={{ display: user.profile_picture_url ? 'none' : 'flex' }}
                                            >
                                                {getInitials(user.display_name, user.username)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="user-card-body">
                                        <div className="user-name-large">{getUserDisplayName(user)}</div>
                                        <div className="user-username-small">@{user.username}</div>

                                        {user.biografia && (
                                            <div className="user-bio">
                                                {user.biografia.length > 100
                                                    ? `${user.biografia.substring(0, 100)}...`
                                                    : user.biografia
                                                }
                                            </div>
                                        )}

                                        {user.estat && (
                                            <div className="user-status">
                                                <span className="status-indicator"></span>
                                                {user.estat}
                                            </div>
                                        )}

                                        <AnimatedUserStats user={user} />
                                    </div>

                                    <div className="user-card-footer">
                                        <span className="select-text">Click to select</span>
                                        <div className="user-arrow-large">→</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}