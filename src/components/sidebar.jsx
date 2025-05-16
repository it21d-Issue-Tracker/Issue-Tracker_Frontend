import React from 'react';
import '../css/sidebar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><a href="#"><i className="far fa-user"></i>Your Account</a></li>
        <li><a href="#"><i className="far fa-bookmark"></i>Issues</a></li>
        <li><a href="#"><i className="fas fa-cog"></i>Settings</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
