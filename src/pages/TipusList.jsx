import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/SettingsTable.css';

const TipusList = () => {
  const [tipus, setTipus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTipus = async () => {
      try {
        const res = await fetch('https://issue-tracker-c802.onrender.com/api/tipus/');
        if (!res.ok) throw new Error("Error al obtener los tipus");
        const data = await res.json();
        setTipus(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTipus();
  }, []);

  const styles = {
    content: {
      marginLeft: '360px',
      padding: '40px',
      maxWidth: '1200px',
    },
  };

  return (
    <>
      <aside className="context-sidebar">
        <ul>
          <li><Link to="/settings/priorities">Priorities</Link></li>
          <li><Link to="/settings/severities">Severities</Link></li>
          <li><Link to="/settings/statuses">Statuses</Link></li>
          <li><Link to="/settings/tipus">Types</Link></li>
        </ul>
      </aside>

      <main style={styles.content}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1>Tipus</h1>
          <Link to="/settings/tipus/create">
            <button className="new-setting-button">+ NUEVO TIPUS</button>
          </Link>
        </header>

        {loading && <p className="loading-message">Cargando tipus...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <div className="settings-list">
            <table>
              <thead>
                <tr>
                  <th>COLOR</th>
                  <th>NOMBRE</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {tipus.length > 0 ? (
                  tipus.map(tip => (
                    <tr key={tip.id}>
                      <td><span className="dot" style={{ backgroundColor: tip.color }}></span></td>
                      <td>{tip.name}</td>
                      <td>
                        <Link to={`/settings/tipus/edit/${tip.id}`} title="Editar">✏️</Link>
                        <Link to={`/settings/tipus/delete/${tip.id}`} title="Eliminar">❌</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No hay tipus disponibles.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
};

export default TipusList;
