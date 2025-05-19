import './App.css'
import Sidebar from './components/sidebar'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ViewIssue from './pages/ViewIssue';
import IssuesMenu from './pages/IssuesMenu';
import { Link } from 'react-router-dom';
import CrearEditarIssue from "./pages/CrearEditarIssue.jsx";

function App() {
    return (
        <Router>
            <>
                <div className="content">
                <Sidebar />
                    <Routes>
                        <Route path="/issues" element={<IssuesMenu />} />
                        <Route path="/issues/:id" element={<ViewIssue />} />
                        <Route path="/issues/new" element={<CrearEditarIssue isEdit={false} />} />
                        <Route path="/issues/:id/edit" element={<CrearEditarIssue isEdit={true} />} />
                    </Routes>
                </div>
               
            </>
        </Router>
    )
}
export default App
