/* import { useEffect, useState } from 'react';
import { fetchWithAuth } from './http.js';  */
import "../styles/profile.css";

export default function Profile({ user }) {
  if (!user) return <div>Login to view profile.</div>;
    
  return (
    <div className="profile-container">
      <h1>{user.username}'s Profile</h1>
      <p><strong>Status:</strong> {user.role === 'admin' ? 'Admin' : 'User'}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Full Name:</strong> {user.firstname} {user.lastname}</p>
      
    </div>
  );
}
