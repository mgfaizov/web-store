import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import './Menu.css';
import './UserMenu.css';

import ProfileSvg from '../../../public/images/icon/profile.svg';

import EditForm from '../../../components/modal/forms/EditForm.jsx';
import ReadForm from '../../../components/modal/forms/ReadForm.jsx';
import RegForm from '../../../components/modal/forms/RegForm.jsx';
import ProductAddForm from '../../../components/modal/forms/ProductAddForm.jsx';
import Modal from '../../../components/modal/Modal.jsx';

import AppContext from '../../../contexts/AppContext.jsx';
import AuthContext from '../../../contexts/AuthContext.jsx';

function UserMenu({ user, handleLogout, updateUserList }) {

    const { isModalOpen, setIsModalOpen, modalContent, setModalContent, setIsMenuOpen, setErrors, updateProductList } = useContext(AppContext);
    const { role } = useContext(AuthContext);

    const openModal = (type, userId = null) => {
        setIsModalOpen(true);
        setModalContent(
            type === 'read' ? (
                <ReadForm userId={userId} />
            ) : type === 'edit' ? (
                <EditForm closeModal={() => setIsModalOpen(false)} updateUserList={updateUserList} role={role} userId={userId} />
            ) : type === 'reg' ? (
                <RegForm closeModal={() => setIsModalOpen(false)} updateUserList={updateUserList} role={role} />
            ) : type === 'productAdd' ? (
                <ProductAddForm closeModal={() => setIsModalOpen(false)} updateProductList={updateProductList} setErrors={setErrors}  />
            ) : null
            
        );
    };

    return (
        <div className="menu user-menu settings">
            <ul className="menu-list">
                <li className="menu-item">
                    <button disabled className="menu-txt">
                        <span className="second">Учетная запись: "{user.role}"</span>
                        <span className="second">(Вы вошли в систему)</span>
                    </button>
                </li>
                <li className="menu-item">

                    <button className="menu-button">
                        <svg viewBox="0 0 496 512" className="fa">
                            <image href={ProfileSvg} width="500" height="500" alt="profile" />
                        </svg>
                        {user && (
                            <span className="user" onClick={() => { openModal('read', user.id); setIsMenuOpen(false) }}>{(user ? user.firstName + " " + user.lastName : "")}</span>
                        )}
                    </button>
                    <button className="menu-button">
                        {/* <a className="user-link" onClick={() => openModal('read', user.id)} href="#">{user.firstName + " " + user.lastName + " " + user.patronym}</a> */}
                        <span className="" onClick={() => { openModal('edit', user.id); setIsMenuOpen(false) }}>Редактировать мой профиль</span>
                    </button>
                    {role === 'ADMIN' ? (
                        <>
                            <button className="menu-button">
                                <span className="" onClick={() => { openModal('reg', null); setIsMenuOpen(false) }}>Создать нового пользователя</span>
                            </button>
                            <button className="menu-button">
                                <span className="" onClick={() => { openModal('productAdd'); setIsMenuOpen(false) }}>Добавить товар</span>
                            </button>
                            <button className="menu-button">
                                <span className="" onClick={() => { setIsMenuOpen(false) }}>
                                    <Link className="link products-link" to="/products">Список товаров</Link>
                                </span>
                            </button>
                            <button className="menu-button">
                                {/* <a className="user-link" onClick={() => openModal('read', user.id)} href="#">{user.firstName + " " + user.lastName + " " + user.patronym}</a> */}
                                <span className="" onClick={() => { setIsMenuOpen(false) }}>
                                    <Link className="link users-link" to="/users">Список всех пользователей</Link>
                                </span>
                            </button>
                        </>
                    ) : null}
                </li>
            </ul>
            <ul className="menu-list">
                <li className="menu-item ">
                    <button className="log-auth-button">
                        <input className='LogAuth' onClick={handleLogout} type="submit" value="Выйти" />
                    </button>
                </li>
            </ul>
            {isModalOpen && <Modal content={modalContent} closeModal={() => setIsModalOpen(false)} />}
        </div>
    )
}

export default UserMenu;
