import React from 'react';
import Modal from "reactstrap/es/Modal";
import ModalHeader from "reactstrap/es/ModalHeader";
import ModalBody from "reactstrap/es/ModalBody";
import Input from "reactstrap/es/Input";
import ModalFooter from "reactstrap/es/ModalFooter";
import {Button, Label} from "reactstrap";
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
      this.props.onListRename()
    });
    this.toggleRenameModal()
  };

  render() {
    return <React.Fragment>
      <a href="." onClick={this.toggleRenameModal} className="fas fa-pencil-alt text-primary"/>
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

export default connect(mapStateToProps)(ProductListRenameButton);