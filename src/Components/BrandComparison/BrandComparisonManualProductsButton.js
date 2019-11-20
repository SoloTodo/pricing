import React from 'react'
import {Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap'
import {NavLink} from "react-router-dom";
import BrandComparisonAddManualProductsButton from "./BrandComparisonAddManualProductsButton";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";
import {toast} from "react-toastify";

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

  handleRemoveProductButton = (product_id) => {
    const endpoint =`${this.props.brandComparison.url}remove_manual_product/?id=${product_id}`;
    this.props.fetchAuth(endpoint).then(json => {
      this.props.handleComparisonChange(json);
      toast.success('Producto removido exitosamente')
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
                  <li key={product.id}><NavLink to={`/products/${product.id}`}>{product.name}</NavLink> <Button color="link" onClick={e => this.handleRemoveProductButton((product.id))}>(quitar)</Button></li>
                )}
              </ul>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <BrandComparisonAddManualProductsButton
            brandComparison={this.props.brandComparison}
            handleComparisonChange={this.props.handleComparisonChange}/>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  return {
    fetchAuth,
  }
}

export default connect(mapStateToProps)(BrandComparisonManualProductsButton);