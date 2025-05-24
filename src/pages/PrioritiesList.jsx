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
        if (!res.ok) throw new Error('Error fetching priorities');
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
      marginLeft: '360px',
      padding: '40px',
      maxWidth: '1200px',
    },
  };

  return (
    <>
      {/* Sidebar */}
      <aside className="context-sidebar">
        <ul>
          <li><Link to="/settings/priorities">Priorities</Link></li>
          <li><Link to="/settings/severities">Severities</Link></li>
          <li><Link to="/settings/statuses">Statuses</Link></li>
          <li><Link to="/settings/tipus">Types</Link></li>
        </ul>
      </aside>

      {/* Main content */}
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
                        <Link to={`/settings/priorities/edit/${priority.id}`} title="Edit">✏️</Link>
                        <Link to={`/settings/priorities/delete/${priority.id}`} title="Delete">❌</Link>
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
