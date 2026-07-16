import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <div className="notfound-code">404</div>
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-message">The page you're looking for doesn't exist or may have been moved.</p>
        <Link to="/" className="notfound-home-btn">← Return to Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
