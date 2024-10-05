import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';
import './styles.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.render(
  <GoogleOAuthProvider clientId={"944125795870-j1vgdubdra1njjjq7t8sumjrn0p1fj3i.apps.googleusercontent.com"}>
    <App />
  </GoogleOAuthProvider>,
  document.getElementById('root')
);