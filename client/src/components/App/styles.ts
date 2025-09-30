import { CSSProperties } from 'react';

export const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
    } as CSSProperties,

    tickerBar: {
        display: 'flex',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        position: 'relative',
    } as CSSProperties,

    contentRow: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        overflow: 'hidden',
    } as CSSProperties,

    mainContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: '1',
        paddingTop: '2rem',
        overflow: 'hidden',
    } as CSSProperties,
    tickerScroll: {
        display: 'flex',
        animation: 'scroll 30s linear infinite',
        whiteSpace: 'nowrap',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
    } as CSSProperties,
    tickerContent: {
        display: 'flex',
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
        gap: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '3rem',
        overflowY: 'auto',
        flex: '1',
        width: '100%',
        padding: '0 2rem 2rem 2rem',
        alignContent: 'flex-start',
        position: 'relative',
        maskImage:
            'linear-gradient(to bottom, transparent 0%, black 20px, black calc(100% - 100px), transparent 100%)',
        WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 20px, black calc(100% - 100px), transparent 100%)',
    } as CSSProperties,
    trackerInner: {
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        paddingTop: '1.5rem',
    } as CSSProperties,
};
