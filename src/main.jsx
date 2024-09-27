import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import awsconfig from './awsconfig';
import { Amplify } from 'aws-amplify';
import { BrowserRouter } from 'react-router-dom';

Amplify.configure(awsconfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
