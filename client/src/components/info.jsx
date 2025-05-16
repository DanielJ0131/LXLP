import React from "react";

const reasons = [
    "Open Source: Linux is free and open source, allowing users to modify and distribute the software.",
    "Security: Linux is less vulnerable to viruses and malware compared to Windows.",
    "Performance: Linux often runs faster and uses fewer system resources.",
    "Customization: Users can customize almost every aspect of Linux.",
    "Privacy: Linux does not collect user data by default.",
    "Software Management: Package managers make installing and updating software easy.",
    "Community Support: A large, active community provides help and resources.",
    "Stability: Linux systems are known for their reliability and uptime.",
];

function Info() {
    return (
        <div style={{ maxWidth: 700, margin: "2rem auto", padding: "1rem" }}>
            <h1>Why Use Linux Instead of Windows?</h1>
            <ul>
                {reasons.map((reason, idx) => (
                    <li key={idx} style={{ marginBottom: "0.5rem" }}>
                        {reason}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Info;