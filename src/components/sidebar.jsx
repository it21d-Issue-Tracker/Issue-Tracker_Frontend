
import React from 'react';
import '../css/sidebar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">
            <i className="far fa-user"></i>Your Account
          </Link>
        </li>
        <li>
          <Link to="/issues/1">
            <i className="far fa-bookmark"></i>Issues
          </Link>
        </li>
        <li>
          <Link to="/">
            <i className="fas fa-cog"></i>Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
