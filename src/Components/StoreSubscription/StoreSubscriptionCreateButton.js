import React from 'react'
import {connect} from "react-redux"
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Label} from "reactstrap";
import Select from "react-select"

import {createOptions} from "../../react-utils/form_utils";
import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {pricingStateToPropsUtils} from "../../utils";

class StoreSubscriptionCreateButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createSubscriptionModalOpen: false,
      newSubscriptionStore: undefined,
      newSubscriptionCategories: []
    }
  }

  toggleCreateSubscriptionModal = e => {
    e && e.preventDefault();
    this.setState({
      createSubscriptionModalOpen: !this.state.createSubscriptionModalOpen
    })
  };

  cleanField = () => {
    this.setState({
      newSubscriptionStore: undefined,
      newSubscriptionCategories: []
    })
  };

  storeChangeHandler = e => {
    this.setState({
      newSubscriptionStore: e
    })
  };

  categoriesChangeHandler = e => {
    this.setState({
      newSubscriptionCategories: e
    })
  };

  createSubscription = () => {
    const store = this.state.newSubscriptionStore.value;
    const categories = [];
    for (const category of this.state.newSubscriptionCategories) {
      categories.push(category.value)
    }
    this.props.fetchAuth('store_subscriptions/', {
      method: 'POST',
      body: JSON.stringify({
        store,
        categories
      })
    }).then(json => {
      this.props.callback()
    });

    this.toggleCreateSubscriptionModal()
  };

  render() {
   return <span>
     <Button color="primary" className="ml-3" onClick={this.toggleCreateSubscriptionModal}>Crear</Button>
     <Modal isOpen={this.state.createSubscriptionModalOpen} toggle={this.toggleCreateSubscriptionModal}>
      <ModalHeader>Crear nueva suscripción</ModalHeader>
       <ModalBody>
        <Label for="subscriptionStore">Tienda</Label>
         <Select
           id="subscriptionStore"
           name="store"
           options={createOptions(this.props.stores)}
           value={this.state.newSubscriptionStore}
           isClearable={true}
           onChange={this.storeChangeHandler}/>
         <Label for="subscriptionCategories" className="mt-2">Categorías</Label>
         <Select
          id="subscriptionCategories"
          name="categories"
          options={createOptions(this.props.categories)}
          value={this.state.newSubscriptionCategories}
          onChange={this.categoriesChangeHandler}
          isMulti={true}/>
       </ModalBody>
       <ModalFooter>
         <Button disabled={!Boolean(this.state.newSubscriptionStore) || !Boolean(this.state.newSubscriptionCategories.length)}
                 color="primary" onClick={this.createSubscription}>Crear</Button>
         <Button color="danger" onClick={this.cleanField}>Cancelar</Button>
       </ModalFooter>
     </Modal>
   </span>
 }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  const {user} = pricingStateToPropsUtils(state);

  return {
    user,
    fetchAuth,
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores'),
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories')
  }
}

export default connect(mapStateToProps)(StoreSubscriptionCreateButton)