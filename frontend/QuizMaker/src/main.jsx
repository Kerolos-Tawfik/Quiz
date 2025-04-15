import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ أضف هذا السطر
import './index.css';
import App from './App';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>   {/* ✅ أضف هذا */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
