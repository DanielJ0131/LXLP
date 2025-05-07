import React, { useEffect, useState } from 'react';
import '../styles/courses.css'; // Import the CSS file for styling

const Courses = () => {
    // State to store the video data fetched from the backend
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        // Function to fetch video data (including title, URL, and description) from the backend
        const fetchVideoData = async () => {
            try {
                const response = await fetch('/api/'); // use API Ryad created to fetch courses
                if (!response.ok) {
                    const message = `An error occurred: ${response.status}`;
                    throw new Error(message);
                }
                const data = await response.json();
                // backend must returns an array of video objects with 'title', 'url', and 'description'
                setVideos(data.courses);
            } catch (error) {
                console.error("Failed to load course data", error);
                // Optionally set an error state to display a message to the user
                setVideos([]);
            }
        };

        fetchVideoData();
    }, []); // Empty dependency array ensures this runs only once after the initial render

    return (
        <div className="courses-container">
            <h1 className="page-title">Linux Learning Platform - Courses</h1>

            {videos.map((video, index) => (
                <div className="section" key={index}>
                    <h2 className="section-title">{video.title}</h2>
                    <div className="content-wrapper">
                        <div className="video-container">
                            <iframe
                                src={video.url}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                        {/* Display the fetched description for the current video */}
                        <p className="text-explanation">{video.description}</p>
                        {/* The 'write-text' div and textarea have been removed */}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Courses;