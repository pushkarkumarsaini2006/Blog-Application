import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';

const DebugUserInfo = () => {
  const { user, loading } = useContext(UserContext);
  
  // Only show in development
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999,
      borderRadius: '0 0 0 10px'
    }}>
      <div><strong>Debug Info:</strong></div>
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>User: {user ? 'logged in' : 'not logged in'}</div>
      {user && (
        <>
          <div>Name: {user.name}</div>
          <div>Role: {user.role}</div>
          <div>Profile Image: {user.profileImageUrl || 'none'}</div>
        </>
      )}
      <div>Backend URL: {import.meta.env.VITE_BACKEND_URL}</div>
      <div>Token: {localStorage.getItem('token') ? 'present' : 'missing'}</div>
    </div>
  );
};

export default DebugUserInfo;
