import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/login.css';

export default function Login() {
    const { users, login } = useAuth();
    const navigate = useNavigate();

    const handleUserSelect = (username) => {
        if (login(username)) {
            navigate('/issues');
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-header">
                    <h1 className="login-title">Issue Tracker</h1>
                    <p className="login-subtitle">Select your user profile to continue</p>
                </div>

                <div className="users-list">
                    {users.map((user) => (
                        <div
                            key={user.username}
                            className="user-item"
                            onClick={() => handleUserSelect(user.username)}
                        >
                            <div className="user-avatar">
                                {user.display_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-details">
                                <div className="user-name">{user.display_name}</div>
                                <div className="user-username">@{user.username}</div>
                            </div>
                            <div className="user-arrow">→</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}