import React from 'react'
import {Button} from "reactstrap";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";
import {toast} from "react-toastify";

import {settings} from '../../settings'


class SkuUserAlertButton extends React.Component{
  clickHandler = e => {
    e.preventDefault();

    const formData = JSON.stringify({
      stores: [this.props.entity.store.id],
      product: this.props.entity.product.id
    });

    this.props.fetchAuth(settings.apiResourceEndpoints.alerts, {
      method: 'POST',
      body:formData
    }).then(json => {
      toast.success('Alerta creada exitosamente')
    }).catch(async error => {
      const jsonError = await error.json();
      toast.error(jsonError.non_field_errors[0])
    });
  };

  render() {
    if (this.props.entity.category.permissions.includes('view_category_reports') && this.props.entity.product) {
      return <Button className="btn-success" onClick={this.clickHandler}><i className="fas fa-bell"/> Crear alerta</Button>
    } else {
      return null
    }
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
  }
}

export default connect(mapStateToProps)(SkuUserAlertButton);