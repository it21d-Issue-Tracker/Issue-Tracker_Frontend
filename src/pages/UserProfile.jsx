import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ProfileSidebar from '../components/ProfileSidebar';
import ProfileTabs from '../components/ProfileTabs';
import '../css/userProfile.css';

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

    const handleBioUpdate = (newBio) => {
        setUserData(prevData => ({
            ...prevData,
            biografia: newBio
        }));
    };

    const handleProfilePictureUpdate = (newProfilePictureUrl) => {
        setUserData(prevData => ({
            ...prevData,
            profile_picture_url: newProfilePictureUrl
        }));
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
        return <div className="profile-loading">Loading authentication...</div>;
    }

    if (!currentUser) {
        return <div className="profile-error">Please login first</div>;
    }

    if (loading) {
        return <div className="profile-loading">Loading user data...</div>;
    }

    if (error) {
        return (
            <div className="profile-error-container">
                <h1>Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-layout">
                <ProfileSidebar
                    userData={userData}
                    assignedIssues={assignedIssues}
                    watchedIssues={watchedIssues}
                    comments={comments}
                    currentUser={currentUser}
                    isOwnProfile={currentUser?.username === username}
                    onLogout={handleLogout}
                    onBioUpdate={handleBioUpdate}
                    onProfilePictureUpdate={handleProfilePictureUpdate}
                />
                <ProfileTabs
                    assignedIssues={assignedIssues}
                    watchedIssues={watchedIssues}
                    comments={comments}
                    currentUser={currentUser}
                />
            </div>
        </div>
    );
}