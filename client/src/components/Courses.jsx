import React from 'react';
import '../styles/Courses.css'; // Import the CSS file for styling


const Courses = () => {
    return (
        <div className="courses-container">
            <h1 className="page-title">Linux Learning Platform - Courses</h1>

            <div className="section">
                <h2 className="section-title">Video 1: Dual-Boot / Daniel</h2>
                <div className="content-wrapper">
                    <div className="video-and-text">
                        <div className="video-container">
                            <iframe
                                width="600"
                                height="315"
                                src="https://video.pictory.ai/v2/preview/1122204564574302321831746314330750"
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="video"
                            ></iframe>
                        </div>
                        <div className="text-explanation">
                            <p>Learn the basics of Linux, its history, and why it's so widely used.</p>
                        </div>
                    </div>
                    <div className="write-text">
                        <textarea
                            placeholder="Write your notes here..."
                            className="notes-textarea"
                        ></textarea>
                    </div>
                </div>

            </div>
            <h2 className="section-title">Video 2: Raspberry PI / Mustafa</h2>
                <div className="content-wrapper">
                    <div className="video-and-text">
                        <div className="video-container">
                            <iframe
                                width="600"
                                height="315"
                                src="https://www.youtube.com/embed/S4NcyAlBT74"
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="video"
                            ></iframe>
                        </div>
                        <div className="text-explanation">
                            <p>Learn the basics of Linux, its history, and why it's so widely used.</p>
                        </div>
                    </div>
                    <div className="write-text">
                        <textarea
                            placeholder="Write your notes here..."
                            className="notes-textarea"
                        ></textarea>
                    </div>
                </div>

            {/* Repeat the same structure for other videos */}
        </div>
    );
};

export default Courses;
