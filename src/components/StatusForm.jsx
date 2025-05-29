import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/settingsFormPage.css';
import { useAuth } from '../context/AuthContext.jsx';

export default function StatusForm({ isEdit }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [closed, setClosed] = useState(false);
  const { getAuthHeaders } = useAuth();

  const predefinedColors = [
    '#ff5733', '#33ff57', '#3357ff',
    '#dc7633', '#f1c40f', '#8e44ad', '#1c2833'
  ];

  useEffect(() => {
    if (isEdit) {
      fetch(`https://issue-tracker-c802.onrender.com/api/statuses/${id}/`, {
        headers: getAuthHeaders(),
      })
        .then(res => {
          if (!res.ok) throw new Error('Error loading status');
          return res.json();
        })
        .then(data => {
          setName(data.name);
          setColor(data.color);
          setClosed(data.closed);
        })
        .catch(err => {
          console.error(err);
          alert('Error loading the status');
        });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, color, closed };
    const url = isEdit
      ? `https://issue-tracker-c802.onrender.com/api/statuses/${id}/`
      : `https://issue-tracker-c802.onrender.com/api/statuses/`;
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Server error:', errorData);
        alert(`Error saving data: ${JSON.stringify(errorData)}`);
        return;
      }

      navigate('/settings/statuses');
    } catch (err) {
      console.error(err);
      alert('Connection error');
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

          <div style={{ marginTop: '12px', marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={closed}
                onChange={() => setClosed(!closed)}
              />
              Closed
            </label>
          </div>

          <div className="caracteristica-container">
            <span className="caracteristica-label">Color:</span>
            <div className="caracteristica-select-container" style={{ flexWrap: 'wrap' }}>
              {predefinedColors.map((c, idx) => (
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
                  checked={!predefinedColors.includes(color)}
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
          {isEdit ? 'Save Changes' : 'Create Status'}
        </button>
      </div>
    </form>
  );
}
