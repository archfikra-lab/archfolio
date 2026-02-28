'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
    target: number;
    suffix?: string;
    duration?: number;
    className?: string;
}

export default function AnimatedCounter({
    target,
    suffix = '',
    duration = 2000,
    className = ''
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const startTime = performance.now();

                    const animate = (currentTime: number) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Ease-out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.round(eased * target));

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };

                    requestAnimationFrame(animate);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    // Format numbers: 4200 -> 4.2k
    const formatNumber = (n: number) => {
        if (target >= 1000) {
            return (n / 1000).toFixed(1);
        }
        return n.toString();
    };

    return (
        <span ref={ref} className={className}>
            {formatNumber(count)}{suffix}
        </span>
    );
}
