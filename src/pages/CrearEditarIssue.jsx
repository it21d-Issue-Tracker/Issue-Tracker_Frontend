import IssueForm from '../components/IssueForm.jsx';
import '../css/issueFormPage.css';

export default function CrearEditarIssue({ isEdit = false }) {
    return (
        <div className="lightbox-create-edit">
            <div style={{ textAlign: 'right' }}>
                {/* creu per a tornar enrere, falta fer routers <a href={isEdit ? `/issue/123` : `/issues`} className="back-link">x</a> */}
            </div>
            <h2 className="title">{isEdit ? 'Edit Issue' : 'New Issue'}</h2>
            <IssueForm isEdit={isEdit} />
        </div>
    );
}