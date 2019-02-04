import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import { DropdownItem, DropdownMenu, DropdownToggle, Nav } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../logo.svg'
import sygnet from '../logo.svg'
import {fetchJson} from "../react-utils/utils";
import {pricingStateToPropsUtils} from "../utils";
import {Link} from "react-router-dom";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class Header extends Component {

  handleLogout = e => {
    e.preventDefault();

    fetchJson('rest-auth/logout/', {
      method: 'POST'
    }).then(() => {
      this.props.deleteAuthToken();
    })
  };

  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 120, height: 26, alt: 'SoloTodo Pricing' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        {/*<Nav className="d-md-down-none" navbar>*/}
          {/*<NavItem className="px-3">*/}
            {/*<NavLink href="/">Dashboard</NavLink>*/}
          {/*</NavItem>*/}
          {/*<NavItem className="px-3">*/}
            {/*<Link to="/users">Users</Link>*/}
          {/*</NavItem>*/}
          {/*<NavItem className="px-3">*/}
            {/*<NavLink href="#">Settings</NavLink>*/}
          {/*</NavItem>*/}
        {/*</Nav>*/}
        <Nav className="ml-auto" navbar>
          {/*<NavItem className="d-md-down-none">*/}
            {/*<NavLink href="#"><i className="icon-bell"/><Badge pill color="danger">5</Badge></NavLink>*/}
          {/*</NavItem>*/}
          {/*<NavItem className="d-md-down-none">*/}
            {/*<NavLink href="#"><i className="icon-list"/></NavLink>*/}
          {/*</NavItem>*/}
          {/*<NavItem className="d-md-down-none">*/}
            {/*<NavLink href="#"><i className="icon-location-pin"/></NavLink>*/}
          {/*</NavItem>*/}
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <span>{this.props.user.first_name} {this.props.user.last_name}</span>
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center"><strong>Cuenta</strong></DropdownItem>
              <DropdownItem><Link to="/account/password_change" className="nav-link">Cambiar Contraseña</Link></DropdownItem>
              <DropdownItem onClick={this.handleLogout}><i className="fa fa-lock"/>Cerrar Sesión</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        <AppAsideToggler className="d-md-down-none" />
      </React.Fragment>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

function mapStateToProps(state){
  const {user} = pricingStateToPropsUtils(state);
  return {
    user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    deleteAuthToken: () => {
      dispatch({
        type: 'setAuthToken',
        authToken: null
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
