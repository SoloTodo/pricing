import React from 'react'
import {connect} from "react-redux";
import { toast } from 'react-toastify';
import {Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input} from 'reactstrap'
import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";

class BrandComparisonAlertsCreateButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alertModalIsActive: false,
      selectedStores: []
    }
  }

  toggleAlertModal = () => {
    this.setState({
      alertModalIsActive: !this.state.alertModalIsActive
    })
  };

  handleCheckBoxChange = id => {
    let selectedStores = [...this.state.selectedStores];

    if (selectedStores.includes(id)) {
      selectedStores = selectedStores.filter(storeId => id !== storeId)
    } else {
      selectedStores.push(id)
    }
    this.setState({
      selectedStores
    })
  };

  handleAlertCreateSubmit = e => {
    e.preventDefault();

    if (!this.state.selectedStores.length) {
      toast.error('Se debe seleccionar al menos 1 tienda');
      return
    }

    this.props.fetchAuth(`brand_comparison_alerts/`, {
      method: 'POST',
      body: JSON.stringify({
        brand_comparison: this.props.brandComparison.id,
        stores: this.state.selectedStores,
      })
    }).then(json => {
      this.props.callback();
      toast.success("Alerta creada exitosamente");
      this.toggleAlertModal();
    })
  };

  render() {
    return <React.Fragment>
      <Button color="success" className="mr-2" onClick={this.toggleAlertModal}>Crear Alerta</Button>
      <Modal centered id="pending_products" size="lg" isOpen={this.state.alertModalIsActive} toggle={this.toggleAlertModal}>
        <ModalHeader>Crear nueva alerta</ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              {this.props.stores.map(store => {
                const checked = this.state.selectedStores.includes(store.id);
                return <Col sm="4" key={store.id}>
                  <Label className="d-flex align-content-center" for={store.name}>
                    {store.name}
                    <Input id={store.name} type="checkbox" checked={checked} onChange={() => this.handleCheckBoxChange(store.id)}/>
                  </Label>
                </Col>
              })}
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter><Button color="success" onClick={this.handleAlertCreateSubmit}>Crear</Button></ModalFooter>
      </Modal>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  return {
    fetchAuth,
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores')
  }
}

export default connect(mapStateToProps)(BrandComparisonAlertsCreateButton);