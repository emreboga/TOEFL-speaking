import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import * as firebaseui from 'firebaseui'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './index.css';
import 'firebaseui/dist/firebaseui.css'
import App from './App';
import reportWebVitals from './reportWebVitals';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByr6BfNS7UG078-Z1FFmL4WGylSt8pVk0",
  authDomain: "speak-vjiltn.firebaseapp.com",
  projectId: "speak-vjiltn",
  storageBucket: "speak-vjiltn.appspot.com",
  messagingSenderId: "303670124180",
  appId: "1:303670124180:web:e3dbc79c116ff23d91de81"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseUI = new firebaseui.auth.AuthUI(getAuth());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App firebaseApp={firebaseApp} firebaseUI={firebaseUI} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
