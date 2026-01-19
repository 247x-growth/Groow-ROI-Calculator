import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Global Error Handler for Module Loading Issues
window.addEventListener('error', (event) => {
    const rootElement = document.getElementById('root');
    if (rootElement && !rootElement.hasChildNodes()) {
         rootElement.innerHTML = `<div style="color:white; background: #0f0f23; height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; font-family: sans-serif; text-align:center; padding: 20px;">
            <h2 style="color: #ef4444; margin-bottom: 10px; font-size: 24px;">Errore Critico</h2>
            <p>Impossibile caricare i moduli dell'applicazione.</p>
            <pre style="background: #1a1a2e; padding: 15px; border-radius: 8px; margin-top: 20px; color: #cbd5e1; text-align: left; overflow: auto; max-width: 800px;">${event.message}</pre>
        </div>`;
    }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Failed to find the root element');
}

try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
} catch (error) {
    console.error("Application failed to mount:", error);
    rootElement.innerHTML = `<div style="color:white; background: #0f0f23; height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; font-family: sans-serif;">
        <h2 style="color: #ef4444; margin-bottom: 10px;">Errore di Caricamento</h2>
        <p>Si è verificato un errore critico durante l'inizializzazione dell'app.</p>
        <pre style="background: #1a1a2e; padding: 10px; border-radius: 5px; margin-top: 20px; color: #cbd5e1;">${error instanceof Error ? error.message : String(error)}</pre>
    </div>`;
}