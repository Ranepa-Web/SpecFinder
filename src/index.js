// стили
import './css/main.css';
import './css/grid.css'; 

// импорт react и reactDOMClient
import React from 'react';
import { StrictMode } from 'react';
import * as ReactDOMClient from 'react-dom/client';

// импорт основного компонента приложения
import { App } from './App';

const app = ReactDOMClient.createRoot(document.getElementById('app'));

app.render(
  <StrictMode>
    <App />
  </StrictMode>
);