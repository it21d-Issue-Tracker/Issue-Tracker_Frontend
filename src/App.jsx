import './App.css'
import Sidebar from './components/sidebar'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ViewIssue from './pages/ViewIssue';
import IssuesMenu from './pages/IssuesMenu';
import { Link } from 'react-router-dom';


function App() {
    return (
        <Router>
            <>
                <div className="content">
                <Sidebar />
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
