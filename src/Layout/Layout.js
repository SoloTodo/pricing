import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
} from '@coreui/react';
// sidebar nav config
import navigation from './_nav';
// routes config
import routes from './routes';

import Aside from './Aside';
import Footer from './Footer';
import Header from './Header';
import SidebarNav from './SidebarNav'

class Layout extends React.Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

  signOut(e) {
    e.preventDefault()
    this.props.history.push('/login')
  }

  render() {
    return (
        <div className="app">
          <AppHeader fixed>
            <Header onLogout={e=>this.signOut(e)}/>
          </AppHeader>
          <div className="app-body">
            <AppSidebar fixed display="lg">
              <AppSidebarHeader />
              <AppSidebarForm />
              <SidebarNav navConfig={navigation} />
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>
            <main className="main">
              <AppBreadcrumb appRoutes={routes}/>
              <Container fluid>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                        <Route
                            key={idx}
                            path={route.path}
                            exact={route.exact}
                            name={route.name}
                            render={props => (
                                <route.component {...props} />
                            )}/>) : (null);
                  })}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Container>
            </main>
            <AppAside fixed>
              <Aside />
            </AppAside>
          </div>
          <AppFooter>
            <Footer />
          </AppFooter>
        </div>
    );
  }
}

export default Layout;
