
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Initializing Billboard Suite...");

// Global Error Handler for Script Failures
window.onerror = function (message, source, lineno, colno, error) {
    console.error("Global Error Caught:", message, error);
    document.body.innerHTML = `
        <div style="height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f8fafc; font-family: sans-serif;">
            <div style="text-align: center; padding: 40px; background: white; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; max-width: 500px;">
                <h1 style="color: #1e293b; font-size: 24px; font-weight: 800; margin-bottom: 10px;">Application Failed to Start</h1>
                <p style="color: #64748b; margin-bottom: 20px;">A critical error prevented the application from loading.</p>
                <div style="background: #f1f5f9; padding: 15px; border-radius: 10px; font-family: monospace; font-size: 12px; color: #ef4444; text-align: left; overflow: auto; max-height: 200px;">
                    ${message}
                </div>
                <button onclick="window.location.reload()" style="margin-top: 20px; background: #0f172a; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer;">
                    Retry Application
                </button>
            </div>
        </div>
    `;
    return true; // Prevent default error handling
};

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
  // Allow window.onerror to pick this up if needed, or handle locally
}
