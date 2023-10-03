import  { StrictMode } from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import './assets/styles/index.css';
import App from './App';

const rootElement: HTMLElement | null = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element');
const root: Root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

