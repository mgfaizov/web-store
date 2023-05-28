import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import AppProvider from './AppProvider.jsx';
import AuthProvider from './AuthProvider.jsx';
import App from './App.jsx';

ReactDOM.render(
    <BrowserRouter>
    <React.StrictMode>
        <AppProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </AppProvider>
    </React.StrictMode>
    </BrowserRouter>,
    document.getElementById('root')
);
