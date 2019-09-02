import React from 'react'
import {Button} from "reactstrap";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";
import {toast} from "react-toastify";

class StoreSubscriptionDeleteButton extends React.Component {
  deleteSubscription = () => {
    this.props.fetchAuth(`store_subscriptions/${this.props.subscription.id}/`, {
      method: 'DELETE'
    }).then(json => {
      toast.success('Suscripción a tienda eliminada');
      this.props.onSubscriptionDelete()
    })
  };

  render() {
    return <Button color="danger" onClick={this.deleteSubscription}>Eliminar</Button>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
  }
}

export default connect(mapStateToProps)(StoreSubscriptionDeleteButton);