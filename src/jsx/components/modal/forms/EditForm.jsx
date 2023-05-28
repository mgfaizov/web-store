import React, { useState, useEffect } from 'react';

import './form.css';

function EditForm({ closeModal, updateUserList, role, userId }) {

    // GetUser ------------------------------------------------------------------- //
    // Переменная состояния user для хранения пользовательских данных, полученных с сервера, используя перехватчик useState.
    const [user, setUser] = useState({});

    const [errors, setModalErrors] = useState({});

    // создает состояние которые будут хранить значения полей ввода формы
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [patronym, setPatronym] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [userRole, setUserRole] = useState('');
    const [userStatus, setUserStatus] = useState('');
    
    // Загружаем данные пользователя с сервера
    useEffect(() => {
        fetch(`/users/${userId}`, {
            method: "GET",
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Не удалось получить данные пользователя.");
                }
            })
            .then((data) => {
                setUser(data);
                
            })
            .catch((error) => {
                console.log(error);
            });
    }, [userId]);
    // ------------------------------------------------------------------- GetUser //

    // обновляет значения состояний, когда данные пользователя загружаются с сервера. 
    // user является зависимостью, поэтому каждый раз, когда user изменяется, useEffect будет вызываться снова.
    useEffect(() => {
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setPatronym(user.patronym || '');
        setAge(user.age || '');
        setEmail(user.email || '');
        setPhoneNumber(user.phoneNumber || '');
        setUserRole(user.role || '');
        setUserStatus(user.status || '');
    }, [user]);

    const handleSubmit = (event) => {

        event.preventDefault();

        const requestBody = {
            firstName: firstName,
            lastName: lastName,
            patronym: patronym,
            age: age,
            email: email,
            phoneNumber: phoneNumber,
        };

        if (role === 'ADMIN') {
            requestBody.role = userRole;
            requestBody.status = userStatus;
        }

        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };
        // проверяем наличие токена в локальном хранилище
        if (token) {
            headers.Authorization = token;
        }

        fetch(`/users/${userId}`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers
            /* headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            } */
        })
            // .then(response => response.text())
            .then(async response => {
                if (response.ok) {
                    console.log("response.OK: ", response);
                    return response.json(); // преобразуем тело ответа в JSON объект;
                } else {
                    console.error("response.ERROR: ", response);
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
                    setModalErrors(responseErrors);
                    return Promise.reject(response);
}
            })
            .then(data => {
                updateUserList(); // вызов функции обновления списка пользователей
                closeModal(); // Закрытие модального окна
            })
            .catch(error => {
                // setResult(`Ошибка при отправке данных: ${error}`)
            });
        
    };
    
      return (
        <div className="face face-front">
          <div className="content">
            <h2>Редактирование</h2>
            <form onSubmit={handleSubmit}>
                <div class="field-wrapper">
                    <input type="text" name="firstName" value={firstName} onChange={event => setFirstName(event.target.value)} />
                    <label htmlFor="firstName">Имя</label>
                    {errors.firstName && errors.firstName.NotBlank && <div className="error">{errors.firstName.NotBlank}</div>}
                    {errors.firstName && !errors.firstName.NotBlank && <div className="error">{Object.values(errors.firstName)[0]}</div>}
                </div>
                <div class="field-wrapper">
                    <input type="text" name="lastName" value={lastName} onChange={event => setLastName(event.target.value)} />
                    <label htmlFor="lastName">Фамилия</label>
                    {errors.lastName && errors.lastName.NotBlank && <div className="error">{errors.lastName.NotBlank}</div>}
                    {errors.lastName && !errors.lastName.NotBlank && <div className="error">{Object.values(errors.lastName)[0]}</div>}
                </div>
                <div class="field-wrapper">
                    <input type="text" name="patronym" value={patronym} onChange={event => setPatronym(event.target.value)} />
                    <label htmlFor="patronym">Отчество</label>
                    {errors.patronym && errors.patronym.NotBlank && <div className="error">{errors.patronym.NotBlank}</div>}
                    {errors.patronym && !errors.patronym.NotBlank && <div className="error">{Object.values(errors.patronym)[0]}</div>}
                </div>
                <div class="field-wrapper">
                    <input type="text" name="age" value={age} onChange={event => setAge(event.target.value)} />
                    <label htmlFor="age">Возраст</label>
                    {errors.age && errors.age.NotBlank && <div className="error">{errors.age.NotBlank}</div>}
                    {errors.age && !errors.age.NotBlank && <div className="error">{Object.values(errors.age)[0]}</div>}
                </div>
                <div class="field-wrapper">
                    <input type="text" name="email" value={email} onChange={event => setEmail(event.target.value)} />
                    <label htmlFor="email">E-mail</label>
                    {errors.email && errors.email.NotBlank && <div className="error">{errors.email.NotBlank}</div>}
                    {errors.email && !errors.email.NotBlank && <div className="error">{Object.values(errors.email)[0]}</div>}
                </div>
                <div class="field-wrapper">
                    <input type="text" name="phoneNumber" value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)} />
                    <label htmlFor="phoneNumber">Телефон</label>
                    {errors.phoneNumber && errors.phoneNumber.NotBlank && <div className="error">{errors.phoneNumber.NotBlank}</div>}
                    {errors.phoneNumber && !errors.phoneNumber.NotBlank && <div className="error">{Object.values(errors.phoneNumber)[0]}</div>}
                </div>
                {role === 'ADMIN' ? (
                    <>
                        <div className="field-wrapper">
                            <div className="select">
                                <label className="select-label">Роль:</label>
                                <select name="userRole" value={userRole} onChange={event => setUserRole(event.target.value)}>
                                    <option value="USER">Пользователь</option>
                                    <option value="ADMIN">Администратор</option>
                                </select>
                                <span class="focus"></span>
                            </div>
                        </div>
                        <div className="field-wrapper">
                            <div className="select">
                                <label className="select-label">Статус:</label>
                                <select name="userStatus" value={userStatus} onChange={event => setUserStatus(event.target.value)}>
                                    <option value="ACTIVE">Активен</option>
                                    <option value="INACTIVE">Неактивен</option>
                                </select>
                            </div>
                        </div>
                    </>
                ) : null}
                <div class="field-wrapper">
                    <input type="submit" value="Обновить" />
                </div>
            </form>
          </div>
        </div>
      );
}

export default EditForm;