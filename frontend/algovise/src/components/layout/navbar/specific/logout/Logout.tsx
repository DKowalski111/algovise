import React from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../../../../../utils/AuthUtils';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken(); // Remove token from localStorage
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
