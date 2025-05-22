import {Link, useNavigate, useParams} from 'react-router-dom';
import '../css/issueFormPage.css';
import {useEffect, useState} from "react";
import DueDateForm from "../components/DueDateForm.jsx";
import DeleteModal from "../components/deleteModal.jsx";

function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

export default function AfegirDueDate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [dueDate, setDueDate] = useState('');
    const [comment, setComment] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'a0e9e8d35f67afa31eb5fab93182bdf93540ee30409234dab4e5b38a453b7983'
            },
            body: JSON.stringify({ due_date: dueDate, due_date_comment: comment }),
        }).then(() => navigate(`/issues/${id}`));
    };

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const deleteDueDate = async () => {
        const response = await fetch(`https://issue-tracker-c802.onrender.com/api/issues/${id}/due-date/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '5d835a42496a91a23a02fe988257a1d7ae6e4561399843f71275e010cf398e43'
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Error ${response.status}: No se pudo eliminar la fecha límite`);
        }

        closeDeleteModal();
        navigate(`/issues/${id}`);
    };

    return (
        <div className="lightbox-create-edit">
            <div style={{ textAlign: 'right' }}>
                <Link to={`/issues/${id}`} className="back-link">x</Link>
            </div>
            <h2 className="title">Set due date</h2>

            <DueDateForm
                dueDate={dueDate}
                comment={comment}
                setDueDate={setDueDate}
                setComment={setComment}
                onSubmit={handleSubmit}
                onDelete={openDeleteModal}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                title="Delete due date"
                itemName={dueDate}
                entityType="due date"
                itemId={id}
                apiEndpoint={`https://issue-tracker-c802.onrender.com/api/issues/${id}/due-date/`}
                redirectUrl={`/issues/${id}`}
                customDeleteFunction={deleteDueDate}
            />
        </div>
    );
}
