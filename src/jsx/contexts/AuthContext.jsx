// import React, { createContext } from 'react';
import React from 'react';

/** 
 * Компонент AuthContext, будет содержать контекст для хранения информации 
 * о текущем пользователе и его правах доступа.
 */

const AuthContext = React.createContext({

    isAuth: false,
    setIsAuth: () => { },
    user: {},
    setUser: () => { },
    users: [],
    setUsers: () => { },
    id: null,
    role: null,
    // setRole(null); // очистка значения role при выходе из системы
    // setRole: () => {}

});

export default AuthContext;