import React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Input, Button, Label} from "reactstrap";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";
import {toast} from "react-toastify";

class ProductListRenameButton extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      renameModalOpen:false,
      newName: props.productList.name
    }
  }

  toggleRenameModal = e => {
    e && e.preventDefault();
    this.setState({
      renameModalOpen: !this.state.renameModalOpen,
    })
  };

  inputChangeHandler = e => {
    this.setState({
      newName: e.target.value
    });
  };

  renameList = () => {
    const name = this.state.newName;
    this.props.fetchAuth(`product_lists/${this.props.productList.id}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        name
      })
    }).then(json => {
      toast.success('Nombre cambiado');
      this.props.fetchAuth(`product_lists/${this.props.productList.id}/`).then(json => {
        this.props.addProductList(json)
      });
      this.props.onListRename()
    });
    this.toggleRenameModal()
  };

  render() {
    return <React.Fragment>
      <a href="." onClick={this.toggleRenameModal}><span className="fas fa-pencil-alt text-primary"/></a>
      <Modal centered isOpen={this.state.renameModalOpen}  toggle={this.toggleRenameModal}>
        <ModalHeader>Cambiar Nombre</ModalHeader>
        <ModalBody>
          <Label for="renameList">Nuevo nombre</Label>
          <Input id="renameList" onChange={this.inputChangeHandler} type="text" value={this.state.newName}/>
        </ModalBody>
        <ModalFooter>
          <Button disabled={!Boolean(this.state.newName)} onClick={this.renameList} color="success">Guardar</Button>
          <Button onClick={this.toggleRenameModal} color="danger">Cancelar</Button>
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

function mapDispatchToProps(dispatch) {
  return {
    addProductList: productList => {
      return dispatch({
        type: 'addApiResourceObject',
        apiResource: productList
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductListRenameButton);