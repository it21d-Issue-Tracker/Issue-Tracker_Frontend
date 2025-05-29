import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/SettingsTable.css';
import SettingsDeleteModal from '../components/SettingsDeleteModal';
import { useAuth } from '../context/AuthContext';

const StatusesList = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const { getAuthHeaders } = useAuth();

  const fetchStatuses = async () => {
    try {
      const res = await fetch('https://issue-tracker-c802.onrender.com/api/statuses/', {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Error fetching statuses');
      const data = await res.json();
      setStatuses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const openDeleteModal = (status) => {
    setSelectedStatus(status);
    setModalOpen(true);
  };

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
                        <Link to={`/settings/statuses/edit/${status.id}`} title="Edit">✏️</Link>
                        <button
                          onClick={() => openDeleteModal(status)}
                          title="Delete"
                          style={{background: 'none', border: 'none', cursor: 'pointer', marginLeft: '0.5rem'}}
                        >
                          ❌
                        </button>
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

      <SettingsDeleteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        itemId={selectedStatus?.id}
        itemName={selectedStatus?.name}
        entityType="status"
        apiEndpoint="https://issue-tracker-c802.onrender.com/api/statuses/"
        onDeleteSuccess={() => {
          fetchStatuses();
          setModalOpen(false);
        }}
      />
    </>
  );
};

export default StatusesList;
