import { CSSProperties } from 'react';

export const styles = {
    container: {
        display: 'flex',
        borderLeft: '1px solid gray',
        padding: '0.5rem',
        width: '12rem',
        height: '3rem',
        alignItems: 'center',
    } as CSSProperties,

    symbol: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
        marginRight: '1rem',
    } as CSSProperties,

    pricePositive: {
        color: 'green',
        fontSize: '1.5rem',
    } as CSSProperties,

    priceNegative: {
        color: 'red',
        fontSize: '1.5rem',
    } as CSSProperties,
};