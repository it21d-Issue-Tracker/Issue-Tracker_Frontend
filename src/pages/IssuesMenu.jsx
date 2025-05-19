import IssueTable from "../components/issueTable.jsx";
import '../css/issuesTable.css';
import {Link} from "react-router-dom";

const IssuesMenu = () => {

    const styles = {
        page: {
            display: 'flex',
            width: '100%',
            height: '100vh',
            marginLeft: '5vw'

        },
        filters: {
            display: 'fixed',
            padding: '20px',
            width: '250px',
            backgroundColor: '#f0f0f0',
            overflowY: 'hidden',
        },
        issues: {
            flex: 1,
            padding: '20px',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
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
                Filtros
            </section>
            <main style={styles.issues}>
                <div style={styles.buttonsContainer} className="buttons-container">
                    <div>
                        <Link to="/issues/new">
                            <button className="new-issue-button">+ NEW ISSUE</button>
                        </Link>
                    </div>
                    <div>
                        <Link to="/issues/bulk">
                            <button className="bulk-issue-button">BULK INSERT</button>
                        </Link>
                    </div>
                </div>
                <IssueTable/>
            </main>
        </div>
    );
};

export default IssuesMenu;