import React, { useState, useEffect, useMemo } from 'react';

import jwtDecode from 'jwt-decode';
import { useHistory } from 'react-router-dom';

import AuthContext from './contexts/AuthContext.jsx';

/** 
 * Для динамической загрузки в React есть несколько подходов. 
 * Один из самых популярных - это использование Code Splitting. 
 * Code Splitting позволяет разбить код на небольшие фрагменты (chunks), 
 * которые могут быть загружены только при необходимости.
 */

/**
 * Компонент AuthProvider, будет обрабатывать и сохранять полученный от сервера токен. 
 * Этот компонент также будет отвечать за загрузку необходимых модулей в зависимости от прав доступа пользователя. 
 */

const AuthProvider = (props) => {

    // console.log("AuthProvider component");

    const history = useHistory();

    // Получаем токен из localStorage
    const token = localStorage.getItem('token');

    const [isAuth, setIsAuth] = useState(!!token);
    // const isAuth = useMemo(() => !!token, [token]);
    const [id, setId] = useState(null);
    const [role, setRole] = useState(null);
    const [user, setUser] = useState({});
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (token) {
            setIsAuth(true);
            // Декодируем токен и получаем объект с данными, хранящимися внутри него
            const decodedToken = jwtDecode(token);
            // Извлекаем данные пользователя из декодированного токена
            const userId = decodedToken.id;
            const userRole = decodedToken.role;
            // localStorage.setItem('id', userId);
            setId(userId);
            if (userId === null) {
                console.error("AuthProvider: ID пользователя не определен.");
                return;
            }
            setRole(userRole);
            // Проверка срока действия токена
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                handleLogout(); // Вызов функции выхода из системы
            }

        }
    }, [token]);

    const handleLogout = () => {
        // Очистка локального хранилища и состояний
        localStorage.removeItem('token');
        setIsAuth(false);
        setId(null);
        setRole(null);
        setUser({});
        setUsers([]);
        history.push('/');
        // Дополнительные действия по выходу из системы, если необходимо
      };

    console.log('AuthProvider isAuth:', isAuth);
    console.log('AuthProvider id:', id);

    // Загрузка модулей в зависимости от прав доступа пользователя
    /*  const components = isAdmin ? {
         // AdminComponent: React.lazy(() => import('./AdminComponent')),
     } : {
         // UserComponent: React.lazy(() => import('./UserComponent')),
     }; */

    // const value = useMemo(() => ({ user, isAdmin, isAuth, setUser, setAdmin }), [user, isAdmin, isAuth]);

    const authContextValue = {
        isAuth, setIsAuth,
        id, setId,
        user, setUser,
        users, setUsers,
        role, setRole
    };

    return (
        // <AuthContext.Provider value={value}>
        <AuthContext.Provider value={authContextValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;