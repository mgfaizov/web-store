import React, { useEffect, useCallback, useContext } from 'react';
import { Switch, Route } from 'react-router-dom';

import './Main.css';

import UserList from '../../components/pages/UserList/UserList.jsx';
import ProductList from '../../components/pages/ProductList/ProductList.jsx';
// import HomePage from '../../components/pages/HomePage.jsx';
// import ProfilePage from '../../components/pages/ProfilePage.jsx';
// import EditProfilePage from '../../components/pages/EditProfilePage.jsx';

import AppContext from '../../contexts/AppContext.jsx';
import AuthContext from '../../contexts/AuthContext.jsx';

function Main() {

    return (
        <main>
            {/* {showUserList ? <UserList /> : null} */}
            <Switch>
                <Route exact path="/" component={ProductList} />
                <Route exact path="/users" component={UserList} />
                <Route exact path="/products" component={ProductList} />
            </Switch>
        </main>
    )
}

export default Main;