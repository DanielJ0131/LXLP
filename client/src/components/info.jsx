import React from "react";
import { useEffect, useRef } from "react";

const reasons = [
    "Open Source: Linux is free and open source, allowing users to modify and distribute the software.",
    "Security: Linux is less vulnerable to viruses and malware compared to Windows.",
    "Performance: Linux often runs faster and uses fewer system resources.",
    "Customization: Users can customize almost every aspect of Linux.",
    "Privacy: Linux does not collect user data by default.",
    "Software Management: Package managers make installing and updating software easy.",
    "Community Support: A large, active community provides help and resources.",
    "Stability: Linux systems are known for their reliability and uptime.",
    "Variety: Many distributions (distros) are available to suit different needs and preferences.",
    "Compatibility: Linux runs on a wide range of hardware, including older computers.",
    "No Licensing Fees: No need to pay for expensive licenses or subscriptions.",
    "Developer Friendly: Powerful tools and environments for programming and development.",
    "Regular Updates: Frequent updates and patches keep systems secure and up to date.",
    "No Forced Updates: Users control when and how updates are applied.",
    "No Need to Restart: Most updates and changes do not require a system reboot.",
];

function Info() {
    const listRef = useRef([]);

    useEffect(() => {
        listRef.current.forEach((el, idx) => {
            if (el) {
                el.style.opacity = 0;
                el.style.transform = "translateY(20px)";
                el.style.transition = "opacity 0.5s, transform 0.5s";
                setTimeout(() => {
                    el.style.opacity = 1;
                    el.style.transform = "translateY(0)";
                }, idx * 100);
            }
        });
    }, []);

    return (
        <div
            className="info-container"
            style={{ textAlign: "left" }}
        >
            <h1>Why Use Linux Instead of Windows or Mac?</h1>
            <ul>
                {reasons.map((reason, idx) => (
                    <li
                        key={idx}
                        ref={el => (listRef.current[idx] = el)}
                        style={{ marginBottom: "0.5rem", opacity: 0 }}
                    >
                        {reason}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Info;