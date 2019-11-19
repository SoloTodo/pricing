import React from 'react'
import {Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap'
import {NavLink} from "react-router-dom";
import BrandComparisonAddManualProductsButton from "./BrandComparisonAddManualProductsButton";

class BrandComparisonManualProductsButton extends React.Component {
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
      <Button color="primary" className="mr-2" onClick={this.toggleProductModal}>Productos manuales</Button>
      <Modal centered id="pending_products" size="lg" isOpen={this.state.productModalIsActive} toggle={this.toggleProductModal}>
        <ModalHeader>Productos manuales</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <ul>
                {this.props.brandComparison.manual_products.map(product =>
                  <li key={product.id}><NavLink to={`/products/${product.id}`}>{product.name}</NavLink></li>
                )}
              </ul>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <BrandComparisonAddManualProductsButton/>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  }
}

export default BrandComparisonManualProductsButton