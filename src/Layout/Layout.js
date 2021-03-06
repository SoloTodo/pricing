import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
} from '@coreui/react';
// routes config
import routes from './routes';

import Aside from './Aside';
import Header from './Header';
import SidebarNav from './SidebarNav'
import Breadcrumbs from '../Components/Breadcrumbs'

class Layout extends React.Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

  signOut(e) {
    e.preventDefault();
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
              <SidebarNav {...this.props}/>
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>
            <main className="main">
              <Breadcrumbs location={this.props.location}/>
              <Container fluid>
                <Switch>
                  {routes.map((route, idx) => {
                    const render = route.render ?
                      route.render :
                      props => <route.component {...props} />;

                    return <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={render}/>
                  })}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Container>
            </main>
            <AppAside fixed>
              <Aside />
            </AppAside>
          </div>
        </div>
    );
  }
}

export default Layout;
