import { useEffect, useState, useRef } from 'react';
import { fetchWithAuth } from '../utils/http.js';
import '../styles/courses.css';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [visibleVideos, setVisibleVideos] = useState({});
    const [visibleSteps, setVisibleSteps] = useState({});
    const [animationKeys, setAnimationKeys] = useState({});
    const [authFailed, setAuthFailed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [typedSteps, setTypedSteps] = useState({});
    const [stepIndexes, setStepIndexes] = useState({});
    const typingTimersRef = useRef({});
    const stepTimersRef = useRef({});

    useEffect(() => {
        let timeoutId;
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
            } finally {
                setLoading(false);
            }
        };

        timeoutId = setTimeout(fetchCourses, 1000);
        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        // Cleanup timers on unmount
        return () => {
            Object.values(typingTimersRef.current).forEach(clearInterval);
            Object.values(stepTimersRef.current).forEach(clearTimeout);
        };
    }, []);

    function renderAuthFailed() {
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

    if (loading) {
        return (
            <div className="loading-container">
                <h2 className="loading-title">Loading Courses...</h2>
                <div className="loading-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="loading-card">
                            <div className="loading-card-content">
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="courses-container">
            <h1 className="courses-title">
                Courses
            </h1>
            <ul>
                {courses.map((course, index) => {
                    const courseId = course._id || index;
                    const steps = course.content.split('|').map(s => s.trim()).filter(Boolean);

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

                            <button onClick={() => toggleStepsVisibility(courseId, steps)}>
                                {visibleSteps[courseId] ? 'Hide Steps' : 'Show Steps'}
                            </button>

                            {visibleSteps[courseId] && (
                                <div className="steps-container">
                                    {steps.map((section, idx) => (
                                        <p className='one-step' key={idx}>
                                            {typedSteps[courseId] && typedSteps[courseId][idx]
                                                ? typedSteps[courseId][idx]
                                                : ''}
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

    function toggleStepsVisibility(courseId, steps) {
        // Hide steps
        if (visibleSteps[courseId]) {
            setVisibleSteps(prev => ({ ...prev, [courseId]: false }));
            setTypedSteps(prev => ({ ...prev, [courseId]: [] }));
            setStepIndexes(prev => ({ ...prev, [courseId]: 0 }));
            if (typingTimersRef.current[courseId]) clearInterval(typingTimersRef.current[courseId]);
            if (stepTimersRef.current[courseId]) clearTimeout(stepTimersRef.current[courseId]);
            return;
        }

        // Show steps
        setVisibleSteps(prev => ({ ...prev, [courseId]: true }));
        setTypedSteps(prev => ({ ...prev, [courseId]: [] }));
        setStepIndexes(prev => ({ ...prev, [courseId]: 0 }));

        if (typingTimersRef.current[courseId]) clearInterval(typingTimersRef.current[courseId]);
        if (stepTimersRef.current[courseId]) clearTimeout(stepTimersRef.current[courseId]);

        // Start typing steps one after another
        typeStepLine(courseId, steps, 0);
    }

    function typeStepLine(courseId, steps, stepIdx) {
        if (stepIdx >= steps.length) return;

        const text = steps[stepIdx];
        let charIdx = 0;

        setTypedSteps(prev => {
            const arr = prev[courseId] ? [...prev[courseId]] : [];
            arr[stepIdx] = '';
            return { ...prev, [courseId]: arr };
        });

        if (typingTimersRef.current[courseId]) clearInterval(typingTimersRef.current[courseId]);

        typingTimersRef.current[courseId] = setInterval(() => {
            charIdx++;
            setTypedSteps(prev => {
                const arr = prev[courseId] ? [...prev[courseId]] : [];
                arr[stepIdx] = text.slice(0, charIdx);
                return { ...prev, [courseId]: arr };
            });
            if (charIdx >= text.length) {
                clearInterval(typingTimersRef.current[courseId]);
                // After a short delay, start the next line
                stepTimersRef.current[courseId] = setTimeout(() => {
                    typeStepLine(courseId, steps, stepIdx + 1);
                }, 400);
            }
        }, 20); // typing speed (ms per character)
    }
};

export default Courses;
