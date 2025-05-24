import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/SettingsTable.css'; // Asegúrate de que aquí esté tu estilo general

const PrioritiesList = () => {
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        const res = await fetch('https://issue-tracker-c802.onrender.com/api/priorities/');
        if (!res.ok) throw new Error('Error al obtener las prioridades');
        const data = await res.json();
        setPriorities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPriorities();
  }, []);

  const styles = {
    content: {
      marginLeft: '420px', // 220px main sidebar + 200px secondary sidebar
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
          <h1>Priorities</h1>
          <Link to="/settings/priorities/create">
            <button className="new-setting-button">+ NEW PRIORITY</button>
          </Link>
        </header>

        {loading && <p className="loading-message">Loading priorities...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <div className="settings-list">
            <table>
              <thead>
                <tr>
                  <th>COLOR</th>
                  <th>NAME</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {priorities.length > 0 ? (
                  priorities.map(priority => (
                    <tr key={priority.id}>
                      <td><span className="dot" style={{ backgroundColor: priority.color }}></span></td>
                      <td>{priority.name}</td>
                      <td>
                        <Link to={`/settings/priorities/edit/${priority.id}`} title="Editar">✏️</Link>
                        <Link to={`/settings/priorities/delete/${priority.id}`} title="Eliminar">❌</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No priorities available.</td>
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

export default PrioritiesList;
