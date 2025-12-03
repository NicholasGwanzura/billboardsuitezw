import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Initializing Billboard Suite...");

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  // Use createRoot directly from named import
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("App mounted successfully.");
} catch (error) {
  console.error("Failed to mount application:", error);
  document.body.innerHTML = `<div style="padding: 20px; text-align: center; color: #ef4444; font-family: sans-serif;"><h1>Application Error</h1><p>${error}</p><p>Check console for details.</p></div>`;
}