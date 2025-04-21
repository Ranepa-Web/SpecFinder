import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Импорты контекста и компонентов
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm'; // <-- Добавлен импорт
import PerformerProfile from './components/PerformerProfile'; // <-- Добавлен импорт
import Header from './components/Header';
import MainBanner from './components/MainBanner';
import Search from './components/Search';

// Компонент для защиты маршрутов
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) { return <div>Проверка аутентификации...</div>; } // Показываем загрузку

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Компонент-обертка с шапкой
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

// Компонент с основной логикой маршрутизации
const AppContent = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) { return <div>Загрузка приложения...</div>; } // Показываем загрузку

    return (
        <Routes>
            {/* Главная страница */}
            <Route path="/" element={
                    <PrivateRoute> <Layout> <MainBanner /> <Search /> </Layout> </PrivateRoute>
                } />
            {/* Страница профиля */}
            <Route path="/profile" element={
                    <PrivateRoute> <Layout> <PerformerProfile /> </Layout> </PrivateRoute>
                } />
            {/* Страница входа */}
            <Route path="/login" element={
                    isAuthenticated ? <Navigate to="/" replace /> : <Layout> <LoginForm /> </Layout>
                } />
            {/* Страница регистрации */}
            <Route path="/register" element={
                    isAuthenticated ? <Navigate to="/" replace /> : <Layout> <RegisterForm /> </Layout>
                } />
            {/* Редирект для всех остальных путей */}
             <Route path="*" element={ <Navigate to={isAuthenticated ? "/" : "/login"} replace /> } />
        </Routes>
    );
};

// Главный компонент приложения
export const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
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