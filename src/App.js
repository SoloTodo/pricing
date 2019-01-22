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

import UserPermissionFilter from "./Auth/UserPermissionFilter";
import Login from './views/Pages/Login';

import './App.scss';


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
          <Route path="/" render={props => (
              <UserLoader {...props}>
                <UserPermissionFilter redirectPath="/login">
                  <RequiredBundle
                      resources={['languages', 'currencies', 'countries', 'store_types', 'number_formats']}
                      loading={null}
                  >
                    {/*<UserPreferences>*/}
                      {/*<Full location={props.location}/>*/}
                    {/*</UserPreferences>*/}
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
