import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import './Menu.css';
import './CartMenu.css';

import ProfileSvg from '../../../public/images/icon/profile.svg';

import EditForm from '../../modal/forms/EditForm.jsx';
import ReadForm from '../../modal/forms/ReadForm.jsx';
import RegForm from '../../modal/forms/RegForm.jsx';
import ProductAddForm from '../../modal/forms/ProductAddForm.jsx';
import Modal from '../../modal/Modal.jsx';

import AppContext from '../../../contexts/AppContext.jsx';
import AuthContext from '../../../contexts/AuthContext.jsx';

function CartMenu({ user, handleLogout, updateUserList }) {

    const { isModalOpen, setIsModalOpen, modalContent, setModalContent, setIsMenuOpen, setErrors, updateProductList } = useContext(AppContext);
    const { role } = useContext(AuthContext);



    return (
        <div className="menu cart-menu settings">
            <ul className="menu-list">
                <li className="menu-item">
                    <button disabled className="menu-txt">
                        <span className="second">Моя корзина: "{user.role}"</span>
                        {/* <span className="second">(Вы вошли в систему)</span> */}
                    </button>
                </li>
                <li className="menu-item">


                </li>
            </ul>
            <ul className="menu-list">
                <li className="menu-item ">
                    <button className="clean-card-button">
                        {/* <input className='LogAuth' onClick={handleLogout} type="submit" value="Выйти" /> */}
                        <input className="CleanCard" type="submit" value="Очистить корзину"/>
                    </button>
                </li>
                
            </ul>

        </div>
    )
}

export default CartMenu;
