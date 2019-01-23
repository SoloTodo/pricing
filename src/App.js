import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import {ToastContainer} from "react-toastify";
import {
  createResponsiveStateReducer,
  responsiveStoreEnhancer
} from "redux-responsive";


import {
  apiResourceObjectsReducer,
  authTokenReducer, loadedBundleReducer, loadedResourcesReducer
} from "./react-utils/redux-utils";
import UserLoader from "./react-utils/components/UserLoader";
import RequiredBundle from "./react-utils/components/RequiredBundle";

import UserPermissionFilter from "./User/UserPermissionFilter";
import UserPreferences from "./User/UserPreferences";
import Login from './views/Pages/Login';
import PasswordReset from './views/Pages/PasswordReset'
import PasswordResetConfirm from "./views/Pages/PasswordResetConfirm";

import './App.scss';
import Layout from "./Layout/Layout";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.store = createStore(combineReducers({
      authToken: authTokenReducer,
      apiResourceObjects: apiResourceObjectsReducer,
      loadedResources: loadedResourcesReducer,
      loadedBundle: loadedBundleReducer,
      browser: createResponsiveStateReducer({
        extraSmall: 575,
        small: 767,
        medium: 991,
        large: 1199,
      })
    }), responsiveStoreEnhancer);
  }

  render() {
    return <Provider store={this.store}>
      <ToastContainer
          position="top-right"
          type="default"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
      />
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" name="Login Page"
                 component={Login}/>
          <Route exact path="/account/password_reset" name="Password Reset"
                 component={PasswordReset}/>
          <Route path="/reset" name="Password Reset Confirm" component={PasswordResetConfirm}/>
          <Route path="/" render={props => (
              <UserLoader {...props}>
                <UserPermissionFilter redirectPath="/login">
                  <RequiredBundle
                      resources={['languages', 'currencies', 'countries', 'store_types', 'number_formats']}
                      loading={null}
                  >
                    <UserPreferences>
                      <Layout {...props} />
                    </UserPreferences>
                  </RequiredBundle>
                </UserPermissionFilter>
              </UserLoader>
          )} />
        </Switch>
      </BrowserRouter>
    </Provider>
  }
}

export default App;
