import React, { useState } from 'react';
import '../css/issuesTable.css';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    const [localTerm, setLocalTerm] = useState(searchTerm || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(localTerm);
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search by subject or description"
                value={localTerm}
                onChange={(e) => setLocalTerm(e.target.value)}
            />
            <button type="submit">
                <i className="fa fa-search"></i>
            </button>
        </form>
    );
};

export default SearchBar;
