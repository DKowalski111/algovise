export const getToken = () => {
  return localStorage.getItem('token'); // Retrieve the token from localStorage
};

export const getUserId = () => {
  return localStorage.getItem('id');
};

export const getUserName = () => {
  return localStorage.getItem('name');
};

export const getUserEmail = () => {
  return localStorage.getItem('email');
};

export const setToken = (token: string) => {
  localStorage.setItem('token', token); // Store the token in localStorage
};

export const removeToken = () => {
  localStorage.removeItem('token'); // Remove token from localStorage when logging out
};

export const checkToken = async (): Promise<boolean> => {
  const token = getToken();
  if (!token) return false; // If token is null, it's invalid
  
  try {
    const response = await fetch('http://localhost:8080/checkToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',  // Set the correct content type for plain text
      },
      body: token, // Send the token as plain text
    });

    // If the response is OK, the token is valid
    if (response.ok) {
      return true;
    } else {
      return false; // Invalid token
    }
  } catch (error) {
    console.error('Error checking token:', error);
    return false; // If the request fails, assume invalid token
  }
};