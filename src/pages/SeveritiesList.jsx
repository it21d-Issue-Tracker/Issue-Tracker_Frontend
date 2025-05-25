import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/SettingsTable.css';
import SettingsDeleteModal from '../components/SettingsDeleteModal';

const SeveritiesList = () => {
  const [severities, setSeverities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState(null);

  const fetchSeverities = async () => {
    try {
      const res = await fetch('https://issue-tracker-c802.onrender.com/api/severity/');
      if (!res.ok) throw new Error('Error fetching severities');
      const data = await res.json();
      setSeverities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeverities();
  }, []);

  const styles = {
    content: {
      marginLeft: '360px',
      padding: '40px',
      maxWidth: '1200px',
    },
  };

  const openDeleteModal = (severity) => {
    setSelectedSeverity(severity);
    setModalOpen(true);
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
          <h1>Severities</h1>
          <Link to="/settings/severities/create">
            <button className="new-setting-button">+ NEW SEVERITY</button>
          </Link>
        </header>

        {loading && <p className="loading-message">Loading severities...</p>}
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
                {severities.length > 0 ? (
                  severities.map(severity => (
                    <tr key={severity.id}>
                      <td><span className="dot" style={{ backgroundColor: severity.color }}></span></td>
                      <td>{severity.name}</td>
                      <td>
                        <Link to={`/settings/severities/edit/${severity.id}`} title="Edit">✏️</Link>
                        <button
                          onClick={() => openDeleteModal(severity)}
                          title="Delete"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '0.5rem' }}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3">No severities available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <SettingsDeleteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        itemId={selectedSeverity?.id}
        itemName={selectedSeverity?.name}
        entityType="severity"
        apiEndpoint="https://issue-tracker-c802.onrender.com/api/severity/"
        onDeleteSuccess={fetchSeverities}
      />
    </>
  );
};

export default SeveritiesList;
