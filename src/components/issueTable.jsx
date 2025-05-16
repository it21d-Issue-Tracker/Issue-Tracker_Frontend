import React, { useState } from 'react';
import '../css/issuesTable.css';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const IssueTable = ({ issues }) => {
    const [sortBy, setSortBy] = useState('subject');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const sortedIssues = [...issues].sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];

        if (typeof valA === 'string') {
            return sortOrder === 'asc'
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        }

        if (valA instanceof Date) {
            return sortOrder === 'asc'
                ? valA - valB
                : valB - valA;
        }

        return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    const renderSortIcons = (column) => (
        <>
            <FaArrowUp className={sortBy === column && sortOrder === 'asc' ? 'text-primary' : 'text-muted'} />
            <FaArrowDown className={sortBy === column && sortOrder === 'desc' ? 'text-primary' : 'text-muted'} />
        </>
    );

    return (
        <div className="issue-list">
            <table>
                <thead>
                <tr>
                    {[
                        { key: 'tipus', label: 'TYPE' },
                        { key: 'gravetat', label: 'SEVERITY' },
                        { key: 'prioritat', label: 'PRIORITY' },
                        { key: 'subject', label: 'ISSUE' },
                        { key: 'estat', label: 'STATUS' },
                        { key: 'data_creacio', label: 'MODIFIED' },
                        { key: 'assignat', label: 'ASSIGN TO' },
                    ].map(({ key, label }) => (
                        <th key={key} onClick={() => handleSort(key)} style={{ cursor: 'pointer' }}>
                            {label} {renderSortIcons(key)}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {sortedIssues.length > 0 ? (
                    sortedIssues.map((issue) => (
                        <tr key={issue.id}>
                            <td><span className="dot" style={{ backgroundColor: issue.tipus?.color }}></span></td>
                            <td><span className="dot" style={{ backgroundColor: issue.gravetat?.color }}></span></td>
                            <td><span className="dot" style={{ backgroundColor: issue.prioritat?.color }}></span></td>
                            <td>#{String(issue.id).slice(0, 5)} {issue.subject}</td>
                            <td className="status-new">{issue.estat?.name}</td>
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
                    ))
                ) : (
                    <tr><td colSpan="7">No issues available.</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default IssueTable;
