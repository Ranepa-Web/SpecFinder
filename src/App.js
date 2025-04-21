import React from 'react';
// import Header from "./components/Header"
// import MainBanner from "./components/MainBanner"
// import Search from "./components/Search"

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/LoginForm';
import Header from "./components/Header";
import MainBanner from "./components/MainBanner";
import Search from "./components/Search";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const Layout = ({ children }) => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <div className="app-wrapper">
            <Header isAuthenticated={isAuthenticated} onLogout={logout} />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

const AppContent = () => {
    const { isAuthenticated } = useAuth();
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Layout>
                            <MainBanner />
                            <Search />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/login"
                element={
                    isAuthenticated ? <Navigate to="/" replace /> :
                    <Layout>
                        <LoginForm />
                    </Layout>
                }
            />
        </Routes>
    );
};

export const App = () => {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
};

// class App extends React.Component {
//     render () {
//         return (
//             <div>
//                 <Header />
//                 <MainBanner />
//                 <Search />
//             </div>
//         )
//     }
// }
//
// export default App