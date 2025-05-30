
import React from 'react';
import '../css/sidebar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';
import {useAuth} from "../context/AuthContext.jsx";

const Sidebar = () => {
  const { currentUser } = useAuth();
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to={currentUser ? `/user/${currentUser.username}` : '/login'}>
            <i className="far fa-user"></i>Your Account
          </Link>
        </li>
        <li>
          <Link to="/issues">
            <i className="far fa-bookmark"></i>Issues
          </Link>
        </li>
        <li>
          <Link to="/settings/priorities">
            <i className="fas fa-cog"></i>Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
