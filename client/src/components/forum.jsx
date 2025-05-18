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
    const [selectedStatus, setSelectedStatus] = useState('all');

    const pendingStatuses = ['pending', 'investigating', 'waiting for solution', 'published'];
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6; 
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    
    const filteredPosts = posts.filter(post => {
        if (selectedStatus === 'all') return true;
        if (selectedStatus === 'all-pending') {
            return pendingStatuses.includes(post.status.toLowerCase());
        }
        return post.status.toLowerCase() === selectedStatus;
    });

    const paginatedPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    useEffect(() => {
        let timeoutId;
        const fetchPosts = async () => {
            try {
                const postsResponse = await fetchWithAuth('/api/posts');
                if (!postsResponse.ok) throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
                const postsData = await postsResponse.json();
                setPosts(postsData);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching posts.');
            } finally {
                timeoutId = setTimeout(() => setLoading(false), 1500);
            }
        };
        fetchPosts();
        return () => clearTimeout(timeoutId);
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
        return (
        <div className="forum-container">
            <div className="loading-container-forum">
                <h2 className="loading-title-forum">Loading Forum...</h2>
                <div className="loading-grid-forum">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="loading-card-forum">
                            <div className="loading-card-content-forum">
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        );
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
            setPosts(prev => [createdPost.newPost, ...prev]);
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

            <div className="filter-container">
              <label htmlFor="statusFilter">Filter by Status: </label>
              <select
                  id="statusFilter"
                  value={selectedStatus}
                  onChange={(e) => {setSelectedStatus(e.target.value);
                                    setCurrentPage(1);
                  }}
              >
                  <option value="all">All</option>
                      <optgroup label="─── Pending ───">
                      <option value="all-pending">All Pending</option>
                      <option value="pending">Pending</option>
                      <option value="published">Published</option>
                      <option value="investigating">Investigating</option>
                      <option value="waiting for solution">Waiting for solution</option>
                  </optgroup>
                  <optgroup label="─── Resolved ───">
                      <option value="fixed">Fixed</option>
                  </optgroup>
              </select>
            </div>
            <div className="forum-grid">
                {filteredPosts.length > 0 ? (
                    paginatedPosts.map((post) => (
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
                                <p className="date">
                                    {new Date(post.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}{' '}
                                    {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                </p>
                            </div>
                            <div className="post-content">
                                <p className="post-text">{post.content}</p>
                            </div>
                            <div className="post-footer">
                                <span className="action-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle'}}><path d="m21.73 18-8-8a2 2 0 0 0-3.48 0l-8 8A2 2 0 0 0 3 20h18a2 2 0 0 0 1.73-2Z"/><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>
                                    {post.commentsCount || 0} Comments 
                                </span>
                                <span className={`post-status ${post.status === "fixed" ? 'status-fixed' : 'status-pending'}`}>
                                    {post.status}
                                </span>
                            </div>
                            {visibleComments[post._id] && (
                                <div className="comments-section">
                                    {commentsByPostId[post._id]?.map((comment) => (
                                        <div key={comment._id} className="comment">
                                            <div className="one-comment">
                                                <strong className="comment-user">
                                                    {comment.image ? (
                                                    <img
                                                        src={comment.image}
                                                        alt={comment.username}
                                                        className="avatar-image comment-avatar"
                                                        style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 6, verticalAlign: 'middle' }}
                                                    />
                                                    ) : null}
                                                    {comment.username}
                                                </strong>
                                                <strong className="comment-content">{comment.content}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {post.commentsCount > 0 && (
                                <div className="comments-toggle">
                                    <button className="toggle-comments-button" onClick={() => toggleComments(post._id)}>
                                        {visibleComments[post._id] ? 'Hide Comments' : 'Show Comments'}
                                    </button>
                                </div>
                            )}
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
                                        if(!commentsByPostId[post._id]) {
                                            fetchComments(post._id);
                                        } else {
                                            setCommentsByPostId(prev => ({
                                            ...prev,
                                            [post._id]: [...(prev[post._id] || []), createdComment.newComment]
                                        }));
                                        }
                                        setPosts(posts.map(p => p._id === post._id ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p));
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
                                <div className="post-actions">
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
            <div className="pagination-controls">
                {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={i + 1 === currentPage ? 'active-page' : ''}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Forum;