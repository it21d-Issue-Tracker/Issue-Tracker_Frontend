import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import MultiUserSelector from '../components/MultiUserSelector.jsx';
import '../css/assignedAndWatchers.css';
import {useAuth} from "../context/AuthContext.jsx";

export default function AddWatchersPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getAuthHeaders } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRes = await axios.get('https://issue-tracker-c802.onrender.com/api/usuaris/');
                setUsers(usersRes.data);

                const issueRes = await axios.get(`https://issue-tracker-c802.onrender.com/api/issues/${id}/`);
                const currentWatchers = issueRes.data.watchers || [];

                setSelectedUsers(currentWatchers);
            } catch (error) {
                console.error('Error carregant dades:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.patch(
            `https://issue-tracker-c802.onrender.com/api/issues/${id}/watchers/`,
            { watchers: selectedUsers },
            {
                headers: getAuthHeaders(),
            }
        );
        navigate(`/issues/${id}`);
    };

    return (
        <div className="lightbox-create-edit">
            <div style={{ textAlign: 'right' }}>
                <Link to={`/issues/${id}`} className="back-link">x</Link>
            </div>
            <h2 className="title">Select watchers</h2>
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <MultiUserSelector
                        users={users}
                        selectedUsers={selectedUsers}
                        onChange={setSelectedUsers}
                    />
                    <button type="submit" className="create-issue-button">ADD</button>
                </form>
            )}
        </div>
    );
}
