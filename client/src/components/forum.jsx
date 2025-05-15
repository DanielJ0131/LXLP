import { useState, useEffect } from 'react';
import '../styles/forum.css';
import { fetchWithAuth } from '../utils/http.js';

const Forum = ({ user }) => {
    const [postsWithUserDetails, setPostsWithUserDetails] = useState([]);
    const [commentsByPostId, setCommentsByPostId] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleComments, setVisibleComments] = useState({});
    const [newPostContent, setNewPostContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse, postsResponse, commentsResponse] = await Promise.all([
                    fetchWithAuth('/api/users'),
                    fetchWithAuth('/api/posts'),
                    fetchWithAuth('/api/comments')
                ]);

                if (!usersResponse.ok) {
                    throw new Error(`Failed to fetch users: ${usersResponse.status}`);
                }
                if (!postsResponse.ok) {
                    throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
                }
                if (!commentsResponse.ok) {
                    throw new Error(`Failed to fetch comments: ${commentsResponse.status}`);
                }

                const usersData = await usersResponse.json();
                const postsData = await postsResponse.json();
                const commentsData = await commentsResponse.json();

                // Create a map of users for efficient lookup
                const usersMap = new Map(usersData.map(u => [u._id, u]));

                // Map comments by postId
                const commentsMap = commentsData.reduce((acc, comment) => {
                    const postId = comment.postId;
                    if (!acc[postId]) acc[postId] = [];
                    acc[postId].push({
                        ...comment,
                        user: usersMap.get(comment.userId) || { firstname: 'Unknown', lastname: 'User' }
                    });
                    return acc;
                }, {});

                // Combine post data with user details and comment counts
                const enrichedPosts = postsData.map(post => {
                    const postUser = usersMap.get(post.userId) || { firstname: 'Unknown', lastname: 'User', image: '', username: 'Unknown' };
                    const commentCount = commentsMap[post._id]?.length || 0;
                    return { ...post, user: postUser, commentCount };
                });

                setPostsWithUserDetails(enrichedPosts);
                setCommentsByPostId(commentsMap);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching data.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleComments = (postId) => {
        setVisibleComments((prev) => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    if (loading) {
        return (
            <div className="loading-container">
                <h2 className="loading-title">Loading Forum...</h2>
                <div className="loading-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="loading-card">
                            <div className="loading-card-header">
                                <div className="loading-avatar"></div>
                                <div>
                                    <div className="loading-text-short"></div>
                                    <div className="loading-text-long"></div>
                                </div>
                            </div>
                            <div className="loading-card-content">
                                <div className="loading-text-full"></div>
                                <div className="loading-text-medium"></div>
                            </div>
                        </div>
                    ))}
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
            const userRes = await fetchWithAuth(`/api/users/username/${user.username}`);
            if (!userRes.ok) {
                throw new Error('Failed to fetch current user');
            }
            const currentUser = await userRes.json();
            console.log(currentUser)
            const res = await fetchWithAuth('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser._id,
                    content: newPostContent
                })
            });

            if (!res.ok) {
                throw new Error('Failed to create post');
            }

            const createdPost = await res.json();
            // Enrich the created post with user details
            const enrichedPost = {
                ...createdPost,
                user: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    image: user.image,
                    username: user.username
                },
                commentCount: 0
            };
            setPostsWithUserDetails(prev => [enrichedPost, ...prev]);
            setNewPostContent('');
        } catch (err) {
            setSubmitError(err.message || 'Failed to create post.');
        }
        setSubmitting(false);
    };

    return (
        <div className="forum-container">
            <h1 className="forum-title">
                Community Forum
            </h1>
            <style>
            {`
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .forum-grid .post-card {
                animation: fadeInUp 4s cubic-bezier(0.23, 1, 0.32, 1) both;
            }
            `}
            </style>
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
                {postsWithUserDetails.length > 0 ? (
                    postsWithUserDetails.map((post) => (
                        <div key={post._id} className="post-card">
                            <div className="post-header">
                                <div className="avatar-container">
                                    {post.user.image ? (
                                        <img src={post.user.image} alt={`${post.user.firstname} ${post.user.lastname}`} className="avatar-image"/>
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {`${post.user.firstname?.[0] || ''}${post.user.lastname?.[0] || ''}`}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="user-name">{post.user.username}</h3>
                                </div>
                            </div>
                            <div className="post-content">
                                <p className="post-text">{post.content}</p>
                            </div>
                            <div className="post-footer">
                                <div className="post-actions">
                                    <span className="action-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle'}}><path d="M9 14V5H7v9"/><path d="M3 9h4"/><path d="M15 9v-4a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h7l5 5v-9z"/></svg>
                                        {post.likes}
                                    </span>
                                    <span className="action-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle'}}><path d="M15 10v9h-2V10"/><path d="M21 15h-4"/><path d="M7 15v4a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2H12l-5-5H2a2 2 0 0 0-2 2z"/></svg>
                                        {post.dislikes}
                                    </span>
                                    <span className="action-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle'}}><path d="m21.73 18-8-8a2 2 0 0 0-3.48 0l-8 8A2 2 0 0 0 3 20h18a2 2 0 0 0 1.73-2Z"/><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>
                                        {post.commentCount} Comments
                                    </span>
                                </div>
                                <span className={`post-status ${post.status === "fixed" ? 'status-fixed' : 'status-pending'}`}>
                                    {post.status}
                                </span>
                            </div>
                            {visibleComments[post._id] && (
                                <div className="comments-section">
                                    {commentsByPostId[post._id]?.map((comment) => (
                                        <div key={comment._id} className="comment">
                                            <strong>{`${comment.user.firstname} ${comment.user.lastname}`}</strong>: {comment.content}
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
                                        const newComment = {
                                            ...createdComment,
                                            _id: createdComment._id,
                                            user: user
                                        };
                                        setCommentsByPostId(prev => ({
                                            ...prev,
                                            [post._id]: [...(prev[post._id] || []), newComment]
                                        }));
                                        setPostsWithUserDetails(prev =>
                                            prev.map(p =>
                                                p._id === post._id
                                                    ? { ...p, commentCount: (p.commentCount || 0) + 1 }
                                                    : p
                                            )
                                        );
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
                                            // Delete the post
                                            const res = await fetchWithAuth(`/api/posts/${postId}`, {
                                                method: 'DELETE'
                                            });
                                            // Delete all comments for this post
                                            if (commentsByPostId[postId]?.length) {
                                                await Promise.all(
                                                    commentsByPostId[postId].map(comment =>
                                                        fetchWithAuth(`/api/comments/${comment._id}`, {
                                                            method: 'DELETE'
                                                        })
                                                    )
                                                );
                                            }
                                            if (!res.ok) throw new Error('Failed to delete post');
                                            setPostsWithUserDetails(postsWithUserDetails.filter(p => p._id !== postId));
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
