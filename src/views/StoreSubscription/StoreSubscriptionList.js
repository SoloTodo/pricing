import React from 'react'
import moment from "moment";

class StoreSubscriptionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      storeSubscriptions: undefined,
      endpoint: 'store_subscriptions/'
    }
  }

  subscriptionChangeHandler = () => {
    this.setState({
      endpoint: `store_subscriptions/?_=${new Date().getTime()}`
    })
  };

  handleFormValueChange = formValues => {
    this.setState({
      formValues
    })
  };

  setStoreSubscriptions = json => {
    this.setState({
      storeSubscriptions: json? json.payload: null
    })
  };

  updateEndpoint = () => {
    this.setState({
      endpoint: 'store_subscriptions/?_='+moment().format()
    })
  };

  render() {
    const columns = [
      {
        label: 'Id',
        renderer: storeSubscription => <div>{storeSubscription.id}</div>
      },
      {
        label: 'Tienda',
        renderer: storeSubscription => <div>Nombre Tienda</div>
      }
    ];

    return <div>Hola</div>
  }
}

export default StoreSubscriptionList