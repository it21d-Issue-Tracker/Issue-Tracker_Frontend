import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/SettingsTable.css';

const StatusesList = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await fetch('https://issue-tracker-c802.onrender.com/api/statuses/');
        if (!res.ok) throw new Error('Error al obtener los estados');
        const data = await res.json();
        setStatuses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStatuses();
  }, []);

  const styles = {
    content: {
      marginLeft: '420px', // 220px + 200px de sidebars
      padding: '20px',
      maxWidth: '900px',
    },
  };

  return (
    <>
      {/* Barra lateral secundaria */}
      <aside className="context-sidebar">
        <ul>
          <li><Link to="/settings/priorities">Prioritats</Link></li>
          <li><Link to="/settings/severities">Severitats</Link></li>
          <li><Link to="/settings/statuses">Estats</Link></li>
          <li><Link to="/settings/tipus">Tipus</Link></li>
        </ul>
      </aside>

      {/* Contenido principal */}
      <main style={styles.content}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1>Statuses</h1>
          <Link to="/settings/status/create">
            <button className="new-setting-button">+ NEW STATUS</button>
          </Link>
        </header>

        {loading && <p className="loading-message">Loading statuses...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <div className="settings-list">
            <table>
              <thead>
                <tr>
                  <th>COLOR</th>
                  <th>NAME</th>
                  <th>SLUG</th>
                  <th>CLOSED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {statuses.length > 0 ? (
                  statuses.map(status => (
                    <tr key={status.id}>
                      <td><span className="dot" style={{ backgroundColor: status.color }}></span></td>
                      <td>{status.name}</td>
                      <td>{status.slug}</td>
                      <td>{status.closed ? 'Yes' : 'No'}</td>
                      <td>
                        <Link to={`/settings/status/edit/${status.id}`} title="Editar">✏️</Link>
                        <Link to={`/settings/status/delete/${status.id}`} title="Eliminar">❌</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No statuses available.</td>
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

export default StatusesList;
