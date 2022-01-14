import React from 'react';

// Components.
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App';
import { Route1, Route2 } from './routes'

// Utils, styles, and other helpers.
import { render } from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/route1" element={<Route1 />} />
        <Route path="/route2" element={<Route2 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
