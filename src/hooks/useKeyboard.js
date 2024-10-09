// src/hooks/useKeyboard.js
import { useState, useEffect } from 'react';

export const useKeyboard = () => {
    const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['w', 'a', 's', 'd'].includes(e.key)) {
                setKeys((prev) => ({ ...prev, [e.key]: true }));
            }
        };

        const handleKeyUp = (e) => {
            if (['w', 'a', 's', 'd'].includes(e.key)) {
                setKeys((prev) => ({ ...prev, [e.key]: false }));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return keys;
};