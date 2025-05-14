import React from 'react';
import '../styles/about.css';

const About = () => {
    const teamMembers = [
        { name: 'Daniel', role: 'Developer' , link: 'https://gemini.google.com'},  //  https://github.com/DanielJ0131
        { name: 'Mustafa', role: 'Developer' , link: 'https://github.com/must-Zeus0036'},
        { name: 'Ryad', role: 'Developer' , link: 'https://github.com/ryadhazin0002'},
        { name: 'Tony', role: 'Developer' , link: 'https://github.com/TonyMNG'},
        { name: 'Patrick', role: 'Developer' , link: 'https://github.com/padthe'},
        { name: 'Sergej', role: 'Developer' , link: 'https://github.com/sergejmm'},
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
                        <a href={member.link} target="_blank" rel="noopener noreferrer">
                            {member.name} - {member.role}
                        </a>
                    </li>
                ))}
            </ul>
            <p>
                Through collaboration, innovation, and hard work, we aim to make this platform a valuable resource for learners worldwide.
            </p>
        </div>
    );
};

export default About;