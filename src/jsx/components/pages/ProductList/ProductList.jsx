import React, { useState, useEffect, useCallback, useContext } from 'react';

import ProductCard from './ProductCard.jsx';

import AppContext from '../../../contexts/AppContext.jsx';
import AuthContext from '../../../contexts/AuthContext.jsx';

function ProductList() {

  const { products, updateProductList, searchValue } = useContext(AppContext);
  const { isAuth, role, id } = useContext(AuthContext);

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



  // Логика для получения данных о товарах (например, через API) и их установки в состояние
  /*   useEffect(() => {
      // Пример запроса к API для получения списка товаров
      fetch('/products/all')
        .then(response => response.json())
        .then(data => setProducts(data));
    }, []); */

  return (
    <div className="product-card">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} isAuth={isAuth} role={role} id={id} />
      ))}
    </div>
  );
}

export default ProductList;