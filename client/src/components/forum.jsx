import React, { useState, useEffect } from 'react';
import '../styles/forum.css';

const Forum = () => {
    const [postsWithUserDetails, setPostsWithUserDetails] = useState([]);
    const [commentsByPostId, setCommentsByPostId] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleComments, setVisibleComments] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse, postsResponse, commentsResponse] = await Promise.all([
                    fetch('http://localhost:5000/api/users',{
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                        }),
                    fetch('http://localhost:5000/api/posts',{
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                        }),
                    fetch('http://localhost:5000/api/comments',{
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                        })
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
                const usersMap = new Map(usersData.map(user => [user._id, user]));

                // Map comments by postId
                const commentsMap = commentsData.reduce((acc, comment) => {
                    const postId = comment.postId?.$oid;
                    if (!acc[postId]) acc[postId] = [];
                    acc[postId].push({
                        ...comment,
                        user: usersMap.get(comment.userId?.$oid) || { firstname: 'Unknown', lastname: 'User' }
                    });
                    return acc;
                }, {});

                // Combine post data with user details and comment counts
                const enrichedPosts = postsData.map(post => {
                    const user = usersMap.get(post.userId.$oid) || { firstname: 'Unknown', lastname: 'User', image: '' };
                    const commentCount = commentsMap[post._id]?.length || 0;
                    return { ...post, user, commentCount };
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
            <div className="error-message" role="alert">
                <strong className="error-strong">Error: </strong>
                <span className="error-span">{error}</span>
            </div>
        );
    }

    return (
        <div className="forum-container">
            <h1 className="forum-title">
                Community Forum
            </h1>

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
                                            {`${post.user.firstname?.[0]}${post.user.lastname?.[0]}`}
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