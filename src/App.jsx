import './App.css';
import Sidebar from './components/sidebar';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ViewIssue from './pages/ViewIssue';
import IssuesMenu from './pages/IssuesMenu';
import CrearEditarIssue from "./pages/CrearEditarIssue.jsx";
import AfegirDueDate from "./pages/AfegirDueDate.jsx";
import AfegirAssignat from "./pages/AfegirAssignats.jsx";
import AfegirWatchers from "./pages/AfegirWatchers.jsx";
import BulkInsertPage from "./pages/BulkInsert.jsx";
import TipusList from './pages/TipusList';
import CrearEditarTipus from "./pages/CrearEditarTipus.jsx";
import PrioritiesList from './pages/PrioritiesList';
import CrearEditarPriorities from "./pages/CrearEditarPriorities.jsx";

function AppContent() {
    const location = useLocation();

    const hideSidebarRoutes = [
        /^\/issues\/new$/,
        /^\/issues\/[^/]+\/edit$/,
        /^\/issues\/[^/]+\/due_date$/,
        /^\/issues\/[^/]+\/assign$/,
        /^\/issues\/bulk-insert$/,
        /^\/settings\/tipus\/create$/,
        /^\/settings\/tipus\/edit\/[^/]+$/,
        /^\/settings\/tipus\/delete\/[^/]+$/,
        /^\/settings\/priority\/create$/,
        /^\/settings\/priority\/edit\/[^/]+$/,
        /^\/settings\/priority\/delete\/[^/]+$/,
    ];

    const shouldHideSidebar = hideSidebarRoutes.some((regex) =>
        regex.test(location.pathname)
    );

    return (
        <div className="content">
            {!shouldHideSidebar && <Sidebar />}
            <Routes>
                <Route path="/issues" element={<IssuesMenu />} />
                <Route path="/issues/new" element={<CrearEditarIssue isEdit={false} />} />
                <Route path="/issues/bulk-insert" element={<BulkInsertPage />} />
                <Route path="/issues/:id" element={<ViewIssue />} />
                <Route path="/issues/:id/edit" element={<CrearEditarIssue isEdit={true} />} />
                <Route path="/issues/:id/due_date" element={<AfegirDueDate />} />
                <Route path="/issues/:id/assign" element={<AfegirAssignat />} />
                <Route path="/issues/:id/watchers" element={<AfegirWatchers />} />
                <Route path="/settings/tipus" element={<TipusList />} />
                <Route path="/settings/tipus/create" element={<CrearEditarTipus />} />
                <Route path="/settings/tipus/edit/:id" element={<CrearEditarTipus />} />
                <Route path="/settings/priorities" element={<PrioritiesList />} />
                <Route path="/settings/priorities/create" element={<CrearEditarPriorities />} />
                <Route path="/settings/priorities/edit/:id" element={<CrearEditarPriorities />} />
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
