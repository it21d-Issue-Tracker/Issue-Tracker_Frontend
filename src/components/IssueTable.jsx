import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/issuesTable.css';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import qs from 'qs';
import { useIssueMetadata } from '../hooks/useIssueMetadata';

const IssueTable = ({ selectedFilters, searchTerm }) => {
  const [issues, setIssues] = useState([]);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);

  const {
    loading: loadingMeta,
    tipus,
    gravetat,
    prioritat,
    estat,
    getColorByName
  } = useIssueMetadata();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const ordering = sortOrder === 'asc' ? sortBy : `-${sortBy}`;
        const params = { ordering };

        if (selectedFilters) {
          Object.entries(selectedFilters).forEach(([key, values]) => {
            if (Array.isArray(values)) params[key] = values;
          });
        }

        if (searchTerm && searchTerm.trim() !== '') {
          params.search = searchTerm.trim();
        }

        const response = await axios.get(
          'https://issue-tracker-c802.onrender.com/api/issues/',
          {
            params,
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'comma' })
          }
        );
        setIssues(response.data);
      } catch (error) {
        console.error('Error cargando las issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [sortBy, sortOrder, selectedFilters, searchTerm]);

  const handleSort = column => {
    if (sortBy === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const renderSortIcons = column => (
    <>
      <FaArrowUp
        className={sortBy === column && sortOrder === 'asc' ? 'text-primary' : 'text-muted'}
      />
      <FaArrowDown
        className={sortBy === column && sortOrder === 'desc' ? 'text-primary' : 'text-muted'}
      />
    </>
  );

  if (loading || loadingMeta) {
    return <p>Loading issues…</p>;
  }

  return (
    <div className="issue-list">
      <table>
        <thead>
          <tr>
            {[
              { key: 'tipus', label: 'TYPE' },
              { key: 'gravetat', label: 'SEVERITY' },
              { key: 'prioritat', label: 'PRIORITY' },
              { key: 'id', label: 'ISSUE' },
              { key: 'estat', label: 'STATUS' },
              { key: 'data_creacio', label: 'MODIFIED' },
              { key: 'assignat', label: 'ASSIGN TO' }
            ].map(({ key, label }) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                style={{ cursor: 'pointer' }}
              >
                {label} {renderSortIcons(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {issues.length > 0 ? (
            issues.map(issue => (
              <tr key={issue.id}>
                <td>
                  <span
                    className="dot"
                    style={{ backgroundColor: getColorByName(tipus, issue.tipus) }}
                  />
                </td>
                <td>
                  <span
                    className="dot"
                    style={{ backgroundColor: getColorByName(gravetat, issue.gravetat) }}
                  />
                </td>
                <td>
                  <span
                    className="dot"
                    style={{ backgroundColor: getColorByName(prioritat, issue.prioritat) }}
                  />
                </td>
                <td>
                  <Link to={`/issues/${issue.id}`} className="issue-link">
                    #{String(issue.id).slice(0, 5)}
                  </Link>{' '}
                  {issue.subject}
                </td>
                <td>
                  {issue.estat}
                </td>
                <td>{new Date(issue.data_creacio).toLocaleDateString()}</td>
                <td>
                  {issue.assignat?.get_profile_picture_url ? (
                    <span className="assign-avatars">
                      <img
                        src={issue.assignat.get_profile_picture_url}
                        alt={issue.assignat.username}
                      />
                    </span>
                  ) : (
                    'Unassigned'
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No issues available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IssueTable;
