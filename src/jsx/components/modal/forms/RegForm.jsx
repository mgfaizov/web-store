import React, { useState, useContext } from 'react';

import './form.css';

// import AuthContext from '../../../contexts/AuthContext.jsx';
// import AppContext from '../../../contexts/AppContext.jsx';

function RegForm({ closeModal, setErrors, updateUserList, role }) {

    console.log("RegForm component");
    // console.log("user validation errors in ( RegForm.jsx ) : ", errors);

    // const { role } = useContext(AuthContext);
    // const { setErrors } = useContext(AppContext);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [patronym, setPatronym] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');

    const [userRole, setUserRole] = useState('');
    const [userStatus, setUserStatus] = useState('');

    const [errors, setModalErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            firstName: firstName,
            lastName: lastName,
            patronym: patronym,
            age: age,
            email: email,
            phoneNumber: phoneNumber,
            password: password,
        };

        if (role === 'ADMIN') {
            data.role = userRole;
            data.status = userStatus;
        }

        /* if (typeof jwt === 'undefined') {
            console.error('JWT module is not properly imported.');
            return;
        } */

        fetch('/users/submit', {
            method: 'POST',
            body: JSON.stringify(data),
            // body: formData,
            headers: {
                'Content-Type': 'application/json'
            }
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
                setErrors({}); // Сброс ошибок
                updateUserList(); // вызов функции обновления списка пользователей
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
            <h2>Новый пользователь</h2>
            <form onSubmit={handleSubmit}>
                <div className="field-wrapper">
                    <input type="text" name="firstName" placeholder="firstName" value={firstName} onChange={event => setFirstName(event.target.value)} />
                    <label>Имя:</label>
                    {errors.firstName && errors.firstName.NotBlank && <div className="error">{errors.firstName.NotBlank}</div>}
                    {errors.firstName && !errors.firstName.NotBlank && <div className="error">{Object.values(errors.firstName)[0]}</div>}
                </div>
                <div className="field-wrapper">
                    <input type="text" name="lastName" placeholder="lastName" value={lastName} onChange={event => setLastName(event.target.value)} />
                    <label>Фамилия:</label>
                    {errors.lastName && errors.lastName.NotBlank && <div className="error">{errors.lastName.NotBlank}</div>}
                    {errors.lastName && !errors.lastName.NotBlank && <div className="error">{Object.values(errors.lastName)[0]}</div>}
                </div>
                <div className="field-wrapper">
                    <input type="text" name="patronym" placeholder="patronym" value={patronym} onChange={event => setPatronym(event.target.value)} />
                    <label>Отчество:</label>
                    {errors.patronym && errors.patronym.NotBlank && <div className="error">{errors.patronym.NotBlank}</div>}
                    {errors.patronym && !errors.patronym.NotBlank && <div className="error">{Object.values(errors.patronym)[0]}</div>}
                </div>
                <div className="field-wrapper">
                    <input type="text" name="age" placeholder="age" value={age} onChange={event => setAge(event.target.value)} />
                    <label>Возраст:</label>
                    {errors.age && errors.age.NotBlank && <div className="error">{errors.age.NotBlank}</div>}
                    {errors.age && !errors.age.NotBlank && <div className="error">{Object.values(errors.age)[0]}</div>}
                </div>
                <div className="field-wrapper">
                    <input type="text" name="email" placeholder="email" value={email} onChange={event => setEmail(event.target.value)} />
                    <label>E-mail:</label>
                    {errors.email && errors.email.NotBlank && <div className="error">{errors.email.NotBlank}</div>}
                    {errors.email && !errors.email.NotBlank && <div className="error">{Object.values(errors.email)[0]}</div>}
                </div>
                <div className="field-wrapper">
                    <input type="text" name="phoneNumber" placeholder="phonenumber" value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)} />
                    <label>Телефон:</label>
                    {errors.phoneNumber && errors.phoneNumber.NotBlank && <div className="error">{errors.phoneNumber.NotBlank}</div>}
                    {errors.phoneNumber && !errors.phoneNumber.NotBlank && <div className="error">{Object.values(errors.phoneNumber)[0]}</div>}
                </div>
                <div className="field-wrapper">
                    <input type="text" name="password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)} />
                    <label>Пароль:</label>
                    {errors.password && errors.password.NotBlank && <div className="error">{errors.password.NotBlank}</div>}
                    {errors.password && !errors.password.NotBlank && <div className="error">{Object.values(errors.password)[0]}</div>}
                </div>
                {/* <div className="field-wrapper"> */}
                {role === 'ADMIN' ? (
                    <>
                        <div className="field-wrapper">

                            <label className="select-label">Роль:</label>
                            <select name="userRole" value={userRole} onChange={event => setUserRole(event.target.value)}>
                                <option value="USER">Пользователь</option>
                                <option value="ADMIN">Администратор</option>
                            </select>

                        </div>
                        <div className="field-wrapper">
                            <label className="select-label">Статус:</label>
                            <select name="userStatus" value={userStatus} onChange={event => setUserStatus(event.target.value)}>
                                <option value="ACTIVE">Активен</option>
                                <option value="INACTIVE">Неактивен</option>
                            </select>

                        </div>
                    </>
                ) : null}

                <div className="field-wrapper">
                    <input type="submit" value="Добавить" />
                </div>

                {/* </div> */}
            </form>
        </div>
        // </div>
    )
}

export default RegForm;


