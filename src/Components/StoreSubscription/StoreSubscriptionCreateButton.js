import React from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Input} from "reactstrap";
import Select from "react-select"

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

  storeChangeHander = e => {
    this.setState({
      newSubscriptionStore: e
    })
  };

  render() {
   return <span>
     <Button color="primary" className="ml-3" onClick={this.toggleCreateSubscriptionModal}>Crear</Button>
     <Modal isOpen={this.state.createSubscriptionModalOpen} toggle={this.toggleCreateSubscriptionModal}>
      <ModalHeader>Crear nueva suscripción</ModalHeader>
       <ModalBody>

       </ModalBody>
       <ModalFooter>
         <Button disabled={true} color="primary">Crear</Button>
         <Button color="danger" onClick={this.cleanField}>Cancelar</Button>
       </ModalFooter>
     </Modal>
   </span>
 }
}

export default StoreSubscriptionCreateButton