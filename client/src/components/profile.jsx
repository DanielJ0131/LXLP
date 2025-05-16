/* import { useEffect, useState } from 'react';
import { fetchWithAuth } from './http.js';  */

export default function Profile({ user }) {
  if (!user) return <div>Login to view profile.</div>;
    
  return (
    <div className="profile-container">
      <h1>{user.username}'s Profile</h1>
      <p>Status: {user.role === 'admin' ? 'Admin' : 'User'}</p>
      <p>Email: {user.email}</p>
      <p>Full Name: {user.firstname} {user.lastname}</p>
      
    </div>
  );
}
