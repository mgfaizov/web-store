import React, { useContext, useState, useEffect } from 'react';

import './ProductCard.css';

import Modal from '../../../components/modal/Modal.jsx';

import AppContext from '../../../contexts/AppContext.jsx';

function ProductCard({ isAuth, product, role, id, isClicked, setIsClicked }) {

    const {
        updateProductList,
        isModalOpen, setIsModalOpen, modalContent, setModalContent
    } = useContext(AppContext);

    const openErrorModal = (errorMessage) => {
        console.log('MainComponent.openErrorModal.errorMessage:', errorMessage);
        setIsModalOpen(true);
        setModalContent(
            <div className="error">{errorMessage}</div>
        );
    };

    // const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        // проверка продукта в корзине ----------------------------------------------------- //
        if (isAuth) {
            fetch(`/cart/all`, {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    setIsClicked(true);
                    // setIsClicked(data.isInCart);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [isAuth, product.id, id]);
    // проверка продукта в корзине ----------------------------------------------------- //


    // deleteProduct ------------------------------------------------------------------- //
    // Удаление карточки товара
    /* const deleteProductCard = (id) => {
        fetch(`/products/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then((response) => {
                if (response.ok) {
                    updateProductList();
                } else {
                    throw new Error("Не удалось удалить.");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }; */

    const deleteProductCard = (id) => {
        // Проверка наличия товара в корзине пользователя
        fetch(`/cart/check/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    // Если товар есть в корзине, выводим сообщение
                    openErrorModal('Пока товар находится в корзине пользователя. Удаление невозможно.');
                    
                } else {
                    // Если товар отсутствует в корзине, удаляем карточку товара
                    fetch(`/products/${id}`, {
                        method: "DELETE",
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    })
                        .then((response) => {
                            if (response.ok) {
                                updateProductList();
                            } else {
                                openErrorModal('Пока товар находится в корзине пользователя. Удаление невозможно.');
                                throw new Error("Не удалось удалить.");
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    // ------------------------------------------------------------------- deleteProduct //

    // Удаление товара из корзины ------------------------------------------------------- //
    /* const removeProductFromCart = (cartId) => {
        fetch(`/cart/${cartId}`, {
            method: "DELETE",
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then((response) => {
                if (response.ok) {
                    updateProductList();
                } else {
                    throw new Error("Не удалось удалить.");
                }
            })
            .then(data => {
                setIsClicked(false); // Устанавливаем состояние isClicked в false
                updateProductList();
            })
            .catch((error) => {
                console.log(error);
            });

    }; */

    const removeProductFromCart = (cartId) => {
        fetch(`/cart/${cartId}`, {
            method: "DELETE",
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response;
                } else {
                    throw new Error("Не удалось удалить.");
                }
            })
            .then(data => {
                setIsClicked(false); // Устанавливаем состояние isClicked в false
                updateProductList(); // Обновление списка товаров после успешного удаления из корзины
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // Удаление товара из корзины ------------------------------------------------------- //

    // Добавление товара в корзину
    const addProductToCart = () => {
        const productId = product.id; // Получите идентификатор продукта из объекта product
        const userId = id; // Получите идентификатор пользователя, если требуется

        // const data = {
        //     product: productId,
        //     user: userId,
        //     quantity: 1,
        // };
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token,
        };

        // Запрос на получение объекта продукта
        fetch(`/products/${productId}`, {
            method: 'GET',
            headers,
        })
            .then(response => response.json())
            .then(productData => {
                // Запрос на получение объекта пользователя
                fetch(`/users/${userId}`, {
                    method: 'GET',
                    headers,
                })
                    .then(response => response.json())
                    .then(userData => {
                        const data = {
                            product: productData,
                            user: userData,
                            quantity: 1,
                        };

                        fetch('/cart/submit', {
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers,
                        })
                            .then(async response => {
                                if (response.ok) {
                                    console.log('ProductCard.response.OK: ', response);
                                    return response.json();
                                } else {
                                    console.error('ProductCard.response.ERROR: ', response);

                                    const responseErrors = {};
                                    const responseData = await response.json();
                                    responseData.forEach(error => {
                                        const field = error.field;
                                        const message = error.defaultMessage;
                                        const code = error.code;

                                        if (!responseErrors[field]) {
                                            responseErrors[field] = {};
                                        }
                                        if (!responseErrors[field][code]) {
                                            responseErrors[field][code] = [message];
                                        } else {
                                            responseErrors[field][code].push(message);
                                        }
                                    });

                                    setModalErrors(responseErrors);
                                    return Promise.reject(response);
                                }
                            })
                            .then(data => {
                                setIsClicked(true);
                            })
                            .catch(error => {
                                throw new Error(
                                    `Ошибка при обработке ответа сервера. Код ошибки: ${error.status}. Текст ошибки: ${error.message}`
                                );
                            });
                    })
                    .catch(error => {
                        console.log("Ошибка в запросе на получение объекта продукта:", error);
                    });
            })
            .catch(error => {
                console.log("Ошибка в запросе на получение объекта пользователя:", error);
            });
    };


    return (
        <>
            
            <div className="wrapper-card">
                <div className="container-card">
                    {role === 'ADMIN' ? (
                        <span className="delete-card" onClick={() => deleteProductCard(product.id)}>&times;</span>
                    ) : null}
                    <div className="top"></div>
                    {/* clicked */}
                    <div className={`bottom ${isClicked ? 'clicked' : ''}`}>
                        <div className="left">
                            <div className="details">
                                <h1>{product.productName}</h1>
                                <p>{product.price + " руб."}</p>
                            </div>
                            {isAuth && (
                                <div className="buy" onClick={() => addProductToCart()}><i className="material-icons">add_shopping_cart</i></div>
                            )}
                        </div>
                        {isAuth && (
                            <div className="right">
                                <div className="done"><i className="material-icons">done</i></div>
                                <div className="details">
                                    <h1>{product.productName}</h1>
                                    <p>Добавлено в корзину</p>
                                </div>
                                <div className="remove" onClick={() => removeProductFromCart(product.id)}><i className="material-icons">clear</i></div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="inside">
                    <div className="icon"><i className="material-icons">info_outline</i></div>
                    <div className="contents-card">
                        <table>
                            <tr>
                                <th>Width</th>
                                <th>Height</th>
                            </tr>
                            <tr>
                                <td>3000mm</td>
                                <td>4000mm</td>
                            </tr>
                            <tr>
                                <th>Something</th>
                                <th>Something</th>
                            </tr>
                            <tr>
                                <td>200mm</td>
                                <td>200mm</td>
                            </tr>
                            <tr>
                                <th>Something</th>
                                <th>Something</th>
                            </tr>
                            <tr>
                                <td>200mm</td>
                                <td>200mm</td>
                            </tr>
                            <tr>
                                <th>Something</th>
                                <th>Something</th>
                            </tr>
                            <tr>
                                <td>200mm</td>
                                <td>200mm</td>
                            </tr>
                        </table>
                    </div>
                </div>
                
            </div>
            {isModalOpen && <Modal content={modalContent} closeModal={() => setIsModalOpen(false)} />}
        </>
    );
}

export default ProductCard;