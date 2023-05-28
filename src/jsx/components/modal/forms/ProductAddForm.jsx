import React, { useState, useContext } from 'react';

import './form.css';

function ProductAddForm({ closeModal, updateProductList, setErrors }) {

    console.log("ProductAddForm component");
    // console.log("user validation errors in ( ProductAddForm.jsx ) : ", errors);

    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');

    const [errors, setModalErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            productName: productName,
            price: price,
        };

        /* if (typeof jwt === 'undefined') {
            console.error('JWT module is not properly imported.');
            return;
        } */

        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        };
        // проверяем наличие токена в локальном хранилище
        /* if (token) {
            headers.Authorization = token;
        } */

        fetch('/products/submit', {
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
                //setResult(data);
                updateProductList(); // 
                setErrors({}); // Сброс ошибок
                closeModal(); // Закрытие модального окна
            })
            .catch(error => {
                setErrors(error);
                throw new Error(`Ошибка при обработке ответа сервера. Код ошибки: ${error.status}. Текст ошибки: ${error.message}`);
            });


    };

    return (
        // <div className="face face-front">
        <div className="content">
            <h2>Новый товар</h2>
            <form onSubmit={handleSubmit}>
                <div className="field-wrapper">
                    <input type="text" name="productName" placeholder="productName" value={productName} onChange={event => setProductName(event.target.value)} />
                    <label>Наименование:</label>
                    {errors.productName && errors.productName.NotBlank && <div className="error">{errors.productName.NotBlank}</div>}
                    {errors.productName && !errors.productName.NotBlank && <div className="error">{Object.values(errors.productName)[0]}</div>}
                </div>
                <div className="field-wrapper">
                    <input type="text" name="price" placeholder="price" value={price} onChange={event => setPrice(event.target.value)} />
                    <label>Цена:</label>
                    {errors.price && errors.price.NotBlank && <div className="error">{errors.price.NotBlank}</div>}
                    {errors.price && !errors.price.NotBlank && <div className="error">{Object.values(errors.price)[0]}</div>}
                </div>

                <div className="field-wrapper">
                    <input type="submit" value="Добавить" />
                </div>

                {/* </div> */}
            </form>
        </div>
        // </div>
    )
}

export default ProductAddForm;



