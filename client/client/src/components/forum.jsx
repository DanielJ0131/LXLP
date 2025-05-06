import React, { useState, useEffect, useCallback } from 'react';
import '../styles/forum.css';

const Forum = () => {
    const [posts, setPosts] = useState([]);
    const [skip, setSkip] = useState(0);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState({});
    const [newPost, setNewPost] = useState({ title: '', body: '' });
    const [error, setError] = useState(null);

    const user = {
        _id: 'user123',
        firstName: 'Test',
        lastName: 'User'
    };

    const fetchPosts = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/posts?${limit}`); // Ryad and Daniel add this endpoint
            const data = await response.json();
            setPosts(prev => [...prev, ...data]);
            setSkip(prev => prev + limit);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Error loading posts.');
        } finally {
            setLoading(false);
        }
    }, [skip, limit, loading]);

    const fetchComments = async (postId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/comments`); // Ryad and Daniel add this endpoint
            const data = await res.json();
            setComments(prev => ({ ...prev, [postId]: data }));
        } catch {
            setComments(prev => ({ ...prev, [postId]: [] }));
        }
    };

    const handlePostComment = async (postId) => {
        if (!newComment[postId]) return;
        try {
            const res = await fetch(`http://localhost:5000/api/comments/by-post-id/${postId}`, { // Ryad and Daniel add this endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newComment[postId],
                    userId: user._id,
                    name: user.name,
                })
            });
            const comment = await res.json();
            setComments(prev => ({
                ...prev,
                [postId]: [...(prev[postId] || []), comment]
            }));
            setNewComment(prev => ({ ...prev, [postId]: '' }));
        } catch {
            setError('Failed to post comment.');
        }
    };

    const handleCreatePost = async () => {
        if (!newPost.title || !newPost.body) return;
        try {
            await fetch('/api/posts', { // Ryad and Daniel add this endpoint    
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newPost,
                    userId: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName
                })
            });
            setNewPost({ title: '', body: '' });
            setSkip(0);
            setPosts([]);
            fetchPosts();
        } catch {
            setError('Failed to create post.');
        }
    };

    const handleLikePost = async (postId) => {
        await fetch(`/api/posts/${postId}/like`, { method: 'POST' });   // Ryad and Daniel
        fetchPosts();
    };

    const handleDislikePost = async (postId) => {
        await fetch(`/api/posts/${postId}/dislike`, { method: 'POST' }); // Ryad and Daniel
        fetchPosts();
    };

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <div className="forum-container">
            <h1>Forum Platform</h1>

            <div className="create-post">
                <input
                    type="text"
                    placeholder="Title"
                    value={newPost.title}
                    onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                />
                <textarea
                    placeholder="Write your post..."
                    value={newPost.body}
                    onChange={e => setNewPost({ ...newPost, body: e.target.value })}
                />
                <button onClick={handleCreatePost}>Create Post</button>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="posts-container">
                {posts.map(post => (
                    <div key={post._id} className="post">
                        <h2>{post.title}</h2>
                        <p>{post.body}</p>
                        <p>By {post.firstName} {post.lastName}</p>
                        <p>
                            👍 {post.likes?.length || 0}  
                            👎 {post.dislikes?.length || 0}
                        </p>
                        <button onClick={() => handleLikePost(post._id)}>Like</button>
                        <button onClick={() => handleDislikePost(post._id)}>Dislike</button>

                        <button onClick={() => fetchComments(post._id)}>
                            {comments[post._id] ? 'Hide Comments' : 'Show Comments'}
                        </button>

                        {comments[post._id] && (
                            <div className="comments">
                                {comments[post._id].map(comment => (
                                    <div key={comment._id} className="comment">
                                        <strong>{comment.firstName} {comment.lastName}</strong>: {comment.text}
                                    </div>
                                ))}
                                <input
                                    type="text"
                                    value={newComment[post._id] || ''}
                                    onChange={e => setNewComment(prev => ({ ...prev, [post._id]: e.target.value }))}
                                    placeholder="Write a comment..."
                                />
                                <button onClick={() => handlePostComment(post._id)}>Post Comment</button>
                            </div>
                        )}
                    </div>
                ))}
                {loading && <p>Loading more posts...</p>}
            </div>
        </div>
    );
};

export default Forum;
