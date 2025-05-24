import { useParams, Link } from 'react-router-dom';
import TipusForm from '../components/TipusForm';
import '../css/settingsFormPage.css';

export default function CrearEditarTipus() {
  const { id } = useParams();
  const isEdit = !!id;

  return (
    <div className="lightbox-create-edit">
      <div style={{ textAlign: 'right' }}>
        <Link to="/settings/tipus" className="back-link">×</Link>
      </div>
      <h2 className="title">{isEdit ? 'Edit Type' : 'New Type'}</h2>
      <TipusForm isEdit={isEdit} />
    </div>
  );
}
