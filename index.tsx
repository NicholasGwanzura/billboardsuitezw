import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Initializing Billboard Management System...");

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("App mounted successfully.");
} catch (error) {
  console.error("Failed to mount application:", error);
  document.body.innerHTML = `<div style="padding: 20px; text-align: center; color: red;"><h1>Application Error</h1><p>${error}</p><p>Check console for details.</p></div>`;
}
