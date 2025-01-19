import React from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../../../../../utils/AuthUtils';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
