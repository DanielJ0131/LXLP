import { useState, useEffect } from 'react';
import '../styles/forum.css';
import { fetchWithAuth } from '../utils/http.js';

const Forum = ({ user }) => {
    const [posts, setPosts] = useState([]);
    const [commentsByPostId, setCommentsByPostId] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleComments, setVisibleComments] = useState({});
    const [newPostContent, setNewPostContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsResponse = await fetchWithAuth('/api/posts');
                if (!postsResponse.ok) throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
                const postsData = await postsResponse.json();
                setPosts(postsData);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching posts.');
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const fetchComments = async (postId) => {
        try {
            const res = await fetchWithAuth(`/api/comments/by-post-id/${postId}`);
            if (!res.ok) throw new Error('Failed to fetch comments');
            const comments = await res.json();
            setCommentsByPostId(prev => ({ ...prev, [postId]: comments }));
        } catch (err) {
            alert(err.message || 'Failed to fetch comments.');
        }
    };

    const toggleComments = (postId) => {
        setVisibleComments((prev) => ({
            ...prev,
            [postId]: !prev[postId]
        }));
        if (!commentsByPostId[postId]) {
            fetchComments(postId);
        }
    };

    if (loading) {
        return <div>Loading Forum...</div>;
    }

    if (error) {
        return (
            <div className="forum-container">
                <h2
                    style={{ cursor: 'pointer' }}
                    onClick={() => window.location.href = '/login'}
                >
                    Please log in to view the forum
                </h2>
            </div>
        );
    }

    const handleNewPostSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError(null);

        try {
            const res = await fetchWithAuth('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user._id,
                    content: newPostContent
                })
            });

            if (!res.ok) throw new Error('Failed to create post');
            const createdPost = await res.json();
            setPosts(prev => [createdPost, ...prev]);
            setNewPostContent('');
        } catch (err) {
            setSubmitError(err.message || 'Failed to create post.');
        }
        setSubmitting(false);
    };

    return (
        <div className="forum-container">
            <h1 className="forum-title">Community Forum</h1>
            <div className="new-post-container">
                <form onSubmit={handleNewPostSubmit} className="new-post-form">
                    <textarea
                        className="new-post-textarea"
                        placeholder="Share something with the community..."
                        value={newPostContent}
                        onChange={e => setNewPostContent(e.target.value)}
                        required
                        minLength={3}
                        disabled={submitting}
                    />
                    <button type="submit" className="new-post-button" disabled={submitting || !newPostContent.trim()}>
                        {submitting ? 'Posting...' : 'Post'}
                    </button>
                    {submitError && <div className="new-post-error">{submitError}</div>}
                </form>
            </div>
            <div className="forum-grid">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id} className="post-card">
                            <div className="post-header">
                                <div className="avatar-container">
                                    {post.image ? (
                                        <img src={post.image} alt={post.username} className="avatar-image"/>
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {post.username?.[0] || ''}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="user-name">{post.username}</h3>
                                </div>
                            </div>
                            <div className="post-content">
                                <p className="post-text">{post.content}</p>
                            </div>
                            <div className="post-footer">
                                <span className="action-item">
                                    {/* You can add comment count if your API returns it */}
                                    Comments {post.commentsCount || 0}
                                </span>
                                <span className={`post-status ${post.status === "fixed" ? 'status-fixed' : 'status-pending'}`}>
                                    {post.status}
                                </span>
                            </div>
                            {visibleComments[post._id] && (
                                <div className="comments-section">
                                    {commentsByPostId[post._id]?.map((comment) => (
                                        <div key={comment._id} className="comment">
                                            <strong>{comment.userFullName || comment.username}</strong>: {comment.content}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="comments-toggle">
                                <button className="toggle-comments-button" onClick={() => toggleComments(post._id)}>
                                    {visibleComments[post._id] ? 'Hide Comments' : 'Show Comments'}
                                </button>
                            </div>
                            <form
                                className="new-comment-form"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const form = e.target;
                                    const commentContent = form.elements['comment-content'].value.trim();
                                    if (!commentContent) return;
                                    try {
                                        const res = await fetchWithAuth('/api/comments', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                postId: post._id,
                                                userId: user._id,
                                                content: commentContent
                                            })
                                        });
                                        if (!res.ok) throw new Error('Failed to add comment');
                                        const createdComment = await res.json();
                                        setCommentsByPostId(prev => ({
                                            ...prev,
                                            [post._id]: [...(prev[post._id] || []), createdComment]
                                        }));
                                        form.reset();
                                    } catch (err) {
                                        alert(err.message || 'Failed to add comment.');
                                    }
                                }}
                                style={{ marginTop: '10px' }}
                            >
                                <input
                                    type="text"
                                    name="comment-content"
                                    className="new-comment-input"
                                    placeholder="Write a comment..."
                                    minLength={1}
                                    required
                                    style={{ width: '80%', marginRight: '8px' }}
                                />
                                <button type="submit" className="new-comment-button">
                                    Comment
                                </button>
                            </form>
                            {user?.role === 'admin' && (
                                <div className="post-actions-extra">
                                    <button
                                        className="delete-post-button"
                                        onClick={async () => {
                                            if (!window.confirm('Are you sure you want to delete this post?')) return;
                                            try {
                                                const postId = post._id;
                                                const res = await fetchWithAuth(`/api/posts/${postId}`, {
                                                    method: 'DELETE'
                                                });
                                                if (!res.ok) throw new Error('Failed to delete post');
                                                setPosts(posts.filter(p => p._id !== postId));
                                            } catch (err) {
                                                alert(err.message || 'Failed to delete post.');
                                            }
                                        }}
                                        disabled={submitting}
                                        style={{
                                            background: '#ff4d4f',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '4px 10px',
                                            marginTop: '10px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="no-posts">No posts available.</div>
                )}
            </div>
        </div>
    );
};

export default Forum;
