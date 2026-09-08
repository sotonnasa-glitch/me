import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@fontsource-variable/vazirmatn';
import '@fontsource/plus-jakarta-sans';
import App from './App.tsx';
import './index.css';
import './order-modal-polish.css';
import './homepage-premium.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
