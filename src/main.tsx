import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@fontsource-variable/vazirmatn';
import '@fontsource/plus-jakarta-sans';
import App from './App.tsx';
import './index.css';
import './order-modal-polish.css';
import './homepage-premium.css';
import './halloween-theme.css';

// Seasonal mode is automatic from Oct 25 through Nov 2 in the visitor's local time.
// Use ?halloween=1 to preview it early, or ?halloween=0 to switch it off.
const halloweenOverride = new URLSearchParams(window.location.search).get('halloween');
const localDate = new Date();
const isHalloweenWindow =
  (localDate.getMonth() === 9 && localDate.getDate() >= 25) ||
  (localDate.getMonth() === 10 && localDate.getDate() <= 2);

if (halloweenOverride === '1' || (halloweenOverride !== '0' && isHalloweenWindow)) {
  document.documentElement.classList.add('tekvix-halloween');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
