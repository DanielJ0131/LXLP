import React from 'react';
import '../styles/AboutUs.css';

const AboutUs = () => {
    const teamMembers = [
        { name: 'Daniel', role: 'Developer' },
        { name: 'Mustafa', role: 'Developer' },
        { name: 'Ryad', role: 'Developer' },
        { name: 'Tony', role: 'Developer' },
        { name: 'Patric', role: 'Developer' },
        { name: 'Sergej', role: 'Developer' },
    ];

    return (
        <div className="about-us-container">
            <h1>About Us</h1>
            <p>
                We are a group of dedicated students from Kristianstad University, working together to develop the Linux Learning Platform (LXLP). 
                Our goal is to create an engaging and user-friendly platform to help others learn and grow their skills in Linux.
            </p>
            <h2>Our Team</h2>
            <ul>
                {teamMembers.map((member, index) => (
                    <li key={index}>
                        {member.name} - {member.role}
                    </li>
                ))}
            </ul>
            <p>
                Through collaboration, innovation, and hard work, we aim to make this platform a valuable resource for learners worldwide.
            </p>
        </div>
    );
};

export default AboutUs;