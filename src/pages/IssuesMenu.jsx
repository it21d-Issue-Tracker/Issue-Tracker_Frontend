import Sidebar from "../components/sidebar.jsx";
import IssueTable from "../components/issueTable.jsx";

const IssuesMenu = () => {

    const styles = {
        page: {
            display: 'flex',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
        },
        issues: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            padding: '10px',
            overflowX: 'auto',
        },
    };

    return (
        <div style={styles.page}>
            <aside className="sidebar"> <Sidebar/> </aside>
            <section className="filters">Filtros</section>
            <main style={styles.issues}>
                <IssueTable/>
            </main>
        </div>
        );
};

export default IssuesMenu;