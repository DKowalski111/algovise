import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { checkToken } from '../utils/AuthUtils';

type TokenValidity = boolean | null;

const ProtectedRoute = () => {
  const [isValidToken, setIsValidToken] = useState<TokenValidity>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const validateToken = async () => {
      const isValid = await checkToken()
      setIsValidToken(isValid);

      setLoading(false);
    };

    validateToken();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isValidToken) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
