import React from 'react';

// Components.
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SignUp, Home } from './pages'
import App from './App';
import { Route1, Route2 } from './routes'

// Utils, styles, and other helpers.
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
    {/* <BrowserRouter basename="/live-presentation-tool">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/route1" element={<Route1 />} />
        <Route exact path="/route2" element={<Route2 />} />
      </Routes>
    </BrowserRouter> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
