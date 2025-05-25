import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function UserProfile() {
    const { username } = useParams();
    const { getApiKey, currentUser, isLoading, logout } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [assignedIssues, setAssignedIssues] = useState([]);
    const [watchedIssues, setWatchedIssues] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (isLoading) {
                return;
            }

            try {
                const apiKey = getApiKey();
                if (!apiKey) {
                    setError('No API key available. Please login first.');
                    setLoading(false);
                    return;
                }

                const headers = {
                    'Authorization': apiKey,
                    'Content-Type': 'application/json'
                };

                console.log('Fetching data for user:', username);
                console.log('Using API key:', apiKey);
                console.log('Current user:', currentUser);

                const userResponse = await axios.get(
                    `https://issue-tracker-c802.onrender.com/api/usuaris/${username}/`,
                    { headers }
                );
                setUserData(userResponse.data);

                const assignedResponse = await axios.get(
                    `https://issue-tracker-c802.onrender.com/api/usuaris/${username}/assigned_issues/`,
                    { headers }
                );
                setAssignedIssues(assignedResponse.data);

                const watchedResponse = await axios.get(
                    `https://issue-tracker-c802.onrender.com/api/usuaris/${username}/watched_issues/`,
                    { headers }
                );
                setWatchedIssues(watchedResponse.data);

                const commentsResponse = await axios.get(
                    `https://issue-tracker-c802.onrender.com/api/usuaris/${username}/comments/`,
                    { headers }
                );
                setComments(commentsResponse.data);

            } catch (err) {
                console.error('Error fetching user data:', err);
                setError(`Error: ${err.response?.status} - ${err.response?.data?.detail || err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUserData();
        }
    }, [username, getApiKey, currentUser, isLoading]);

    if (isLoading) {
        return <div style={{ padding: '20px' }}>Loading authentication...</div>;
    }

    if (!currentUser) {
        return <div style={{ padding: '20px' }}>Please login first</div>;
    }

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading user data...</div>;
    }

    if (error) {
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <h1>Error</h1>
                <p>{error}</p>
                <div style={{ marginTop: '20px' }}>
                    <p><strong>Debug Info:</strong></p>
                    <p>Current User: {currentUser ? JSON.stringify(currentUser) : 'null'}</p>
                    <p>API Key: {getApiKey() || 'null'}</p>
                    <p>Auth Loading: {isLoading.toString()}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>User Profile: {username}</h1>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Logout
                </button>
            </div>

            <h2>Basic Info</h2>
            <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
        {JSON.stringify(userData, null, 2)}
      </pre>

            <h2>Assigned Issues ({assignedIssues.length})</h2>
            <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
        {JSON.stringify(assignedIssues, null, 2)}
      </pre>

            <h2>Watched Issues ({watchedIssues.length})</h2>
            <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
        {JSON.stringify(watchedIssues, null, 2)}
      </pre>

            <h2>Comments ({comments.length})</h2>
            <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
        {JSON.stringify(comments, null, 2)}
      </pre>

            <div style={{ marginTop: '20px' }}>
                <p><strong>Current logged user:</strong> {currentUser.username}</p>
                <p><strong>API Key being used:</strong> {getApiKey()}</p>
            </div>
        </div>
    );
}