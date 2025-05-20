import IssueForm from '../components/IssueForm.jsx';
import { Link, useParams } from 'react-router-dom';
import '../css/issueFormPage.css';

export default function CrearEditarIssue({ isEdit = false }) {
    const { id } = useParams();
    return (
        <div className="lightbox-create-edit">
            <div style={{ textAlign: 'right' }}>
                <Link
                    to={isEdit ? `/issues/${id}` : `/issues`}
                    className="back-link"
                >
                    x
                </Link>
            </div>
            <h2 className="title">{isEdit ? 'Edit Issue' : 'New Issue'}</h2>
            <IssueForm isEdit={isEdit} />
        </div>
    );
}