import React from 'react'
import {Row, Col, Modal, ModalHeader, ModalBody, Button} from 'reactstrap'
import {NavLink} from "react-router-dom";

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

    const brand1 = this.props.brandComparison['brand_1'];
    const brand2 = this.props.brandComparison['brand_2'];

    for (const data of this.props.brand1RowData){
      if (!data.rowIds.length) {
        if (data.product.brand === brand1.url) {
          pendingProducts.brand1.push(data.product)
        }
      }
    }
    for (const data of this.props.brand2RowData){
      if (!data.rowIds.length) {
        if (data.product.brand === brand2.url) {
          pendingProducts.brand2.push(data.product)
        }
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
                  <li key={product.id}><NavLink to={`/products/${product.id}`}>{product.name}</NavLink></li>)}
              </ul>
            </Col>
             <Col sm="6">
               <h4>{this.props.brandComparison.brand_2.name}</h4>
              <ul>
                {pendingProducts.brand2.map(product=>
                  <li key={product.id}><NavLink to={`/products/${product.id}`}>{product.name}</NavLink></li>)}
              </ul>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </React.Fragment>
  }
}

export default BrandComparisonPendingProductsButton