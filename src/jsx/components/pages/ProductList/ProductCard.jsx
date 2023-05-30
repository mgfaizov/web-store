import React, { useContext, useState } from 'react';

import './ProductCard.css';

import AppContext from '../../../contexts/AppContext.jsx';

function ProductCard({ isAuth, product, role, id }) {

    const { updateProductList } = useContext(AppContext);

    const [isClicked, setIsClicked] = useState(false);

    // deleteProduct ------------------------------------------------------------------- //
    // Удаление карточки товара
    const deleteProductCard = (id) => {
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
                    throw new Error("Failed to delete user.");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    // ------------------------------------------------------------------- deleteProduct //

    // Удаление товара из корзины
    const removeProductFromCart = (cartId) => {
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
                    throw new Error("Failed to delete user.");
                }
            })
            .then(data => {
                setIsClicked(false); // Устанавливаем состояние isClicked в false
            })
            .catch((error) => {
                console.log(error);
            });

    };

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
                                    <h1>Chair</h1>
                                    <p>Added to your cart</p>
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
        </>
    );
}

export default ProductCard;