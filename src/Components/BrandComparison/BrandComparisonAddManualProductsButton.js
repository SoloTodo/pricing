import React from 'react'
import {connect} from "react-redux";
import { toast } from 'react-toastify';
import {Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap'
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class BrandComparisonAddManualProductsButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productModalIsActive: false,
      productChoices: [],
      keywords: '',
      selectedProduct: undefined,
    }
  }

  toggleProductModal = () => {
    this.setState({
      productModalIsActive: !this.state.productModalIsActive
    })
  };

  handleProductSearchSubmit = e => {
    e.preventDefault();
    const endpoint = `${this.props.brandComparison.category.url}products/?page_size=200&search=${encodeURIComponent(this.state.keywords)}`;

    this.props.fetchAuth(endpoint).then(json => {
      const productChoices = json.results;
      const selectedProduct = productChoices.length ? productChoices[0] : undefined

      if (!productChoices.length) {

      }

      this.setState({
        productChoices,
        selectedProduct
      })
    })
  };

  handleProductSelectChange = e => {
    const selectedProduct = this.state.productChoices.filter(product => product.id.toString() === e.target.value)[0];

    this.setState({
      selectedProduct
    })
  };

  handleProductAddSubmit = e => {
    e.preventDefault();

    if (!this.state.selectedProduct) {
      toast.error('Producto no seleccionado');
      return
    }

    const endpoint =`${this.props.brandComparison.url}add_manual_product/?id=${this.state.selectedProduct.id}`;

    this.props.fetchAuth(endpoint).then(json => {
      this.props.handleComparisonChange(json);
      this.toggleProductModal();
      toast.success('Producto agregado exitosamente')
    })
  };

  render() {
    const selectedProductId = this.state.selectedProduct? this.state.selectedProduct.id: '';

    return <React.Fragment>
      <Button color="success" className="mr-2" onClick={this.toggleProductModal}>Agregar producto</Button>
      <Modal centered id="pending_products" size="lg" isOpen={this.state.productModalIsActive} toggle={this.toggleProductModal}>
        <ModalHeader>Agregar nuevo producto</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <form onSubmit={this.handleProductSearchSubmit}>
                <div className="form-group">
                  <input autoComplete="off"
                         type="text"
                         id="search"
                         className="form-control"
                         placeholder="Palabras clave"
                         value={this.state.keywords}
                         onChange={evt => this.setState({keywords: evt.target.value})}/>
                </div>
              </form>
              <form>
                <div className="form-group">
                  <label htmlFor="product">Producto</label>
                  <select size={10}
                          className="form-control"
                          id="product"
                          name="product"
                          required={true}
                          value={selectedProductId} onChange={this.handleProductSelectChange}>
                    {this.state.productChoices.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>
              </form>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter><Button color="success" onClick={this.handleProductAddSubmit}>Agregar</Button></ModalFooter>
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

export default connect(mapStateToProps)(BrandComparisonAddManualProductsButton);