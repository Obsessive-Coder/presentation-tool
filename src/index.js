import React from 'react';

// Components.
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import App from './App'

// Utils, styles, and other helpers.
import ReactDOM from 'react-dom'
import './index.css';
import reportWebVitals from './reportWebVitals'

const theme = createTheme({
  palette: {
    primary: {
      light: '#542989',
      main: '#542989',
      dark: '#542989'
    },
    secondary: {
      light: '#6c9730',
      main: '#6c9730',
      dark: '#6c9730'
    }
  }
})

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
