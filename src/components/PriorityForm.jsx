import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/settingsFormPage.css';

export default function PriorityForm({ isEdit }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  const coloresPredefinidos = [
    '#ff5733', '#33ff57', '#3357ff',
    '#dc7633', '#f1c40f', '#8e44ad', '#1c2833'
  ];

  useEffect(() => {
    if (isEdit) {
      fetch(`https://issue-tracker-c802.onrender.com/api/priorities/${id}/`, {})
        .then(res => {
          if (!res.ok) throw new Error('Error al cargar la prioridad');
          return res.json();
        })
        .then(data => {
          setName(data.name);
          setColor(data.color);
        })
        .catch(err => {
          console.error(err);
          alert('Error al cargar la prioridad');
        });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { name, color };
    const url = isEdit
      ? `https://issue-tracker-c802.onrender.com/api/priorities/${id}/`
      : `https://issue-tracker-c802.onrender.com/api/priorities/`;
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': '3c3c0b2b3b69b41bc08455370210a9c44d3c507be9ed4f9d9724003f0fa5fcdf'
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error del servidor:', errorData);
        alert(`Error al guardar los datos: ${JSON.stringify(errorData)}`);
        return;
      }

      navigate('/settings/priorities');
    } catch (err) {
      console.error(err);
      alert('Error al conectar con el servidor');
    }
  };

  const handleColorChange = (value) => {
    setColor(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-container">
        <div className="left-column">
          <fieldset className="form-fields">
            <input
              type="text"
              name="name"
              placeholder="Name"
              maxLength="500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </fieldset>

          <div className="caracteristica-container">
            <span className="caracteristica-label">Color:</span>
            <div className="caracteristica-select-container" style={{ flexWrap: 'wrap' }}>
              {coloresPredefinidos.map((c, idx) => (
                <label key={idx}>
                  <input
                    type="radio"
                    name="color"
                    value={c}
                    checked={color === c}
                    onChange={() => handleColorChange(c)}
                  />
                  <span className="caracteristica-color" style={{ backgroundColor: c }}></span>
                </label>
              ))}
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="radio"
                  name="color"
                  value={color}
                  checked={!coloresPredefinidos.includes(color)}
                  onChange={() => {}}
                />
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(e.target.value)}
                />
                <span>Custom</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="form-buttons">
        <button type="submit" className="create-issue-button">
          {isEdit ? 'Save Changes' : 'Create Priority'}
        </button>
      </div>
    </form>
  );
}
