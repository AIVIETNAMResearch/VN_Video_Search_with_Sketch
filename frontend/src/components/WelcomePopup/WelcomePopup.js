import React, { useEffect } from 'react';
import './WelcomePopup.css'; // Create a CSS file for styling

const WelcomePopup = ({ username, onClose }) => {
  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, 3000);
  });

  return (
    <div className="welcome-popup">
      <div className="welcome-message">Welcome {username}. Are you ready?</div>
    </div>
  );
};

export default WelcomePopup;
