import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Questions from './Questions.jsx'

import './index.css';
import App from './App.jsx';
import Result from './Result.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Questions />
  </StrictMode>,
)
