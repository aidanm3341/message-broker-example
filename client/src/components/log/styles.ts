import { CSSProperties } from 'react';

export const styles = {
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: '100%',
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
        borderCollapse: 'separate',
        borderSpacing: '0',
        fontSize: '0.875rem',
    } as CSSProperties,

    tableHeader: {
        textAlign: 'left',
        padding: '0.75rem 0.5rem',
        borderBottom: '2px solid rgba(102, 126, 234, 0.5)',
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '600',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        position: 'sticky',
        top: 0,
        background: 'rgba(0, 0, 0, 0.8)',
    } as CSSProperties,

    tableRow: {
        transition: 'background-color 0.2s ease',
    } as CSSProperties,

    tableRowHover: {
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
    } as CSSProperties,

    tableCell: {
        padding: '0.75rem 0.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        color: 'rgba(255, 255, 255, 0.8)',
    } as CSSProperties,

    timeCell: {
        padding: '0.75rem 0.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        color: 'rgba(167, 139, 250, 0.9)',
        fontFamily: 'monospace',
        fontSize: '0.8rem',
        whiteSpace: 'nowrap',
    } as CSSProperties,
} satisfies Record<string, CSSProperties>;