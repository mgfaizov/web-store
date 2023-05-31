import React, { useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import './Header.css';
import logoSvg from '../../public/images/logo/logo.svg';
import UserSvg from '../../public/images/icon/user.svg';
import CartSvg from '../../public/images/icon/cart.svg';

import { useClickOutside } from '../../services/utils/useClickOutside.jsx';
// import SearchIcon from "./search-icon.svg";
import RegForm from '../../components/modal/forms/RegForm.jsx';
import AuthForm from '../../components/modal/forms/AuthForm.jsx';
import Modal from '../../components/modal/Modal.jsx';
import UserMenu from '../../components/menu/widget/UserMenu.jsx';
import CartMenu from '../../components/menu/widget/CartMenu.jsx';

import AppContext from '../../contexts/AppContext.jsx';
// import AppProvider from '../../AppProvider.jsx';
import AuthContext from '../../contexts/AuthContext.jsx';
import AuthProvider from '../../AuthProvider.jsx';


function Header() {

    console.log("HeaderComponent");
    const history = useHistory();

    const {
        isModalOpen, setIsModalOpen,
        modalContent, setModalContent,
        isMenuOpen, setIsMenuOpen,
        searchValue, setSearchValue,
        setIsClicked,
        errors, setErrors
    } = useContext(AppContext);

    const { isAuth, setIsAuth, setUser, user, id, setUsers, setId, setRole } = useContext(AuthContext);

    // фильтр ---------------------------------------------------------------------------
    // const [searchValue, setSearchValue] = useState('');
    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        // Дополнительные действия при отправке формы (например, очистка поля ввода)
    };

    // очистить фильтр
    const isSearchValueEmpty = searchValue === '';
    const handleClearSearch = () => {
        setSearchValue('');
    };

    // фильтр ---------------------------------------------------------------------------

    // меню -----------------------------------------------------------------------------

    const toggleMenu = (menu) => {

        setIsMenuOpen(isMenuOpen === menu ? null : menu);

        // setIsMenuOpen(!isMenuOpen);
    };

    const menuRef = useRef(false);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };
    // кастомный хук (слушатель клика вне компонента "menuRef")
    useClickOutside(menuRef, closeMenu);
    // меню -----------------------------------------------------------------------------

    const updateUserId = () => {

        if (id === null) {
            console.error("Header.updateUserId: ID пользователя не определен.");
            return;
        }

        fetch(`/users/${id}`, {
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
            .then(data => {
                setUser(data)
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // Обновление списка пользователей
    const updateUserList = () => {
        fetch('/users/all', {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(async response => {
                // if (!response.ok) {
                /* if (response.status === 401) {
                    throw new Error('Для доступа не хватает прав');
                }
                return response.json(); */
                const responseData = await response.json();
                const message = responseData.message;

                if (response.ok) {
                    console.log("Header.updateUserList.response.OK: ", response);
                    console.log("Header.updateUserList.response.OK: ", message);
                    return responseData;
                } else {
                    if (response.status === 400) {
                        console.error("Header.updateUserList.response.ERROR.400: ", response);
                        console.log("Header.updateUserList.message.ERROR.400: ", message);
                        return responseData;
                    } else if (response.status === 401) {
                        console.error("Header.updateUserList.response.ERROR.401: ", response);
                        console.log("Header.updateUserList.message.ERROR.401: ", message);
                        return responseData;
                    }
                }
            })
            .then(data => {
                setUsers(data);
                // setIsAuth(true);
                // updateUserId();
            })
            .catch(error => {
                console.error(error);
                // openErrorModal(error.message);
            });
        // console.log(localStorage.getItem('token'));
    };

    const handleLogout = () => {
        fetch("/auth/logout", {
            method: "POST",
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(async response => {

                const responseData = await response.json();
                const message = responseData.message;

                if (response.ok) {
                    console.log("Header.logout.response.OK: ", response);
                    console.log("Header.logout.message.OK: ", message);
                    return responseData;
                } else {
                    if (response.status === 400) {
                        console.error("Header.logout.response.ERROR.400: ", response);
                        console.log("Header.logout.message.ERROR.400: ", message);
                        return responseData;
                    } else if (response.status === 500) {
                        console.error("Header.logout.response.ERROR.500: ", response);
                        console.log("Header.logout.message.ERROR.500: ", message);
                        return responseData;
                        // throw new Error('Для доступа не хватает прав');
                        // return response.json();
                    }
                }
            })
            .then(data => {
                localStorage.removeItem('token');
                setIsClicked(false);
                setIsMenuOpen(!isMenuOpen);
                setIsAuth(false);
                setId(null);
                setRole(null);
                setUser({})
                setUsers([]);
                
                // updateUserList();
                history.push('/'); // Перенаправление на главную страницу
            })
            .catch((error) => {
                console.log(error);
                // openErrorModal(error.message);
            });
    };

    const openErrorModal = (errorMessage) => {
        console.log('HeaderComponent.openErrorModal.errorMessage:', errorMessage);
        setIsModalOpen(true);
        setModalContent(
            <div className="error">{errorMessage}</div>
        );
    };

    // Обновляем данные пользователя с сервера.
    // Будет запускаться, пока id не изменится.
    useEffect(() => {
        updateUserId();
    }, [id]);

    // Модальное окно
    const openModal = (type) => {
        setIsModalOpen(true);
        setModalContent(
            type === 'Reg' ? (
                <RegForm closeModal={() => setIsModalOpen(false)} setErrors={setErrors} updateUserList={updateUserList} />
            ) : (
                <AuthForm closeModal={() => setIsModalOpen(false)} setIsAuth={setIsAuth} updateUserList={updateUserList} updateUserId={updateUserId} />
            )
        );
    };

    return (
        <header className="container">
            <div className="company" >
                <svg width="140" height="30" viewBox="0 0 140 30" className="hidden w-full dark:block">
                    <image href={logoSvg} width="140" height="30" alt="logo" />
                </svg>
                {/* <h1 className="company-name">Startup</h1> */}
            </div>
            <div className="search">
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Поиск..." className="search-input"
                        value={searchValue}
                        onChange={handleSearchChange} />
                    {!isSearchValueEmpty && (
                        <span type="button" className="clear-search" onClick={handleClearSearch}>
                            &times;
                        </span>
                    )}
                </form>
            </div>
            <div className="menu-panel" ref={menuRef}>
                {isAuth ? (
                    <>

                        <ul className="menu-panel-list">
                            <li className="menu-panel-item button-group">
                                <button className="control-button" onClick={() => toggleMenu('cart')}>
                                    <svg viewBox="0 0 380 400" className="fa">
                                        <image href={CartSvg} width="380" height="450" alt="cart" />
                                    </svg>
                                </button>
                            </li>
                            <li className="menu-panel-item button-group">
                                <button className="control-button" onClick={() => toggleMenu('user')}>
                                    <svg viewBox="0 0 448 512" className="fa">
                                        <image href={UserSvg} width="450" height="700" alt="user" />
                                    </svg>
                                </button>
                            </li>
                        </ul>
                        {isMenuOpen === 'user' ? (
                            <UserMenu user={user} handleLogout={handleLogout} updateUserList={updateUserList} />
                        ) : isMenuOpen === 'cart' ? (
                            <CartMenu user={user} handleLogout={handleLogout} updateUserList={updateUserList} />
                        ) : null}

                    </>
                ) : (
                    <>
                        <input className='Reg' onClick={() => openModal('Reg')} type="submit" value="Регистрация" />
                        <input className='Auth' onClick={() => openModal('Auth')} type="submit" value="Авторизация" />
                    </>
                )}
            </div>
            {isModalOpen && <Modal content={modalContent} closeModal={() => setIsModalOpen(false)} />}
        </header>
    )
}

export default Header;
