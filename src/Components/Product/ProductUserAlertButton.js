import React from 'react'
import {connect} from "react-redux";
import {toast} from "react-toastify";
import {Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col, Button, Input, Label} from "reactstrap";

import {settings} from '../../settings'
import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";


class ProductUserAlertButton extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      storeModalIsActive: false,
      selectedStores: []
    };
  }

  componentDidMount() {
    const selectedStores = this.props.stores.map(store => store.id);
    this.setState({
      selectedStores
    });
  }

  toggleStoreModal = () => {
    this.setState({
      storeModalIsActive: !this.state.storeModalIsActive
    })
  };

  selectAllStores = () => {
    const selectedStores = this.props.stores.map(store => store.id);

    this.setState({
      selectedStores
    })
  };

  deselectAllStores = () => {
    this.setState({
      selectedStores: []
    })
  };

  handleCreateButtonClick = () => {
    const formData = JSON.stringify({
      stores: this.state.selectedStores,
      product: this.props.product.id
    });

    this.props.fetchAuth(settings.apiResourceEndpoints.alerts, {
      method: 'POST',
      body:formData
    }).then(json => {
      toast.success('Alerta creada exitosamente')
    }).catch(async error => {
      const jsonError = await error.json();
      toast.error(Object.values(jsonError)[0][0])
    });

    this.toggleStoreModal();
  };

  handleCheckBoxChange = id => {
    let selectedStores = [...this.state.selectedStores];

    if (selectedStores.includes(id)) {
      selectedStores = selectedStores.filter(store_id => id !== store_id)
    } else {
      selectedStores.push(id)
    }
    this.setState({
      selectedStores
    })
  };

  render() {
    return <React.Fragment>
      <Button className="btn-success" onClick={this.toggleStoreModal}><i className="fas fa-bell"/> Crear alerta</Button>
      <Modal centered id="select_stores" isOpen={this.state.storeModalIsActive} toggle={this.toggleStoreModal} size="lg">
        <ModalHeader>
          Seleccionar Tiendas
          <div className="mt-2">
            <Button color="primary" onClick={this.selectAllStores}>Todas</Button>
            <Button color="primary" className="ml-1" onClick={this.deselectAllStores}>Ninguna</Button>
          </div>
        </ModalHeader>
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
        <ModalFooter>
          <Button disabled={this.state.selectedStores.length === 0} color="primary" onClick={this.handleCreateButtonClick}><i className="fas fa-bell"/> Crear alerta</Button>
          <Button color="danger" onClick={this.toggleStoreModal}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores').filter(store => store.permissions.includes('view_store_reports')),
  }
}

export default connect(mapStateToProps)(ProductUserAlertButton);