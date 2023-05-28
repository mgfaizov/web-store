import React, { useEffect, useCallback, useContext } from 'react';

import './UserList.css';

import EditForm from '../../../components/modal/forms/EditForm.jsx';
import ReadForm from '../../../components/modal/forms/ReadForm.jsx';
import Modal from '../../../components/modal/Modal.jsx';

import AppContext from '../../../contexts/AppContext.jsx';
import AuthContext from '../../../contexts/AuthContext.jsx';

function UserList() {

    const { isModalOpen, setIsModalOpen, modalContent, setModalContent } = useContext(AppContext);
    const { setUsers, role, users } = useContext(AuthContext);

    const openErrorModal = (errorMessage) => {
        console.log('MainComponent.openErrorModal.errorMessage:', errorMessage);
        setIsModalOpen(true);
        setModalContent(
            <div className="error">{errorMessage}</div>
        );
    };

    const openModal = (type, userId = null) => {
        setIsModalOpen(true);
        setModalContent(
            type === 'read' ? (
                <ReadForm userId={userId} />
            ) : /* type === 'edit' ? */ (
                <EditForm closeModal={() => setIsModalOpen(false)} updateUserList={updateUserList} role={role} userId={userId} />
            )
        );
    };

    // Обновление списка пользователей
    // Чтобы этот список не стал причиной бесконечного цикла вызовов useEffect, оберачиваем его в useCallback
    const updateUserList = useCallback(() => {

        // 
        const token = localStorage.getItem('token');
        const headers = {};
        // проверяем наличие токена в локальном хранилище
        if (token) {
            headers.Authorization = token;
        }

        fetch('/users/all', {
            method: 'GET',
            headers
            // headers: {
            //     'Authorization': localStorage.getItem('token')
            // }
        })
            .then(async response => {
                
                const responseData = await response.json();
                const message = responseData.message;

                if (response.ok) {
                    console.log("AuthProfile.response.OK: ", response);
                    console.log("AuthProfile.response.OK: ", message);
                    return responseData;
                } else {
                    if (response.status === 400) {
                        console.error("AuthProfile.response.ERROR.400: ", response);
                        console.log("AuthProfile.message.ERROR.400: ", message);
                        return responseData;
                    } else if (response.status === 401) {
                        console.error("AuthProfile.response.ERROR.401: ", response);
                        console.log("AuthProfile.message.ERROR.401: ", message);
                        return responseData;
                        // throw new Error('Для доступа не хватает прав');
                        // return response.json();
                    }
                }
            })
            .then(data => setUsers(data))
            .catch((error) => {
                console.log(error);
                openErrorModal(error.message);
            });
    }, [setUsers]);

    // Загружаем данные пользователя с сервера
    useEffect(() => {
        updateUserList();
    }, [updateUserList]);

    // deleteUser ------------------------------------------------------------------- //
    const deleteUser = (id) => {
        fetch(`/users/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then((response) => {
                if (response.ok) {
                    // Обновляем список пользователей
                    updateUserList();
                } else {
                    throw new Error("Failed to delete user.");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    // ------------------------------------------------------------------- deleteUser //

    return (
        <>
            <div className='user-list'>
                {/*  <div className="menu-widget">
                    <h1>User List</h1>
                    <input type="submit" onClick={() => showModal('new')} value="Добавить пользователя" />
                </div> */}
                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users && users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>
                                        <a className="user-link" onClick={() => openModal('read', user.id)} href="#">{user.firstName + " " + user.lastName + " " + user.patronym}</a>
                                        <p className="edit-button" onClick={() => openModal('edit', user.id)}>Редактировать</p>
                                        <span className="delete" onClick={() => deleteUser(user.id)}>&times;</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <Modal content={modalContent} closeModal={() => setIsModalOpen(false)} />}
        </>
    )
}

export default UserList;