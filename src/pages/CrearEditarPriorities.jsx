import { useParams, Link } from 'react-router-dom';
import PriorityForm from '../components/PriorityForm';
import '../css/settingsFormPage.css';

export default function CrearEditarPriorities() {
  const { id } = useParams();
  const isEdit = !!id;

  return (
    <div className="lightbox-create-edit">
      <div style={{ textAlign: 'right' }}>
        <Link to="/settings/priorities" className="back-link">×</Link>
      </div>
      <h2 className="title">{isEdit ? 'Edit Priority' : 'New Priority'}</h2>
      <PriorityForm isEdit={isEdit} />
    </div>
  );
}
