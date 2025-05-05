import React, { useState, useEffect, useCallback } from 'react';
import './forum.css'; // Assuming you have some CSS for styling

const Forum = () => {
    const [posts, setPosts] = useState([]);
    const [skip, setSkip] = useState(0);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [profileCardVisible, setProfileCardVisible] = useState(false);
    const [comments, setComments] = useState({}); // { postId: [comments] }

    const fetchPosts = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/forum/posts?limit=${limit}&skip=${skip}`); // Adjust your API endpoint
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
}
    const data = await response.json();
    setPosts((prevPosts) => [...prevPosts, ...data.posts]); // Assuming your backend returns { posts: [...] }
    setSkip((prevSkip) => prevSkip + limit);
    } catch (error) {
    console.error('Error fetching posts:', error);
      // Optionally set an error state to display a message to the user
    } finally {
    setLoading(false);
    }
}, [skip, limit, loading]);

    const fetchUser = useCallback(async (userId) => {
    try {
         const response = await fetch(`/api/users/${userId}`); // Adjust your API endpoint
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}, []);

    const fetchComments = useCallback(async (postId) => {
    try {
      const response = await fetch(`/api/forum/posts/${postId}/comments`); // Adjust your API endpoint
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setComments(prevComments => ({ ...prevComments, [postId]: data.comments })); // Assuming { comments: [...] }
    } catch (error) {
        console.error('Error fetching comments:', error);
        setComments(prevComments => ({ ...prevComments, [postId]: [] }));
    }
}, []);

    const handleUsernameClick = useCallback(async (userId) => {
    const user = await fetchUser(userId);
    if (user) {
        setSelectedUser(user);
        setProfileCardVisible(true);
    }
}, [fetchUser]);

    const closeProfileCard = () => {
    setProfileCardVisible(false);
    setSelectedUser(null);
    };

    useEffect(() => {
        fetchPosts();
}, [fetchPosts]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 200 && !loading
) {
    fetchPosts();
    }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, [fetchPosts, loading]);

    const toggleComments = async (postId) => {
        if (!comments[postId]) {
            await fetchComments(postId);
    }
    setComments(prevComments => ({
        ...prevComments,
      [postId]: prevComments[postId] ? undefined : [], // Toggle visibility by setting to undefined
    }));
};

    return (
    <div className="forum-container">
        <h1>Forum</h1>
        <div className="posts-container">
        {posts.map((post) => (
            <div key={post.id} className="post">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p>
            <img
                src={post.user.image} // Assuming your post object has user info
                alt={`Profile picture of ${post.user.username}`}
                className="user-profile-image"/>
            <span
                className="username"
                data-user-id={post.user.id}
                onClick={() => handleUsernameClick(post.user.id)}
            >
                {post.user.username}
            </span>
            </p>
            <div className="tags">
                <p>🎬Tags:</p>
                {post.tags && post.tags.map((tag, index) => (
                <span key={index}>{tag}</span>
            ))}
            </div>
            <p>👍 Likes: {post.reactions?.likes || 0}, 👎 Dislikes: {post.reactions?.dislikes || 0}</p>
            <p>👁️ Views: {post.views}</p>
            <button className="show-comments-btn" onClick={() => toggleComments(post.id)}>
                {comments[post.id] ? 'Hide Comments' : 'Show Comments'}
            </button>
            <div className="comments" style={{ display: comments[post.id] ? 'block' : 'none' }}>
                <p>💬 Comments:</p>
                {comments[post.id] && comments[post.id].map((comment) => (
                <div key={comment.id} className="comment">
                <img
                    src={comment.user.image} // Assuming comment object has user info
                    alt={`Profile picture of ${comment.user.username}`}
                    className="comment-user-image" />
                <span>
                    {`${comment.user.firstName} ${comment.user.lastName} (${comment.user.username}): ${comment.body} Likes:👍 ${comment.likes}`}
                </span>
                </div>
))}
        {!comments[post.id] && comments[post.id] !== undefined && <p>No comments yet.</p>}
            </div>
        </div>
        ))}
        {loading && <p>Loading more posts...</p>}
    </div>

    {profileCardVisible && selectedUser && (
        <div id="profileCard" className="profile-card">
        <button className="close-profile-card" onClick={closeProfileCard}>
            &times;
        </button>
        <div id="user-profile">
            <img src={selectedUser.image} alt={`Profile picture of ${selectedUser.firstName} ${selectedUser.lastName}`}
            />
            <h2>{`${selectedUser.firstName} ${selectedUser.lastName}`}</h2>
            <p>Email: {selectedUser.email}</p>
            <p>Address: {selectedUser.address?.address}, {selectedUser.address?.city}</p>
            {/* Add other user details you want to display */}
        </div>
        </div>
    )}

        <button
        id="goToTopBtn"
        style={{ display: posts.length > 10 ? 'block' : 'none' }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
        Go to Top
    </button>
    </div>
);
};

export default Forum;