import Sidebar from "../components/sidebar.jsx";
import IssueTable from "../components/issueTable.jsx";

const IssuesMenu = () => {
    const mockIssues = [
        {
            id: 12345,
            subject: 'Error en login',
            tipus: { color: '#f00' },
            gravetat: { color: '#f90' },
            prioritat: { color: '#0f0' },
            estat: { name: 'Abierto' },
            data_creacio: '2024-05-12',
            assignat: { username: 'juan', get_profile_picture_url: 'https://i.pravatar.cc/30?u=juan' },
        },
        {
            id: 12345,
            subject: 'Error en login',
            tipus: { color: '#f00' },
            gravetat: { color: '#f90' },
            prioritat: { color: '#0f0' },
            estat: { name: 'Abierto' },
            data_creacio: '2024-05-12',
            assignat: { username: 'juan', get_profile_picture_url: 'https://i.pravatar.cc/30?u=juan' },
        },
        {
            id: 12345,
            subject: 'Error en login',
            tipus: { color: '#f00' },
            gravetat: { color: '#f90' },
            prioritat: { color: '#0f0' },
            estat: { name: 'Abierto' },
            data_creacio: '2024-05-12',
            assignat: { username: 'juan', get_profile_picture_url: 'https://i.pravatar.cc/30?u=juan' },
        }


    ];
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
                <IssueTable issues={mockIssues}/>
            </main>
        </div>
        );
};

export default IssuesMenu;