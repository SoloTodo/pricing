import React from 'react'
import {connect} from "react-redux";
import {Container, Row, Col, Input, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";

import {
  apiResourceStateToPropsUtils,
  filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";


class BrandComparisonSelectStoresButton extends React.Component {
  constructor(props) {
    super(props);

    const selectedStores = props.brandComparison.stores.map(store_url =>
      this.props.stores.filter(store => store.url === store_url)[0].id);

    this.state = {
      storeModalIsActive: false,
      selectedStores
    }
  }

  toggleStoreModal = () => {
    this.setState({
      storeModalIsActive: !this.state.storeModalIsActive
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

  saveStoresButtonClickHandler = () => {
    this.props.fetchAuth(`brand_comparisons/${this.props.brandComparison.id}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        stores: this.state.selectedStores
      })
    }).then(json => {
      this.props.addBrandComparison(json);
      this.toggleStoreModal();
    })
  };

  render() {
    return <React.Fragment>
      <Button color="primary" className="mr-2" onClick={this.toggleStoreModal}>Tiendas</Button>
      <Modal centered id="select_stores" isOpen={this.state.storeModalIsActive} toggle={this.toggleStoreModal} size="lg">
        <ModalHeader>Seleccionar Tiendas</ModalHeader>
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
          <Button
            disabled={this.state.selectedStores.length === 0}
            onClick={this.saveStoresButtonClickHandler}
            color="primary">
            Guardar
          </Button>
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
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addBrandComparison: brandComparison => {
      return dispatch({
        type: 'addApiResourceObject',
        apiResource: brandComparison
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandComparisonSelectStoresButton);
