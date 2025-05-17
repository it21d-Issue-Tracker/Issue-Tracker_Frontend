import './App.css'
import Sidebar from './components/sidebar'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ViewIssue from './pages/ViewIssue';

function App() {
    return (
        <Router>
            <>
                <Sidebar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<div>Hello, ASW!</div>} />
                        <Route path="/issues/:id" element={<ViewIssue />} />
                    </Routes>
                </div>
            </>
        </Router>
    );
}
export default App
