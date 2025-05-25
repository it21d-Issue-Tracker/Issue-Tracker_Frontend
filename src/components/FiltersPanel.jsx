import React, { useEffect, useState } from 'react';
import '../css/filters.css';

const API_BASE = 'https://issue-tracker-c802.onrender.com/api';

function FiltersPanel({ selectedFilters, setSelectedFilters }) {
    const [options, setOptions] = useState({
        tipus: [],
        gravetat: [],
        estat: [],
        prioritat: [],
        creador: [],
        assignat: [],
    });

    const [expanded, setExpanded] = useState({
        tipus: false,
        gravetat: false,
        estat: false,
        prioritat: false,
        creador: false,
        assignat: false,
    });

    useEffect(() => {
        const fetchOptions = async () => {
            const endpoints = {
                tipus: `${API_BASE}/tipus/`,
                gravetat: `${API_BASE}/severity/`,
                estat: `${API_BASE}/statuses/`,
                prioritat: `${API_BASE}/priorities/`,
                creador: `${API_BASE}/usuaris/`,
                assignat: `${API_BASE}/usuaris/`,
            };

            for (const key in endpoints) {
                try {
                    const res = await fetch(endpoints[key]);
                    const data = await res.json();
                    setOptions(prev => ({ ...prev, [key]: data }));
                } catch (err) {
                    console.error(`Error carregant ${key}:`, err);
                }
            }
        };
        fetchOptions();
    }, []);

    const toggleExpanded = (key) => {
        setExpanded(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleCheckboxChange = (key, value) => {
        setSelectedFilters(prev => {
            const current = prev[key] || [];
            const exists = current.includes(value);
            const updated = exists
                ? current.filter(v => v !== value)
                : [...current, value];

            return {
                ...prev,
                [key]: updated.length > 0 ? updated : undefined,
            };
        });
    };

    const renderCheckboxGroup = (key, label) => (
        <div className={`filter-card ${expanded[key] ? 'open' : ''}`} key={key}>
            <div className="filter-header" onClick={() => toggleExpanded(key)}>
                <span className="filter-title">{label}</span>
                <span className={`filter-arrow ${expanded[key] ? 'rotated' : ''}`}>&#9654;</span>
            </div>
            <div className="filter-options">
                {options[key].map(opt => {
                    const value = opt.name || opt.username;
                    const isChecked = selectedFilters[key]?.includes(value) || false;
                    return (
                        <label key={value}>
                            <input
                                type="checkbox"
                                value={value}
                                checked={isChecked}
                                onChange={() => handleCheckboxChange(key, value)}
                            />{' '}
                            {value}
                        </label>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="filter-box">
            <h3>Filters</h3>
            {renderCheckboxGroup('tipus', 'Type')}
            {renderCheckboxGroup('gravetat', 'Severity')}
            {renderCheckboxGroup('estat', 'Status')}
            {renderCheckboxGroup('prioritat', 'Priority')}
            {renderCheckboxGroup('creador', 'Created by')}
            {renderCheckboxGroup('assignat', 'Assigned to')}
        </div>
    );
}

export default FiltersPanel;
