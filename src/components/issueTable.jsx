import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/issuesTable.css';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const IssueTable = () => {
    const [issues, setIssues] = useState([]);
    const [tipusList, setTipusList] = useState([]);
    const [severityList, setSeverityList] = useState([]);
    const [priorityList, setPriorityList] = useState([]);
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(false);

    // Fetch tipus, severity i priority al muntar component
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [tipusRes, severityRes, priorityRes] = await Promise.all([
                    axios.get('https://issue-tracker-c802.onrender.com/api/tipus/'),
                    axios.get('https://issue-tracker-c802.onrender.com/api/severity/'),
                    axios.get('https://issue-tracker-c802.onrender.com/api/priorities/')
                ]);
                setTipusList(tipusRes.data);
                setSeverityList(severityRes.data);
                setPriorityList(priorityRes.data);
            } catch (error) {
                console.error('Error carregant metadades:', error);
            }
        };
        fetchMetadata();
    }, []);

    // Fetch issues quan canvïi sortBy o sortOrder
    useEffect(() => {
        const fetchIssues = async () => {
            try {
                setLoading(true);
                const ordering = sortOrder === 'asc' ? sortBy : `-${sortBy}`;
                console.log('Cridant API amb:', { ordering });
                const response = await axios.get('https://issue-tracker-c802.onrender.com/api/issues/', {
                    params: { ordering }
                });
                console.log('Resposta del backend:', response.data);
                setIssues(response.data);
            } catch (error) {
                console.error("Error carregant les issues:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchIssues();
    }, [sortBy, sortOrder]);

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const renderSortIcons = (column) => (
        <>
            <FaArrowUp className={sortBy === column && sortOrder === 'asc' ? 'text-primary' : 'text-muted'} />
            <FaArrowDown className={sortBy === column && sortOrder === 'desc' ? 'text-primary' : 'text-muted'} />
        </>
    );

    const findByName = (list, name) => list.find(item => item.name === name);

    return (
        <div className="issue-list">
            {loading ? <p>Carregant dades...</p> : (
                <table>
                    <thead>
                    <tr>
                        {[{ key: 'tipus', label: 'TYPE' },
                            { key: 'gravetat', label: 'SEVERITY' },
                            { key: 'prioritat', label: 'PRIORITY' },
                            { key: 'id', label: 'ISSUE' },
                            { key: 'estat', label: 'STATUS' },
                            { key: 'data_creacio', label: 'MODIFIED' },
                            { key: 'assignat', label: 'ASSIGN TO' }
                        ].map(({ key, label }) => (
                            <th key={key} onClick={() => handleSort(key)} style={{ cursor: 'pointer' }}>
                                {label} {renderSortIcons(key)}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {issues.length > 0 ? (
                        issues.map((issue) => {
                            const tipusObj = findByName(tipusList, issue.tipus);
                            const severityObj = findByName(severityList, issue.gravetat);
                            const priorityObj = findByName(priorityList, issue.prioritat);

                            return (
                                <tr key={issue.id}>
                                    <td><span className="dot" style={{ backgroundColor: tipusObj?.color || '#ccc' }}></span></td>
                                    <td><span className="dot" style={{ backgroundColor: severityObj?.color || '#ccc' }}></span></td>
                                    <td><span className="dot" style={{ backgroundColor: priorityObj?.color || '#ccc' }}></span></td>
                                    <td>
                                        <Link to={`/issues/${issue.id}`} className="issue-link">
                                            #{String(issue.id).slice(0, 5)}
                                        </Link> {issue.subject}
                                    </td>
                                    <td className="status-new">{issue.estat}</td>
                                    <td>{new Date(issue.data_creacio).toLocaleDateString()}</td>
                                    <td>
                                        {issue.assignat?.get_profile_picture_url ? (
                                            <span className="assign-avatars">
                                                <img src={issue.assignat.get_profile_picture_url} alt={issue.assignat.username} />
                                            </span>
                                        ) : (
                                            'Unassigned'
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr><td colSpan="7">No issues available.</td></tr>
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default IssueTable;
