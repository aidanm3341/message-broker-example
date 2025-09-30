import { CSSProperties } from 'react';

export const styles = {
    container: {
        display: 'flex',
        borderLeft: '2px solid rgba(255, 255, 255, 0.1)',
        padding: '0.75rem 1rem',
        width: '12rem',
        height: '3rem',
        alignItems: 'center',
        transition: 'all 0.3s ease',
    } as CSSProperties,

    symbol: {
        fontWeight: 'bold',
        fontSize: '1.25rem',
        marginRight: '1rem',
        color: 'rgba(255, 255, 255, 0.9)',
    } as CSSProperties,

    pricePositive: {
        color: '#10b981',
        fontSize: '1.25rem',
        fontWeight: '600',
        textShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
    } as CSSProperties,

    priceNegative: {
        color: '#ef4444',
        fontSize: '1.25rem',
        fontWeight: '600',
        textShadow: '0 0 10px rgba(239, 68, 68, 0.3)',
    } as CSSProperties,
};