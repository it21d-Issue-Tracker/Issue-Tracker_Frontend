import React, { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const AuthContext = createContext();

const USERS = [
    {
        username: 'mario',
        display_name: 'Mario',
        color: '#FF0000',
        apiKey: CryptoJS.SHA256('marioISSUES').toString()
    },
    {
        username: 'luigi',
        display_name: 'Luigi',
        color: '#00FF00',
        apiKey: CryptoJS.SHA256('luigiISSUES').toString()
    },
    {
        username: 'peach',
        display_name: 'Princess Peach',
        color: '#FFB6C1',
        apiKey: CryptoJS.SHA256('peachISSUES').toString()
    },
    {
        username: 'wario',
        display_name: 'Wario',
        color: '#FFFF00',
        apiKey: CryptoJS.SHA256('warioISSUES').toString()
    },
    {
        username: 'bowser',
        display_name: 'Bowser',
        color: '#8B4513',
        apiKey: CryptoJS.SHA256('bowserISSUES').toString()
    }
];

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('issueTracker_currentUser');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setCurrentUser(user);
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('issueTracker_currentUser');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (username) => {
        const user = USERS.find(u => u.username === username);
        if (user) {
            setCurrentUser(user);
            localStorage.setItem('issueTracker_currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('issueTracker_currentUser');
    };

    const getAuthHeaders = () => {
        if (!currentUser) return {};
        return {
            'Authorization': currentUser.apiKey,
            'Content-Type': 'application/json'
        };
    };

    // Simple function to get just the API key
    const getApiKey = () => {
        return currentUser ? currentUser.apiKey : null;
    };

    const value = {
        currentUser,
        users: USERS,
        login,
        logout,
        getAuthHeaders,
        getApiKey, // Add this for easy access to API key
        isAuthenticated: !!currentUser,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};