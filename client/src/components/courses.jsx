import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/http.js';
import '../styles/courses.css';

const Courses = () => {
    const [courses, setCourses] = useState([]);// State to store courses
    const [visibleVideos, setVisibleVideos] = useState({});// State to track visibility of videos
    const [visibleSteps, setVisibleSteps] = useState({}); // State to track visibility of steps
    const [animationKeys, setAnimationKeys] = useState({}); // State to force re-render of video iframe
    const [authFailed, setAuthFailed] = useState(false); // State to track authentication failure

    useEffect(() => { // Fetch courses on component mount
        const fetchCourses = async () => {
            try {
                const response = await fetchWithAuth('/api/courses');
                if (response.status === 401 || response.status === 403) {
                    setAuthFailed(true);
                    return;
                }
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                setAuthFailed(true);
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses(); // Call the fetch function
    }, []);

    function renderAuthFailed() { // Function to render authentication failure message
        return (
            <div className="courses-container">
                <h2
                    style={{ cursor: 'pointer' }}
                    onClick={() => window.location.href = '/login'}
                >
                    Please log in to view courses
                </h2>
            </div>
        );
    }

    if (authFailed) { 
        return renderAuthFailed();
    }

    return (
        <div className="courses-container">
            <h1 className="courses-title">
                Courses
            </h1>
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

                            {visibleSteps[courseId] && (
                                <div className="steps-container">
                                    {course.content.split('|').map((section, idx) => (
                                        <p key={idx}>
                                            {section.split('. ').map((sentence, sentenceIdx) => (
                                                <span key={sentenceIdx}>
                                                    {sentence.trim()}
                                                    <br />
                                                </span>
                                            ))}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );

    function toggleVideoVisibility(courseId) {
        const newKey = Date.now();
        setAnimationKeys((prev) => ({ ...prev, [courseId]: newKey }));
        setVisibleVideos((prevState) => ({
            ...prevState,
            [courseId]: !prevState[courseId],
        }));
    }

    function toggleStepsVisibility(courseId) {
        setVisibleSteps((prevState) => ({
            ...prevState,
            [courseId]: !prevState[courseId],
        }));
    }
};

export default Courses;
