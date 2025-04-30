import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = React.memo(({ to, duration = 3000, className, isVisible }) => {
    const [count, setCount] = useState(0);
    const frame = useRef();

    useEffect(() => {
        if (isVisible) {
            let startTime;
            const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                setCount(Math.floor(progress * to));
                if (progress < 1) {
                    frame.current = requestAnimationFrame(animate);
                }
            };

            frame.current = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(frame.current);
        } else {
            setCount(0); // Reset count saat tidak terlihat
        }
    }, [to, duration, isVisible]);

    return <span className={`font-bold ${className}`}>{count}</span>;
});

export default AnimatedCounter;