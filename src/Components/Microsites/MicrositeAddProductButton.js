import React from "react";
import { connect } from "react-redux";
import {
    Modal,
    ModalHeader,
    ModalBody,
    Row,
    Col,
    Button,
    ModalFooter
} from "reactstrap";

import { apiResourceStateToPropsUtils } from "../../react-utils/ApiResource";
import { settings } from "../../settings"


class MicrositeAddProductButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productModalIsActive: false,
            productChoices: [],
            keywords: '',
            selectedProduct: undefined
        }
    }

    toggleProductModal = () => {
        this.setState({
            productModalIsActive: !this.state.productModalIsActive
        })
    };

    handleProductSearchSubmit = e => {
        e.preventDefault();
        const endpoint = `${settings.apiResourceEndpoints['products']}browse/?search=${encodeURIComponent(this.state.keywords)}`;

        this.props.fetchAuth(endpoint).then(json => {
            const productChoices = json.results.map(choice => choice.product);
            const selectedProduct = productChoices.length ? productChoices[0] : undefined;

            console.log(productChoices);

            this.setState({
                productChoices,
                selectedProduct
            })
        })
    };

    render() {
        const selectedProductId = this.state.selectedProduct? this.state.selectedProduct.id:'';

        return <React.Fragment>
            <Button color="success" onClick={this.toggleProductModal}>Añadir Producto</Button>
            <Modal centered size="lg" isOpen={this.state.productModalIsActive} toggle={this.toggleProductModal}>
                <ModalHeader>Agregar producto</ModalHeader>
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
                <ModalFooter><Button color="success">Agregar</Button></ModalFooter>
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

export default connect(mapStateToProps)(MicrositeAddProductButton);