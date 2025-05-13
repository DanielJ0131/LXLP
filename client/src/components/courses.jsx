import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/http.js'; // Import the fetchWithAuth function
import '../styles/courses.css'; // Import the CSS file for styling

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [visibleVideos, setVisibleVideos] = useState({});
    const [visibleSteps, setVisibleSteps] = useState({});
    const [animationKeys, setAnimationKeys] = useState({});

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetchWithAuth('http://localhost:5000/api/courses');
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const toggleVideoVisibility = (courseId) => {
        const newKey = Date.now(); // new key for animation re-trigger
        setAnimationKeys((prev) => ({ ...prev, [courseId]: newKey }));
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
                {courses.map((course, index) => {
                    const courseId = course._id || index;

                    return (
                        <li key={courseId}>
                            <h2
                                style={{ cursor: 'pointer' }}
                                onClick={() => toggleVideoVisibility(courseId)}
                            >
                                {course.title}
                            </h2>

                            {visibleVideos[courseId] && (
                                <div className="video-container">
                                    <iframe
                                        key={animationKeys[courseId]}
                                        className="video-animate"
                                        width="560"
                                        height="315"
                                        src={course.video.replace('watch?v=', 'embed/')}
                                        title={course.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}

                            <button onClick={() => toggleStepsVisibility(courseId)}>
                                {visibleSteps[courseId] ? 'Hide Steps' : 'Show Steps'}
                            </button>

                            {visibleSteps[courseId] && <p>{course.content}</p>}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Courses;
