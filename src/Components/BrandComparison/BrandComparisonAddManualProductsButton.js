import React from 'react'
import {Row, Col, Modal, ModalHeader, ModalBody, Button} from 'reactstrap'

class BrandComparisonAddManualProductsButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productModalIsActive: false
    }
  }

  toggleProductModal = () => {
    this.setState({
      productModalIsActive: !this.state.productModalIsActive
    })
  };

  render() {
    return <React.Fragment>
      <Button color="success" className="mr-2" onClick={this.toggleProductModal}>Agregar producto</Button>
      <Modal centered id="pending_products" size="lg" isOpen={this.state.productModalIsActive} toggle={this.toggleProductModal}>
        <ModalHeader>Agregar nuevo producto</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </React.Fragment>
  }
}

export default BrandComparisonAddManualProductsButton