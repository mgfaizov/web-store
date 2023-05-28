import React, { useContext, useState } from 'react';

import './ProductCard.css';

import AppContext from '../../../contexts/AppContext.jsx';

function ProductCard({ product, role }) {

    const { updateProductList } = useContext(AppContext);

    const [isClicked, setIsClicked] = useState(false);

    // deleteProduct ------------------------------------------------------------------- //
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

    const removeProductToCart = () => {
        fetch(`/cart/${id}`, {
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

    const addProductToCart = () => {
        const data = {
            productName: product.productName,
            price: product.price,
        };
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        };
        fetch('/cart/submit', {
            method: 'POST',
            body: JSON.stringify(data),
            // body: formData,
            headers
        })
            .then(async response => {
                if (response.ok) {
                    console.log("RegProfile.response.OK: ", response);
                    return response.json(); // преобразуем тело ответа в JSON объект;
                } else {
                    console.error("RegProfile.response.ERROR: ", response);

                    const responseErrors = {}; // сохраняем ошибки в объект
                    const responseData = await response.json(); // преобразуем тело ответа в JSON объект
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
                    //setResult({}); // Сброс данных
                    setModalErrors(responseErrors);
                    return Promise.reject(response);
                    // throw new Error(JSON.stringify(responseErrors));

                }
            })
            .then(data => {
                setIsClicked(true); // Устанавливаем состояние isClicked в true
                //setResult(data);
                // updateProductList(); // 
                // setErrors({}); // Сброс ошибок
                // closeModal(); // Закрытие модального окна
            })
            .catch(error => {
                // setErrors(error);
                throw new Error(`Ошибка при обработке ответа сервера. Код ошибки: ${error.status}. Текст ошибки: ${error.message}`);
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
                            <div className="buy" onClick={() => addProductToCart()}><i className="material-icons">add_shopping_cart</i></div>
                        </div>
                        <div className="right">
                            <div className="done"><i className="material-icons">done</i></div>
                            <div className="details">
                                <h1>Chair</h1>
                                <p>Added to your cart</p>
                            </div>
                            <div className="remove" onClick={() => removeProductToCart()}><i className="material-icons">clear</i></div>
                        </div>
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