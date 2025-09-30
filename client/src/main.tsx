import 'reflect-metadata';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App/App.tsx';
import { initializeWebSocket } from './services/websocket.ts';

initializeWebSocket().catch((error) => {
    console.error('Failed to initialize WebSocket adapter:', error);
});

createRoot(document.getElementById('root')!).render(
    <App />,
);
