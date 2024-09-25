import { useEffect, useState } from 'react';

function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://127.0.0.1:5000/protected', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + token 
        }
      }).then((res) => {
        if (res.ok) {
          setAuthenticated(true); 
        } else {
          setAuthenticated(false); 
        }
      }).catch((error) => {
        console.error('Error:', error);
        setAuthenticated(false); 
      });
    } else {
      setAuthenticated(false); 
    }
  }, []);

  return authenticated;
}

export default useAuth;
