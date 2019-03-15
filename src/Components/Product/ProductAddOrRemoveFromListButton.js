import React from 'react';
import {connect} from "react-redux";
import {
  UncontrolledDropdown, DropdownMenu, DropdownToggle,
  Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label
} from "reactstrap";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {pricingStateToPropsUtils} from "../../utils";
import {toast} from 'react-toastify';


class ProductAddOrRemoveFromListButton extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      createListModalOpen: false,
      newListName: ''
    }
  }

  toggleCreateListModal = e => {
    e && e.preventDefault();
    this.setState({
      createListModalOpen: !this.state.createListModalOpen
    })
  };

  cleanField = () => {
    this.setState({
      newListName: ''
    });

    this.toggleCreateListModal()
  };

  inputChangeHandler = e => {
    this.setState({
      newListName: e.target.value
    })
  };

  createListWithProduct = async (product) => {
    const name = this.state.newListName;
    this.props.fetchAuth('product_lists/', {
      method: 'POST',
      body: JSON.stringify({
        name,
        category: product.category.id
      })
    }).then(json => {
      this.addProductToList(product, json, `Lista ${json.name} con producto creada exitosamente`);
    });

    this.toggleCreateListModal()
  }
  ;

  addProductToList = async (product, productList, successMessage) => {
    try {
      await this.props.fetchAuth(`product_lists/${productList.id}/add_product/`, {
        method: 'POST',
        body: JSON.stringify({
          product: product.id
        })
      })
    } catch(err) {
      const error = await err.json();
      toast.error(error.errors.product[0]);
      return
    }

    try {
      const user = await this.props.fetchAuth('users/me/');
      this.props.updateUser(user);
    } catch(err) {
      toast.error('Usuario Invalido');
      return
    }

    toast.success(successMessage)
  };

  removeProductFromList = async (product, productList) => {
    try {
      await this.props.fetchAuth(`product_lists/${productList.id}/remove_product/`, {
        method: 'POST',
        body: JSON.stringify({
          product: product.id
        })
      })
    } catch (err) {
      const error = await err.json();
      toast.error(error.errors.product[0]);
      return
    }

    try {
      const user = await this.props.fetchAuth('users/me/');
      this.props.updateUser(user);
    } catch(err) {
      toast.error('Usuario Invalido');
      return
    }

    toast.success('Producto removido de ' + productList.name)
  };

  handleListClick = (e, product, productList) => {
    e.preventDefault();
    if (this.productInList(product, productList)) {
      this.removeProductFromList(product, productList)
    } else {
      this.addProductToList(product, productList, 'Producto agregado a ' + productList.name)
    }
  };

  productInList = (product, productList) => {
    return Boolean(productList.entries.filter(entry => entry.product.id === product.id)[0]);
  };

  render() {
    const user = this.props.user;
    const product = this.props.product;
    const productLists = user.product_lists.filter(productList => productList.category === product.category.url);

    return <div>
      <UncontrolledDropdown>
        <DropdownToggle caret color="primary">
          Agregar o remover de lista
        </DropdownToggle>
        <DropdownMenu>
          {productLists.map(productList => (
            <a href="." className="dropdown-item d-flex justify-content-between" onClick={e => this.handleListClick(e, product, productList)} key={productList.id}>
              <span className="mr-3">{productList.name}</span>
              {this.productInList(product, productList)?
                <span className="fas fa-minus text-primary"/> :
                <span className="fas fa-plus text-primary"/>}
            </a>
          ))}
          <a href="." className="dropdown-item" onClick={this.toggleCreateListModal}><em>Agregar a nueva lista</em></a>
        </DropdownMenu>
      </UncontrolledDropdown>
      <Modal isOpen={this.state.createListModalOpen} toggle={this.toggleCreateListModal}>
        <ModalHeader>Crear Lista Nueva</ModalHeader>
        <ModalBody>
          <Label for="listName">Nombre</Label>
          <Input onChange={this.inputChangeHandler} id="listName" type="text"/>
        </ModalBody>
        <ModalFooter>
          <Button disabled={!Boolean(this.state.newListName)} color="primary" onClick={() => this.createListWithProduct(product)}>Crear</Button>
          <Button color="danger" onClick={this.cleanField}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </div>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  const {user} = pricingStateToPropsUtils(state);

  return {
    user,
    fetchAuth,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateUser: user => {
      return dispatch({
        type: 'updateApiResourceObject',
        apiResourceObject: user
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductAddOrRemoveFromListButton);