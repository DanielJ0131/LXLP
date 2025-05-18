import { useState, useEffect } from 'react';
import "../styles/profile.css";
import { fetchWithAuth } from '../utils/http';

export default function Profile({ user }) {
  if (!user) return <div>Login to view profile.</div>;
    
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchWithAuth(`/api/users/username/${user.username}`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.username]);

  const [imageUrl, setImageUrl] = useState('');
  const [patchLoading, setPatchLoading] = useState(false);
  const [patchError, setPatchError] = useState(null);
  const [patchSuccess, setPatchSuccess] = useState(false);

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const patchImageUrl = async () => {
    setPatchLoading(true);
    setPatchError(null);
    setPatchSuccess(false);
    try {
      const res = await fetchWithAuth('/api/users/image', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: profile.username, image: imageUrl }),
      });
      if (!res.ok) throw new Error('Failed to update image URL');
      setPatchSuccess(true);
      // Optionally, refetch profile here
    } catch (err) {
      setPatchError(err.message);
    } finally {
      setPatchLoading(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return null;

  return (
    <div className="profile-container">
      <h1>{profile.username}'s Profile</h1>
      <div className="profile-image-section">
    <img src={profile.image} alt={`${profile.username}'s profile`} />
    </div>
      <p><strong>Status:</strong> {profile.role === 'admin' ? 'Admin' : 'User'}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Full Name:</strong> {profile.firstname} {profile.lastname}</p>
        <button onClick={patchImageUrl} disabled={patchLoading}>
        {patchLoading ? 'Updating...' : 'Update Image URL'}
        </button>
        <input
          type="text"
          placeholder="Enter new image URL"
          value={imageUrl}
          onChange={handleImageUrlChange}
        />
        {patchError && <div className="error">{patchError}</div>}
        {patchSuccess && <div className="success">Image URL updated successfully!</div>}
      </div>
  );
}
