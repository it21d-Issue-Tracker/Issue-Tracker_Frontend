import './App.css';
import Sidebar from './components/sidebar';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
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
import SeveritiesList from "./pages/SeveritiesList.jsx";
import CrearEditarSeverity from "./pages/CrearEditarSeverities.jsx";
import StatusesList from "./pages/StatusesList.jsx";
import CrearEditarStatus from "./pages/CrearEditarStatuses.jsx";

function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function AppContent() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    const hideSidebarRoutes = [
        /^\/login$/,
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
        /^\/settings\/severity\/create$/,
        /^\/settings\/severity\/edit\/[^/]+$/,
        /^\/settings\/severity\/delete\/[^/]+$/,
        /^\/settings\/status\/create$/,
        /^\/settings\/status\/edit\/[^/]+$/,
        /^\/settings\/status\/delete\/[^/]+$/,
    ];

    const shouldHideSidebar = hideSidebarRoutes.some((regex) =>
        regex.test(location.pathname)
    );

    return (
        <div className="content">
            {!shouldHideSidebar && isAuthenticated && <Sidebar />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/user/:username" element={<UserProfile />} />
                <Route path="/" element={<Navigate to="/issues" replace />} />

                {/* Protected Routes */}
                <Route path="/issues" element={
                    <ProtectedRoute>
                        <IssuesMenu />
                    </ProtectedRoute>
                } />
                <Route path="/issues/new" element={
                    <ProtectedRoute>
                        <CrearEditarIssue isEdit={false} />
                    </ProtectedRoute>
                } />
                <Route path="/issues/bulk-insert" element={
                    <ProtectedRoute>
                        <BulkInsertPage />
                    </ProtectedRoute>
                } />
                <Route path="/issues/:id" element={
                    <ProtectedRoute>
                        <ViewIssue />
                    </ProtectedRoute>
                } />
                <Route path="/issues/:id/edit" element={
                    <ProtectedRoute>
                        <CrearEditarIssue isEdit={true} />
                    </ProtectedRoute>
                } />
                <Route path="/issues/:id/due_date" element={
                    <ProtectedRoute>
                        <AfegirDueDate />
                    </ProtectedRoute>
                } />
                <Route path="/issues/:id/assign" element={
                    <ProtectedRoute>
                        <AfegirAssignat />
                    </ProtectedRoute>
                } />
                <Route path="/issues/:id/watchers" element={
                    <ProtectedRoute>
                        <AfegirWatchers />
                    </ProtectedRoute>
                } />
                <Route path="/settings/tipus" element={
                    <ProtectedRoute>
                        <TipusList />
                    </ProtectedRoute>
                } />
                <Route path="/settings/tipus/create" element={
                    <ProtectedRoute>
                        <CrearEditarTipus />
                    </ProtectedRoute>
                } />
                <Route path="/settings/tipus/edit/:id" element={
                    <ProtectedRoute>
                        <CrearEditarTipus />
                    </ProtectedRoute>
                } />
                <Route path="/settings/priorities" element={
                    <ProtectedRoute>
                        <PrioritiesList />
                    </ProtectedRoute>
                } />
                <Route path="/settings/priorities/create" element={
                    <ProtectedRoute>
                        <CrearEditarPriorities />
                    </ProtectedRoute>
                } />
                <Route path="/settings/priorities/edit/:id" element={
                    <ProtectedRoute>
                        <CrearEditarPriorities />
                    </ProtectedRoute>
                } />
                <Route path="/settings/severities" element={
                    <ProtectedRoute>
                        <SeveritiesList />
                    </ProtectedRoute>
                } />
                <Route path="/settings/severities/create" element={
                    <ProtectedRoute>
                        <CrearEditarSeverity />
                    </ProtectedRoute>
                } />
                <Route path="/settings/severities/edit/:id" element={
                    <ProtectedRoute>
                        <CrearEditarSeverity />
                    </ProtectedRoute>
                } />
                <Route path="/settings/statuses" element={
                    <ProtectedRoute>
                        <StatusesList />
                    </ProtectedRoute>
                } />
                <Route path="/settings/statuses/create" element={
                    <ProtectedRoute>
                        <CrearEditarStatus />
                    </ProtectedRoute>
                } />
                <Route path="/settings/statuses/edit/:id" element={
                    <ProtectedRoute>
                        <CrearEditarStatus />
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
}

export default function App() {
    return (
        <Router basename="/Issue-Tracker_Frontend">
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}