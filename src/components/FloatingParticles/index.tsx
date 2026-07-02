import React, { useEffect, useRef } from 'react';
import './index.scss'; // Ensure the path is correct
//
const FloatingParticles = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) return; // Exit if container is not available

        function createParticle() {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // @ts-ignore
            const xPos = Math.random() * container.clientWidth;
            // @ts-ignore
            const yPos = Math.random() * container.clientHeight;

            particle.style.left = `${xPos}px`;
            particle.style.top = `${yPos}px`;
            particle.style.animationDuration = `5s`; // Fixed duration of 5 seconds

            // @ts-ignore
            container.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 5000); // Remove after 5 seconds
        }


        const interval = setInterval(createParticle, 250);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    return <div ref={containerRef} style={{     overflow: "hidden", position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}></div>;
};

export default FloatingParticles;
