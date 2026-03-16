import { useState, useEffect } from 'react';

export function Toast({ message, type = 'info', duration = 3000, onClose }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    return (
        <div className={`toast toast-${type}`}>
            <p>{message}</p>
            <button className="toast-close" onClick={() => { setVisible(false); onClose?.(); }}>×</button>
        </div>
    );
}

export default Toast;
