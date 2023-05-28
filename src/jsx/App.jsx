import React from 'react';

import Header from './app/header/Header.jsx';
import Main from './app/main/Main.jsx';
import Footer from './app/footer/Footer.jsx';

import AppProvider from './AppProvider.jsx';
import AuthProvider from './AuthProvider.jsx';

function App() {

    console.log("App component");

    return (
        // <AppProvider>
            // <AuthProvider>
                <div className="app-container">
                    <Header />
                    <Main />
                    <Footer />
                </div>
            // </AuthProvider>
        // </AppProvider>
    );
}

export default App;