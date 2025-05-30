import React, {useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import '../css/issuesTable.css';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import qs from 'qs';
import { useIssueMetadata } from '../hooks/useIssueMetadata';

const IssueTable = ({
                      selectedFilters,
                      searchTerm,
                      preloadedIssues = null
                    }) => {
  const [issues, setIssues] = useState([]);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [usersCache, setUsersCache] = useState({});

  const {
    loading: loadingMeta,
    tipus,
    gravetat,
    prioritat,
    estat,
    getColorByName
  } = useIssueMetadata();

  const getMetadataOrder = (metadataArray, value) => {
    if (!Array.isArray(metadataArray) || value == null) return -1;

    const byName = metadataArray.findIndex(item => item.name === value);
    if (byName !== -1) return byName;

    const idNum = Number(value);
    if (!isNaN(idNum)) {
      const byId = metadataArray.findIndex(item => item.id === idNum);
      if (byId !== -1) return byId;
    }

    return -1;
  };

  const sortedIssues = useMemo(() => {
    if (!preloadedIssues) return issues;

    return [...preloadedIssues].sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'tipus':
          aVal = getMetadataOrder(tipus, a.tipus);
          bVal = getMetadataOrder(tipus, b.tipus);
          break;
        case 'gravetat':
          aVal = getMetadataOrder(gravetat, a.gravetat);
          bVal = getMetadataOrder(gravetat, b.gravetat);
          break;
        case 'prioritat':
          aVal = getMetadataOrder(prioritat, a.prioritat);
          bVal = getMetadataOrder(prioritat, b.prioritat);
          break;
        case 'estat':
          aVal = getMetadataOrder(estat, a.estat);
          bVal = getMetadataOrder(estat, b.estat);
          break;
        case 'id':
          aVal = a.id;
          bVal = b.id;
          break;
        case 'data_creacio':
          aVal = new Date(a.data_creacio);
          bVal = new Date(b.data_creacio);
          break;
        case 'assignat':
          aVal = a.assignat || '';
          bVal = b.assignat || '';
          break;
        default:
          aVal = a[sortBy];
          bVal = b[sortBy];
      }

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      else if (aVal > bVal) comparison = 1;

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [preloadedIssues, sortBy, sortOrder, tipus, gravetat, prioritat, estat, issues]);

  useEffect(() => {
    if (preloadedIssues) {
      setIssues(preloadedIssues);

      const usernames = Array.from(new Set(
          preloadedIssues
              .map(issue => issue.assignat)
              .filter(username => username && !usersCache[username])
      ));

      if (usernames.length > 0) {
        const loadUsers = async () => {
          const usersData = {};
          await Promise.all(
              usernames.map(async username => {
                try {
                  const res = await axios.get(
                      `https://issue-tracker-c802.onrender.com/api/usuaris/${username}`
                  );
                  usersData[username] = res.data;
                } catch (err) {
                  console.error(`Error loading user ${username}:`, err);
                  usersData[username] = null;
                }
              })
          );
          setUsersCache(prev => ({ ...prev, ...usersData }));
        };
        loadUsers().then(() => {});
      }
    }
  }, [preloadedIssues, usersCache]);

  useEffect(() => {
    if (preloadedIssues) return; // Don't fetch if we have preloaded issues

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

        const issuesData = response.data;
        setIssues(issuesData);

        // Cache assigned user data if not already
        const usernames = Array.from(new Set(
          issuesData
            .map(issue => issue.assignat)
            .filter(username => username && !usersCache[username])
        ));

        if (usernames.length > 0) {
          const usersData = {};
          await Promise.all(
            usernames.map(async username => {
              try {
                const res = await axios.get(
                  `https://issue-tracker-c802.onrender.com/api/usuaris/${username}`
                );
                usersData[username] = res.data;
              } catch (err) {
                console.error(`Error loading user ${username}:`, err);
                usersData[username] = null;
              }
            })
          );
          setUsersCache(prev => ({ ...prev, ...usersData }));
        }
      } catch (error) {
        console.error('Error cargando las issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [sortBy, sortOrder, selectedFilters, searchTerm, preloadedIssues, usersCache]);

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

  const issuesToRender = preloadedIssues ? sortedIssues : issues;

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
          {issuesToRender.length > 0 ? (
            issuesToRender.map(issue => (
              <tr key={issuesToRender.id}>
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
                <td>{issue.estat}</td>
                <td>{new Date(issue.data_creacio).toLocaleDateString()}</td>
                <td>
                  {issue.assignat && usersCache[issue.assignat]?.profile_picture_url ? (
                    <span className="assign-avatars">
                      <img
                        src={usersCache[issue.assignat].profile_picture_url}
                        alt={issue.assignat}
                      />
                    </span>
                  ) : (
                    issue.assignat || 'Unassigned'
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
