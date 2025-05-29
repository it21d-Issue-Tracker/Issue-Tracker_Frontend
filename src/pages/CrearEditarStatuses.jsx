// src/pages/CrearEditarStatus.jsx
import { useParams, Link } from 'react-router-dom';
import StatusForm from '../components/StatusForm';
import '../css/settingsFormPage.css';

export default function CrearEditarStatus() {
  const { id } = useParams();
  const isEdit = !!id;

  return (
    <div className="lightbox-create-edit">
      <div style={{ textAlign: 'right' }}>
        <Link to="/settings/statuses" className="back-link">×</Link>
      </div>
      <h2 className="title">{isEdit ? 'Edit Status' : 'New Status'}</h2>
      <StatusForm isEdit={isEdit} />
    </div>
  );
}
