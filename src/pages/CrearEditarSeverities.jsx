// src/pages/CrearEditarSeverity.jsx
import { useParams, Link } from 'react-router-dom';
import SeverityForm from '../components/SeverityForm';
import '../css/settingsFormPage.css';

export default function CrearEditarSeverity() {
  const { id } = useParams();
  const isEdit = !!id;

  return (
    <div className="lightbox-create-edit">
      <div style={{ textAlign: 'right' }}>
        <Link to="/settings/severities" className="back-link">×</Link>
      </div>
      <h2 className="title">{isEdit ? 'Edit Severity' : 'New Severity'}</h2>
      <SeverityForm isEdit={isEdit} />
    </div>
  );
}
