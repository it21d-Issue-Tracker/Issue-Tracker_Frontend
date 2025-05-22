import './App.css';
import Sidebar from './components/sidebar';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ViewIssue from './pages/ViewIssue';
import IssuesMenu from './pages/IssuesMenu';
import CrearEditarIssue from "./pages/CrearEditarIssue.jsx";
import AfegirDueDate from "./pages/AfegirDueDate.jsx";

function AppContent() {
    const location = useLocation();

    const hideSidebarRoutes = [
        /^\/issues\/new$/,
        /^\/issues\/[^/]+\/edit$/,
        /^\/issues\/[^/]+\/due_date$/
    ];

    const shouldHideSidebar = hideSidebarRoutes.some((regex) =>
        regex.test(location.pathname)
    );

    return (
        <div className="content">
            {!shouldHideSidebar && <Sidebar />}
            <Routes>
                <Route path="/issues" element={<IssuesMenu />} />
                <Route path="/issues/:id" element={<ViewIssue />} />
                <Route path="/issues/new" element={<CrearEditarIssue isEdit={false} />} />
                <Route path="/issues/:id/edit" element={<CrearEditarIssue isEdit={true} />} />
                <Route path="/issues/:id/due_date" element={<AfegirDueDate />} />
            </Routes>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
