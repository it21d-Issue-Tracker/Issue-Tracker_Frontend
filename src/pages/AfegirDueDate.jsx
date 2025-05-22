import {Link, useNavigate, useParams} from 'react-router-dom';
import '../css/issueFormPage.css';
import {useEffect, useState} from "react";
import DueDateForm from "../components/DueDateForm.jsx";

function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // torna 'YYYY-MM-DD'
}

export default function AfegirDueDate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [dueDate, setDueDate] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        fetch(`https://issue-tracker-c802.onrender.com/api/issues/${id}`)
            .then(res => res.json())
            .then(data => {
                setDueDate(formatDateForInput(data.due_date) || '');
                setComment(data.due_date_comment || '');
            });
    }, [id]);


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`https://issue-tracker-c802.onrender.com/api/issues/${id}/due-date/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: 'a0e9e8d35f67afa31eb5fab93182bdf93540ee30409234dab4e5b38a453b7983'},
            body: JSON.stringify({ due_date: dueDate, due_date_comment: comment }),
        }).then(() => navigate(`/issues/${id}`));
    };

    const handleDelete = () => {
        //fetch(`/api/issues/${id}/delete-deadline`, {
            //method: 'DELETE',
        //}).then(() => navigate(`/issues/${id}`));
    };

    return (
        <div className="lightbox-create-edit">
            <div style={{ textAlign: 'right' }}>
                <Link
                    to={`/issues/${id}`}
                    className="back-link"
                >
                    x
                </Link>
            </div>
            <h2 className="title">Set due date</h2>
            <DueDateForm
                dueDate={dueDate}
                comment={comment}
                setDueDate={setDueDate}
                setComment={setComment}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            />

        </div>
    );
}