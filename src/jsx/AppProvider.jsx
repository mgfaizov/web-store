import React, { useState, useCallback, useEffect } from 'react';
import AppContext from './contexts/AppContext.jsx';

// Компонент-провайдер
const AppProvider = (props) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [errors, setErrors] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorServer, setErrorServer] = useState({});

    const [isClicked, setIsClicked] = useState(false);

    const [searchValue, setSearchValue] = useState('');

    const [products, setProducts] = useState([]);
    const [productListUpdated, setProductListUpdated] = useState(false);

    // Обновление списка пользователей
    // Чтобы этот список не стал причиной бесконечного цикла вызовов useEffect, оберачиваем его в useCallback
    const updateProductList = useCallback(() => {

        // 
        const token = localStorage.getItem('token');
        const headers = {};
        // проверяем наличие токена в локальном хранилище
        if (token) {
            headers.Authorization = token;
        }

        fetch('/products/all', {
            method: 'GET',
            headers
            // headers: {
            //     'Authorization': localStorage.getItem('token')
            // }
        })
            .then(async response => {

                const responseData = await response.json();
                const message = responseData.message;

                if (response.ok) {
                    console.log("AuthProfile.response.OK: ", response);
                    console.log("AuthProfile.response.OK: ", message);
                    return responseData;
                } else {
                    if (response.status === 400) {
                        console.error("AuthProfile.response.ERROR.400: ", response);
                        console.log("AuthProfile.message.ERROR.400: ", message);
                        return responseData;
                    } else if (response.status === 401) {
                        console.error("AuthProfile.response.ERROR.401: ", response);
                        console.log("AuthProfile.message.ERROR.401: ", message);
                        return responseData;
                        // throw new Error('Для доступа не хватает прав');
                        // return response.json();
                    }
                }
            })
            .then(data => setProducts(data))
            .catch((error) => {
                console.log(error);
                openErrorModal(error.message);
            });
    }, []);

    useEffect(() => {
        if (productListUpdated) {
            updateProductList();
            setProductListUpdated(false);
        }
    }, [productListUpdated, updateProductList]);

    const appContextValue = {
        isMenuOpen, setIsMenuOpen,
        isModalOpen, setIsModalOpen,
        modalContent, setModalContent,
        errors, setErrors,
        errorMessage, setErrorMessage,
        errorServer, setErrorServer,
        products, setProducts,
        // productListUpdated, setProductListUpdated,
        updateProductList, 

        isClicked, setIsClicked,

        searchValue, setSearchValue
    };

    return (
        <AppContext.Provider value={appContextValue}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppProvider;