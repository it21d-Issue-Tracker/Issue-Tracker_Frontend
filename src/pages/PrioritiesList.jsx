import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/SettingsTable.css';
import SettingsDeleteModal from '../components/SettingsDeleteModal';

const PrioritiesList = () => {
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(null);

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

  useEffect(() => {
    fetchPriorities();
  }, []);

  const styles = {
    content: {
      marginLeft: '360px',
      padding: '40px',
      maxWidth: '1200px',
    },
  };

  const openDeleteModal = (priority) => {
    setSelectedPriority(priority);
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
                        <button
                          onClick={() => openDeleteModal(priority)}
                          title="Delete"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '0.5rem' }}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3">No priorities available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <SettingsDeleteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        itemId={selectedPriority?.id}
        itemName={selectedPriority?.name}
        entityType="priority"
        apiEndpoint="https://issue-tracker-c802.onrender.com/api/priorities/"
        onDeleteSuccess={fetchPriorities}
      />
    </>
  );
};

export default PrioritiesList;
