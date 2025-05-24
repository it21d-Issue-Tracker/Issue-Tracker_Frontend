import React, { useState } from 'react';
import IssueTable from "../components/issueTable.jsx";
import FiltersPanel from "../components/FiltersPanel.jsx";
import '../css/issuesTable.css';
import { Link } from "react-router-dom";

const IssuesMenu = () => {
    const [selectedFilters, setSelectedFilters] = useState({});

    const styles = {
        page: {
            display: 'flex',
            width: '100%',
            height: '100vh',
            marginLeft: '5vw'
        },
        filters: {
            padding: '20px',
            width: '250px',
            overflowY: 'auto',
        },
        issues: {
            flex: 1,
            padding: '20px',
            backgroundColor: '#ffffff',
            overflow: 'auto',
        },
        buttonsContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginBottom: '20px',
        }
    };

    return (
        <div style={styles.page}>
            <section style={styles.filters}>
                <FiltersPanel
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                />
            </section>

            <main style={styles.issues}>
                <div style={styles.buttonsContainer} className="buttons-container">
                    <div>
                        <Link to="/issues/new">
                            <button className="new-issue-button">+ NEW ISSUE</button>
                        </Link>
                    </div>
                    <div>
                        <Link to="/issues/bulk-insert">
                            <button className="bulk-issue-button">BULK INSERT</button>
                        </Link>
                    </div>
                </div>
                <IssueTable selectedFilters={selectedFilters} />
            </main>
        </div>
    );
};

export default IssuesMenu;
