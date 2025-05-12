import React, { useEffect, useState } from 'react';
import '../styles/courses.css'; // Import the CSS file for styling

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [visibleVideos, setVisibleVideos] = useState({});
    const [visibleSteps, setVisibleSteps] = useState({});

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/courses');
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const toggleVideoVisibility = (courseId) => {
        setVisibleVideos((prevState) => ({
            ...prevState,
            [courseId]: !prevState[courseId],
        }));
    };

    const toggleStepsVisibility = (courseId) => {
        setVisibleSteps((prevState) => ({
            ...prevState,
            [courseId]: !prevState[courseId],
        }));
    };

    return (
        <div className="courses-container">
            <h1>Courses</h1>
            <ul>
                {courses.map((course, index) => (
                    <li key={course._id || index}>
                        <h2
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleVideoVisibility(course._id || index)}
                        >
                            {course.title}
                        </h2>
                        
                        {visibleVideos[course._id || index] && (
                            <div className="video-container">
                                <iframe
                                    width="560"
                                    height="315"
                                    src={course.video.replace('watch?v=', 'embed/')}
                                    title={course.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}

                        <button onClick={() => toggleStepsVisibility(course._id || index)}>
                            {visibleSteps[course._id || index] ? 'Hide Steps' : 'Show Steps'}
                        </button>
                        {visibleSteps[course._id || index] && <p>{course.content}</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Courses;