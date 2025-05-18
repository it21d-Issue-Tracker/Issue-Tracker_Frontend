import './App.css'
import Sidebar from './components/sidebar'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ViewIssue from './pages/ViewIssue';
import IssuesMenu from './pages/IssuesMenu';


function App() {
    return (
        <Router>
            <>
                <Sidebar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<IssuesMenu />} />
                        <Route path="/issues/:id" element={<ViewIssue />} />
                    </Routes>
                </div>
            </>
        </Router>
    )
}
export default App
