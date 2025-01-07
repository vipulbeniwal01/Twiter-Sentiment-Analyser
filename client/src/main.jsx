// src/main.jsx
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element. Ensure there's a <div id='root'></div> in your index.html.");
}

createRoot(rootElement).render(
  <StrictMode>
      <App />
  </StrictMode>
);