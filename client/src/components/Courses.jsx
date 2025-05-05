import React from 'react';
import '../styles/Courses.css'; // Import the CSS file for styling


const Courses = () => {
    const videos = [
        {
            title: 'Video 1: Dual-Boot / Daniel',
            url: 'https://www.youtube.com/embed/2g8v4j0Xk6E',
            description: 'Learn the basics of Linux',
        },
        {
            title: 'Video 2: Raspberry PI / Mustafa',
            url: 'https://www.youtube.com/embed/S4NcyAlBT74',
            description: 'Learn the basics of Linux',
        },
        {
            title: 'Video 3: Terminal / Sergej',
            url: 'https://www.youtube.com/embed/2g0v1a3j4xE',
            description: 'Learn the basics of Linux',
        },
    ];

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
                        <p className="text-explanation">{video.description}</p>
                        <div className="write-text">
                            <textarea
                                placeholder="Write your notes here..."
                                className="notes-textarea"
                            ></textarea>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Courses;

