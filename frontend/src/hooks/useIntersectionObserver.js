import { useEffect, useState, useRef } from 'react';

export const useIntersectionObserver = ({ target, onIntersect, threshold = 0, root = null, rootMargin = '0px' }) => {
    const observer = useRef(null);
    const [entry, setEntry] = useState(null);

    useEffect(() => {
        observer.current = new IntersectionObserver(
            (entries) => {
                const intersectingEntry = entries[0];
                if (intersectingEntry.isIntersecting) {
                    onIntersect(intersectingEntry);
                    setEntry(intersectingEntry);
                } else if (entry?.isIntersecting && onIntersect) {
                    // Anda bisa menambahkan logika untuk saat elemen keluar dari viewport jika diperlukan
                }
            },
            {
                root,
                rootMargin,
                threshold,
            }
        );

        if (target && target.current) {
            observer.current.observe(target.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [target, onIntersect, threshold, root, rootMargin, entry]);

    return entry;
};