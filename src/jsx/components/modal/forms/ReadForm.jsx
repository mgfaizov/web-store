import React, { useState, useEffect } from 'react';

import './form.css';

function ReadForm({ userId }) {

    const [user, setUser] = useState({});

    // Получаем пользователя с сервера
    // GetUser ------------------------------------------------------------------- //
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

    return (
        <div class="face face-front">
            <div class="content">
                <h2>О пользователе</h2>
                <p>
                    <span className="result-label">&nbsp;&bull; ID: </span>
                    <span className="result-value">{user.id}</span>
                </p>
                <p>
                    <span className="result-label">&nbsp;&bull; Имя: </span>
                    <span className="result-value">{user.firstName}</span>
                </p>
                <p>
                    <span className="result-label">&nbsp;&bull; Фамилия: </span>
                    <span className="result-value">{user.lastName}</span>
                </p>
                <p>
                    <span className="result-label">&nbsp;&bull; Отчество: </span>
                    <span className="result-value">{user.patronym}</span>
                </p>
                <p>
                    <span className="result-label">&nbsp;&bull; Возраст: </span>
                    <span className="result-value">{user.age}</span>
                </p>
                <p>
                    <span className="result-label">&nbsp;&bull; E-mail: </span>
                    <span className="result-value">{user.email}</span>
                </p>
                <p>
                    <span className="result-label">&nbsp;&bull; Телефон: </span>
                    <span className="result-value">{user.phoneNumber}</span>
                </p>
                <p>
                    <span className="result-label">&nbsp;&bull; Роль: </span>
                    <span className="result-value">{user.role}</span>
                </p>
                <p>
                    <span className="result-label">&nbsp;&bull; Статус: </span>
                    <span className="result-value">{user.status}</span>
                </p>
            </div>
        </div>
    )
}

export default ReadForm;