import { CSSProperties } from 'react';

export const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        margin: '1rem',
        padding: '1.5rem',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        minWidth: '300px',
    } as CSSProperties,
};