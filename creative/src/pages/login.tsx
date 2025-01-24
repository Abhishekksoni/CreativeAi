// src/pages/Login.tsx
import { AuthContext } from '@/components/authContext';
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';


const Login: React.FC = () => {
  const { user, login } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/profile" />;
  }

  return (
    <div className='mt-56 ml-52'>
      <h2>Login</h2>
      <button onClick={login}>
        Login with Google
      </button>
    </div>
  );
};

export default Login;