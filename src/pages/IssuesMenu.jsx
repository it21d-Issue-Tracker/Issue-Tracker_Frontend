import Sidebar from "../components/sidebar.jsx";
import IssueTable from "../components/issueTable.jsx";

const IssuesMenu = () => {

    const styles = {
        page: {
            display: 'flex',
            width: '100%',
            height: '100vh',
            marginLeft: '90px'

        },
        filters: {
            display: 'fixed',
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
    };

    return (
        <div style={styles.page}>
            <Sidebar/>
            <section style={styles.filters}>
                Filtros
            </section>
            <main style={styles.issues}>
                <IssueTable/>
            </main>
        </div>
    );
};

export default IssuesMenu;