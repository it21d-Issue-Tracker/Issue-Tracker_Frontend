import {Link, useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import UserSelector from "../components/UserSelector.jsx";
import axios from "axios";
import '../css/assignedAndWatchers.css';

export default function AfegirAssignat() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRes = await axios.get('https://issue-tracker-c802.onrender.com/api/usuaris/');
                setUsers(usersRes.data);

                const issueRes = await axios.get(`https://issue-tracker-c802.onrender.com/api/issues/${id}/`);
                const assignatUsername = issueRes.data.assignat;

                if (assignatUsername) {
                    setSelectedUser(assignatUsername);
                }
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
            `https://issue-tracker-c802.onrender.com/api/issues/${id}/assignat/`,
            { assignat: selectedUser }, // selectedUser és el username o null per deseleccionar
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'a0e9e8d35f67afa31eb5fab93182bdf93540ee30409234dab4e5b38a453b7983',
                },
            }
        );
        navigate(`/issues/${id}`);
    };

    return (
        <div className="lightbox-create-edit">
            <div style={{ textAlign: 'right' }}>
                <Link to={`/issues/${id}`} className="back-link">x</Link>
            </div>
            <h2 className="title">Select assigned user</h2>
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <UserSelector
                        users={users}
                        selectedUser={selectedUser}
                        onChange={setSelectedUser}
                    />
                    <button type="submit" className="create-issue-button">ADD</button>
                </form>
            )}
        </div>
    );
}
