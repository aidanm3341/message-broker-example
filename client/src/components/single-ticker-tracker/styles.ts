import { CSSProperties } from 'react';

export const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        margin: '0.5rem',
        padding: '0.75rem',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
        minWidth: '250px',
    } as CSSProperties,
    title: {
        margin: '0 0 0.5rem 0',
        fontSize: '1.2rem',
        fontWeight: '600',
    } as CSSProperties,
};