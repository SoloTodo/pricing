import React, {Component} from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify';
import {settings} from "../settings";

class UserPermissionFilter extends Component {
  render() {
    if (!this.props.authToken) {
      toast.info("Por favor ingrese su nombre de usuario y contraseña para acceder a esta página");

      return <Redirect to={{
        pathname: '/login'
      }}/>
    }

    if (!this.props.user) {
      // Permissions haven't been set yet (waiting for fetch user), standby
      return null
    }

    if (this.props.requiredPermission && !this.props.user.permissions.includes(this.props.requiredPermission)) {
      toast.error("No tiene los permisos necesarios para acceder a esta página");

      return <Redirect to={{
        pathname: '/'
      }}/>
    }

    return <React.Fragment>
      {this.props.children}
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  return {
    authToken: state.authToken,
    user: state.apiResourceObjects[settings.ownUserUrl]
  }
}


export default connect(mapStateToProps)(UserPermissionFilter)