export const getToken = () => {
  return localStorage.getItem('token');
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
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const checkToken = async (): Promise<boolean> => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const response = await fetch('http://localhost:8080/checkToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: token,
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking token:', error);
    return false;
  }
};