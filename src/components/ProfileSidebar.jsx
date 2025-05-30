import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import axios from 'axios';
import '../css/profileSidebar.css';

export default function ProfileSidebar({
                                           userData,
                                           assignedIssues,
                                           watchedIssues,
                                           comments,
                                           isOwnProfile,
                                           onLogout,
                                           onBioUpdate,
                                           onProfilePictureUpdate
                                       }) {
    const { getApiKey } = useAuth();
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState('');
    const [originalBio, setOriginalBio] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [bioError, setBioError] = useState('');

    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [photoError, setPhotoError] = useState('');
    const fileInputRef = useRef(null);


    useEffect(() => {
        const currentBio = userData?.biografia || '';
        setBioText(currentBio);
        setOriginalBio(currentBio);
    }, [userData?.biografia]);

    const getInitials = (displayName, username) => {
        if (displayName && displayName.trim()) {
            return displayName.charAt(0).toUpperCase();
        }
        return username.charAt(0).toUpperCase();
    };

    const getUserDisplayName = (user) => {
        return user?.display_name || user?.username || 'Unknown User';
    };

    const getProfilePictureUrl = (user) => {
        return user?.profile_picture_url;
    };

    const openAssignedCount = assignedIssues?.filter(issue =>
        issue.estat?.name !== 'Closed' && issue.estat?.name !== 'Resolved'
    ).length || 0;

    // Animated counters :D
    const animatedAssignedCount = useAnimatedCounter(openAssignedCount, 800);
    const animatedWatchedCount = useAnimatedCounter(watchedIssues?.length || 0, 900);
    const animatedCommentsCount = useAnimatedCounter(comments?.length || 0, 1000);

    const handleEditBioClick = () => {
        setIsEditingBio(true);
        setBioError('');
    };

    const handleCancelEdit = () => {
        setIsEditingBio(false);
        setBioText(originalBio);
        setBioError('');
    };

    const handleSaveBio = async () => {
        if (isSaving) return;

        setIsSaving(true);
        setBioError('');

        try {
            const apiKey = getApiKey();
            if (!apiKey) {
                setBioError('No API key available. Please login again.');
                setIsSaving(false);
                return;
            }

            const headers = {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            };
            await axios.patch(
                `https://issue-tracker-c802.onrender.com/api/usuaris/${userData.username}/biografia/`,
                { biografia: bioText },
                { headers }
            );

            setOriginalBio(bioText);
            setIsEditingBio(false);

            if (onBioUpdate) {
                onBioUpdate(bioText);
            }

        } catch (error) {
            console.error('Error updating bio:', error);
            setBioError(
                error.response?.data?.detail ||
                error.response?.data?.error ||
                'Failed to update biography. Please try again.'
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleBioKeyPress = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSaveBio();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    const handleChangePhotoClick = () => {
        setShowPhotoModal(true);
        setPhotoError('');
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handleClosePhotoModal = () => {
        setShowPhotoModal(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        setPhotoError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setPhotoError('Please select a valid image file (JPEG, PNG, or GIF).');
            return;
        }
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setPhotoError('File size must be less than 5MB.');
            return;
        }

        setSelectedFile(file);
        setPhotoError('');

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUploadPhoto = async () => {
        if (!selectedFile || isUploadingPhoto) return;

        setIsUploadingPhoto(true);
        setPhotoError('');

        try {
            const apiKey = getApiKey();
            if (!apiKey) {
                setPhotoError('No API key available. Please login again.');
                setIsUploadingPhoto(false);
                return;
            }

            const formData = new FormData();
            formData.append('profile_picture', selectedFile);

            const response = await axios.put(
                `https://issue-tracker-c802.onrender.com/api/usuaris/${userData.username}/profile_picture/`,
                formData,
                {
                    headers: {
                        'Authorization': apiKey,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            handleClosePhotoModal();
            if (onProfilePictureUpdate) {
                onProfilePictureUpdate(response.data.profile_picture_url);
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            setPhotoError(
                error.response?.data?.detail ||
                error.response?.data?.error ||
                'Failed to update profile picture. Please try again.'
            );
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const renderBioSection = () => {
        const currentBio = bioText || '';
        const placeholderText = `No biography provided yet.${isOwnProfile ? ' Click \'Edit Bio\' to add your biography.' : ''}`;

        if (isEditingBio) {
            return (
                <div className="profile-bio">
                    <textarea
                        value={currentBio}
                        onChange={(e) => setBioText(e.target.value)}
                        onKeyDown={handleBioKeyPress}
                        placeholder="Enter your biography..."
                        className="bio-textarea"
                        rows={4}
                        maxLength={500}
                        disabled={isSaving}
                        autoFocus
                    />
                    <div className="bio-char-count">
                        {currentBio.length}/500
                    </div>
                    {bioError && (
                        <div className="bio-error">
                            {bioError}
                        </div>
                    )}
                    <div className="bio-edit-actions">
                        <button
                            className="save-bio-button"
                            onClick={handleSaveBio}
                            disabled={isSaving}
                        >
                            {isSaving ? 'SAVING...' : 'SAVE'}
                        </button>
                        <button
                            className="cancel-bio-button"
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                        >
                            CANCEL
                        </button>
                    </div>
                    <div className="bio-help-text">
                        Press Ctrl+Enter to save, Escape to cancel
                    </div>
                </div>
            );
        }

        return (
            <div className="profile-bio">
                <p>
                    {currentBio || placeholderText}
                </p>
                {isOwnProfile && (
                    <div className="profile-actions">
                        <button
                            className="edit-bio-button"
                            onClick={handleEditBioClick}
                        >
                            EDIT BIO
                        </button>
                        <button className="logout-button" onClick={onLogout}>
                            LOGOUT
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderPhotoModal = () => {
        if (!showPhotoModal) return null;

        return (
            <div className="photo-modal-overlay" onClick={handleClosePhotoModal}>
                <div className="photo-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="photo-modal-header">
                        <h3>Change Profile Picture</h3>
                        <button
                            className="photo-modal-close"
                            onClick={handleClosePhotoModal}
                            disabled={isUploadingPhoto}
                        >
                            ×
                        </button>
                    </div>

                    <div className="photo-modal-content">
                        <div className="photo-upload-area">
                            {previewUrl ? (
                                <div className="photo-preview">
                                    <img src={previewUrl} alt="Preview" />
                                </div>
                            ) : (
                                <div className="photo-upload-placeholder">
                                    <div className="upload-icon">📷</div>
                                    <p>Select an image to preview</p>
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*"
                            className="photo-file-input"
                            disabled={isUploadingPhoto}
                        />

                        {photoError && (
                            <div className="photo-error">
                                {photoError}
                            </div>
                        )}

                        <div className="photo-modal-actions">
                            <button
                                className="photo-select-button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingPhoto}
                            >
                                SELECT FILE
                            </button>
                            <button
                                className="photo-upload-button"
                                onClick={handleUploadPhoto}
                                disabled={!selectedFile || isUploadingPhoto}
                            >
                                {isUploadingPhoto ? 'UPLOADING...' : 'UPLOAD'}
                            </button>
                            <button
                                className="photo-cancel-button"
                                onClick={handleClosePhotoModal}
                                disabled={isUploadingPhoto}
                            >
                                CANCEL
                            </button>
                        </div>

                        <div className="photo-help-text">
                            Supported formats: JPEG, PNG, GIF. Max size: 5MB.
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="profile-sidebar">
            <div className="avatar-container">
                {getProfilePictureUrl(userData) ? (
                    <img
                        src={getProfilePictureUrl(userData)}
                        alt="Profile Picture"
                        className="profile-avatar"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div
                    className="avatar-fallback"
                    style={{ display: getProfilePictureUrl(userData) ? 'none' : 'flex' }}
                >
                    {getInitials(userData?.display_name, userData?.username)}
                </div>

                {isOwnProfile && (
                    <button
                        className="change-photo-button"
                        onClick={handleChangePhotoClick}
                        title="Change profile picture"
                    >
                        ⚙️
                    </button>
                )}
            </div>

            <div className="profile-name-container">
                <h2 className="profile-name">{getUserDisplayName(userData)}</h2>
            </div>
            <div className="profile-username">@{userData?.username?.toLowerCase()}</div>

            <div className="profile-stats-summary">
                <div className="stat-item">
                    <span className="stat-number">{animatedAssignedCount}</span>
                    <span className="stat-label">Open<br/>Assigned<br/>Issues</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{animatedWatchedCount}</span>
                    <span className="stat-label">Watched<br/>Issues</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{animatedCommentsCount}</span>
                    <span className="stat-label">Comments</span>
                </div>
            </div>

            {renderBioSection()}
            {renderPhotoModal()}
        </div>
    );
}