import React, { useState, useEffect, useCallback, useContext } from 'react';

import ProductCard from './ProductCard.jsx';

import AppContext from '../../../contexts/AppContext.jsx';
import AuthContext from '../../../contexts/AuthContext.jsx';

function ProductList() {

    const { products, updateProductList, searchValue, isClicked, setIsClicked } = useContext(AppContext);
    const { isAuth, role, id } = useContext(AuthContext);

    // const [isClicked, setIsClicked] = useState(false);

    // фильтр -----------------------------------------------------------------------
    const [filteredProducts, setFilteredProducts] = useState([]);
    useEffect(() => {
        const filtered = products.filter((product) =>
            product.productName.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [products, searchValue]);
    // фильтр -----------------------------------------------------------------------

    // Загружаем данные пользователя с сервера
    useEffect(() => {
        updateProductList();
    }, [updateProductList]);



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
                    const clickedProducts = {};
                    // Проверить каждый товар в корзине
                    cartItems.forEach((cartItem) => {
                        const { product, user } = cartItem;
                        filteredProducts.forEach((filteredProduct) => {
                            if (filteredProduct.id === product.id && user.id === id) {
                                clickedProducts[filteredProduct.id] = true;
                                // setIsClicked(true);

                            }
                        });
                    });
                    // setIsClicked(true);
                    setIsClicked(clickedProducts);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [isAuth, filteredProducts, id]);

    return (
        <div className="product-card">
            {filteredProducts.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    isAuth={isAuth}
                    role={role}
                    id={id}
                    isClicked={isClicked?.[product.id] ?? false}
                    // isClicked={isClicked && isClicked.hasOwnProperty(product.id) ? isClicked[product.id] : false}
                    // isClicked={isClicked[product.id] || false}
                    // setIsClicked={setIsClicked} 
                    setIsClicked={(value) => {
                        setIsClicked((prev) => ({
                            ...prev,
                            [product.id]: value
                        }));
                    }}

                />
            ))}
        </div>
    );
}

export default ProductList;