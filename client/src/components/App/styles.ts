import { CSSProperties } from 'react';

export const styles = {
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
    } as CSSProperties,

    mainContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: 'auto',
        flex: '1',
    } as CSSProperties,

    tickerBar: {
        display: 'flex',
        position: 'absolute',
        top: '0',
        left: '0',
    } as CSSProperties,

    form: {
        width: '50rem',
        display: 'flex',
    } as CSSProperties,

    input: {
        flexGrow: 1,
        marginRight: '1rem',
    } as CSSProperties,

    trackerContainer: {
        display: 'flex',
    } as CSSProperties,
};