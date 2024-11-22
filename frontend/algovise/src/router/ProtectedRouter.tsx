import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { checkToken } from '../utils/AuthUtils';

// Define the state type for token validity
type TokenValidity = boolean | null;

const ProtectedRoute = () => {
  const [isValidToken, setIsValidToken] = useState<TokenValidity>(null); // State to track token validity
  const [loading, setLoading] = useState<boolean>(true); // Loading state to handle the request status

  useEffect(() => {
    const validateToken = async () => {
      const isValid = await checkToken();  // Call the checkToken function from AuthUtils
      console.log("Is token valid?" + isValid);
      setIsValidToken(isValid);  // Update the validity state

      setLoading(false);  // End loading state
    };

    validateToken();  // Trigger token validation
  }, []);

  // If still loading, show a loading spinner or similar
  if (loading) {
    return <div>Loading...</div>;
  }

  // If token is invalid or missing, redirect to login
  if (!isValidToken) {
    return <Navigate to="/login" />;
  }

  // If token is valid, render the child component (protected content)
  return <Outlet />;
};

export default ProtectedRoute;
