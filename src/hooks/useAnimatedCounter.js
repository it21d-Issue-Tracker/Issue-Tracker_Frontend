import { useState, useEffect } from 'react';

// Custom hook for animating numbers
export const useAnimatedCounter = (targetValue, duration = 1500) => {
    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {
        if (targetValue === 0) {
            setCurrentValue(0);
            return;
        }

        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease-out
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const newValue = Math.floor(easeOut * targetValue);

            setCurrentValue(newValue);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [targetValue, duration]);

    return currentValue;
};