import { CSSProperties } from 'react';

export const styles = {
    container: {
        backgroundColor: 'rgb(28, 28, 28)',
        height: '100vh',
        width: '400px',
        minWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
    } as CSSProperties,

    header: {
        padding: '1rem',
        paddingBottom: '0.5rem',
    } as CSSProperties,

    tableContainer: {
        flex: 1,
        overflowY: 'auto',
        padding: '0 1rem 1rem 1rem',
    } as CSSProperties,

    table: {
        justifySelf: 'end',
        alignSelf: 'end',
        width: '100%',
    } as CSSProperties,
};