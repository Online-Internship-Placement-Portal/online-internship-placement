/**
 * React Application Entrypoint
 * Author: Navya R (PES2UG24CS308)
 * Role: User Interface (Frontend)
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
