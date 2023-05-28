import React from 'react';
// import Request from '../services/api/Request.js';

/** 
 * Компонент AppContext, будет содержать контекст для хранения информации 
 * о текущем пользователе и его правах доступа.
 */

// Создание нового контекста
const AppContext = React.createContext({

    isMenuOpen: false, 
    setIsMenuOpen: () => { },
    isModalOpen: false,
    setIsModalOpen: () => { },
    modalContent: null,
    setModalContent: () => { }, 
    errors: '',
    setErrors: () => { },
    errorMessage: '',
    setErrorMessage: () => { },
    errorServer: {}, 
    setErrorServer: () => { },

    searchValue: '', 
    setSearchValue: () => { },

    // products: [], 
    // setProducts: () => { },

    // productListUpdated: false, 
    // setProductListUpdated: () => { },

    // updateProductList: () => {},

});

export default AppContext;