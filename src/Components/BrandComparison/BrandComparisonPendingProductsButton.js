import React from 'react'
import Button from "reactstrap/es/Button";
import Modal from "reactstrap/es/Modal";
import ModalHeader from "reactstrap/es/ModalHeader";
import ModalBody from "reactstrap/es/ModalBody";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";

class BrandComparisonPendingProductsButton extends React.Component {
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
    const pendingProducts = {
      'brand1': [],
      'brand2': []
    };

    for (const data of this.props.brand1RowData){
      if (!data.rowIds.length) {
        pendingProducts.brand1.push(data.product.name)
      }
    }
    for (const data of this.props.brand2RowData){
      if (!data.rowIds.length) {
        pendingProducts.brand2.push(data.product.name)
      }
    }

    const pendingProductsCount = pendingProducts.brand1.length+pendingProducts.brand2.length;

    if (!pendingProductsCount){
      return null
    }

    return <React.Fragment>
      <Button color="primary" className="mr-2" onClick={this.toggleProductModal}>{pendingProductsCount} productos pendientes</Button>
      <Modal centered id="pending_products" size="lg" isOpen={this.state.productModalIsActive} toggle={this.toggleProductModal}>
        <ModalHeader>{pendingProductsCount} productos pendientes</ModalHeader>
        <ModalBody>
          <Row>
            <Col sm="6">
              <h4>{this.props.brandComparison.brand_1.name}</h4>
              <ul>
                {pendingProducts.brand1.map(product=>
                  <li key={product}>{product}</li>)}
              </ul>
            </Col>
             <Col sm="6">
               <h4>{this.props.brandComparison.brand_2.name}</h4>
              <ul>
                {pendingProducts.brand2.map(product=>
                  <li key={product}>{product}</li>)}
              </ul>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </React.Fragment>
  }
}

export default BrandComparisonPendingProductsButton