import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/SettingsTable.css';
import SettingsDeleteModal from '../components/SettingsDeleteModal';

const TipusList = () => {
  const [tipus, setTipus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTipus, setSelectedTipus] = useState(null);

  const fetchTipus = async () => {
    try {
      const res = await fetch('https://issue-tracker-c802.onrender.com/api/tipus/');
      if (!res.ok) throw new Error("Error fetching types");
      const data = await res.json();
      setTipus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTipus();
  }, []);

  const styles = {
    content: {
      marginLeft: '360px',
      padding: '40px',
      maxWidth: '1200px',
    },
  };

  const openDeleteModal = (tip) => {
    setSelectedTipus(tip);
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
          <h1>Types</h1>
          <Link to="/settings/tipus/create">
            <button className="new-setting-button">+ NEW TYPE</button>
          </Link>
        </header>

        {loading && <p className="loading-message">Loading types...</p>}
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
                {tipus.length > 0 ? (
                  tipus.map(tip => (
                    <tr key={tip.id}>
                      <td><span className="dot" style={{ backgroundColor: tip.color }}></span></td>
                      <td>{tip.name}</td>
                      <td>
                        <Link to={`/settings/tipus/edit/${tip.id}`} title="Edit">✏️</Link>
                        <button
                          onClick={() => openDeleteModal(tip)}
                          title="Delete"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '0.5rem' }}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3">No types available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <SettingsDeleteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        itemId={selectedTipus?.id}
        itemName={selectedTipus?.name}
        entityType="type"
        apiEndpoint="https://issue-tracker-c802.onrender.com/api/tipus/"
        onDeleteSuccess={fetchTipus}
      />
    </>
  );
};

export default TipusList;
