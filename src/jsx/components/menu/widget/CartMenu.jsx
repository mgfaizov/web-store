import React, { useContext, useState, useEffect } from 'react';

import './Menu.css';
import './CartMenu.css';

import AuthContext from '../../../contexts/AuthContext.jsx';
import AppContext from '../../../contexts/AppContext.jsx';

function CartMenu({ user }) {

    const { isAuth, id } = useContext(AuthContext);
    const { products, updateProductList, searchValue, isClicked, setIsClicked } = useContext(AppContext);

    const [cartItems, setCartItems] = useState([]);


    const clearCartItems = () => {
        fetch('/cart/all', {
            method: "DELETE",
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then((response) => {
                if (response.ok) {
                    setCartItems([]); // Очистить массив товаров в корзине
                    setIsClicked(false);
                } else {
                    throw new Error("Failed to clear cart items.");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        // Проверить наличие товара в корзине для авторизованного пользователя
        if (isAuth) {
            fetch(`/cart/all`, {
                method: "GET",
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Failed to fetch cart data.");
                    }
                })
                .then((cartItems) => {
                    setCartItems(cartItems);
                    
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [isAuth]);

    // Вычисление общей суммы товаров в корзине
    // const totalPrice = cartItems.reduce((total, cartItem) => total + cartItem.product.price, 0);
    const totalPrice = cartItems.reduce((total, cartItem) => {
        if (cartItem.user.id === id) {
            return total + cartItem.product.price;
        }
        return total;
    }, 0);

    return (
        <div className="menu cart-menu settings">
            <ul className="menu-list">
                <li className="menu-item">
                    <button disabled className="menu-txt">
                        <span className="second">Моя корзина: "{user.role}"</span>
                    </button>
                </li>
                <li className="menu-item">

                    {cartItems.map((cartItem) => {
                        if (cartItem.user.id === id) {
                            return (
                                <button disabled className="menu-button">
                                    <span key={cartItem.product.id} className="second">{cartItem.product.productName + " " + cartItem.product.price + " руб."}</span>
                                </button>
                            );
                        }
                        return null;
                    })}

                </li>
                {totalPrice > 0 && (
                    <li className="menu-item">
                        <button disabled className="menu-txt">
                            <span className="second total-price">Сумма: {totalPrice} руб.</span>
                        </button>
                    </li>
                )}
            </ul>
            <ul className="menu-list">
                <li className="menu-item ">
                    <button className="clean-card-button" onClick={clearCartItems}>
                        <input className="CleanCard" type="submit" value="Очистить корзину" />
                    </button>
                </li>

            </ul>

        </div>
    )
}

export default CartMenu;
