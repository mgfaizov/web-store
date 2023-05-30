import React, { useState, useContext, useEffect } from 'react';

import './form.css';

// import AppContext from '../../../contexts/AppContext.jsx';
// import AuthContext from '../../../contexts/AuthContext.jsx';

function AuthForm({ closeModal, setIsAuth, updateUserList, updateUserId }) {

    // console.log("user validation errors in ( NewProfile.jsx ) : ", errors);

    // получение функции из контекста
    // const { errors, setErrors, errorServer, setErrorServer } = useContext(AppContext);
    // const { setIsAuth } = useContext(AuthContext);

    const [errors, setErrors] = useState('');
    const [errorServer, setErrorServer] = useState({});

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            email: email,
            password: password,
        };

        fetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
            // body: formData,
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(async response => {
                const responseData = await response.json();
                const message = responseData.message;
                // авторизация прошла успешно
                if (response.ok) {
                    console.log("AuthForm.response.OK: ", response);
                    // const responseData = await response.json();
                    // const message = responseData.message;
                    console.log("AuthForm.message.OK: ", message);
                    // преобразуем тело ответа в JSON объект
                    return responseData;
                    // return response.json() 
                } else {

                    if (response.status === 400) {
                        console.error("AuthForm.response.ERROR.400: ", response);
                        console.log("AuthForm.message.ERROR.400: ", message);
                        // сохраняем ошибки в объект
                        const responseErrors = {};
                        // преобразуем тело ответа в JSON объект
                        // const responseData = await response.json();
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
                        setErrorServer(responseErrors);
                        return Promise.reject(response);
                        // throw new Error(JSON.stringify(responseErrors));
                    } else if (response.status === 401) {
                        console.error("AuthForm.response.ERROR.401: ", response);
                        console.log("AuthForm.message.ERROR.401: ", message);
                        setErrors(message);
                        // throw new Error('Для доступа не хватает прав');
                    }

                }
            })
            .then(data => {
                // const token = data.token;
                // сохраняем токен в localStorage
                localStorage.setItem('token', data.token);
                // Проверяем токен в localStorage
                /* const token = localStorage.getItem('token');
                console.log(token);  */
                setIsAuth(true); // вызов функции setIsAuth из контекста
                
                /* if (id === null) {
                    console.error("AuthForm.handleSubmit: ID пользователя не определен.");
                    return;
                } */

                updateUserId();
                updateUserList(); // обновить список пользователей
                setErrors(''); // Сброс ошибок
                setErrorServer({});
                closeModal(); // Закрытие модального окна
                // return data;
            })
            .catch(error => {
                // setErrors(error.toString());
                throw new Error(`Ошибка при обработке ответа сервера. Код ошибки: ${error.status}. Текст ошибки: ${error.message}`);
            });

    };

    return (
        // <div className="face face-front">
        <div className="content">
            <h2>Вход в аккаунт</h2>
            <form onSubmit={handleSubmit}>

                <div className="field-wrapper">
                    <input type="text" name="email" placeholder="email" value={email} onChange={event => setEmail(event.target.value)} />
                    <label>E-mail:</label>
                    {errorServer.email && errorServer.email.NotBlank && <div className="error">{errorServer.email.NotBlank}</div>}
                    {errorServer.email && !errorServer.email.NotBlank && <div className="error">{Object.values(errorServer.email)[0]}</div>}
                </div>

                <div className="field-wrapper">
                    <input type="text" name="password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)} />
                    <label>Пароль:</label>
                    {errorServer.password && errorServer.password.NotBlank && <div className="error">{errorServer.password.NotBlank}</div>}
                    {errorServer.password && !errorServer.password.NotBlank && <div className="error">{Object.values(errorServer.password)[0]}</div>}
                </div>
                <div className="field-wrapper">
                    {<div className="error">{errors}</div>}
                </div>
                <div className="field-wrapper">
                    <input type="submit" value="Войти" />
                </div>
            </form>
        </div>
        // </div>
    )
}

export default AuthForm;


