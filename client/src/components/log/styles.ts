import { CSSProperties } from 'react';

export const styles = {
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        height: '100vh',
        width: '400px',
        minWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
    } as CSSProperties,

    header: {
        padding: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(102, 126, 234, 0.1)',
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