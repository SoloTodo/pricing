import React from 'react'
import {Modal, ModalHeader, ModalFooter, Button} from "reactstrap";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";
import {toast} from "react-toastify";

class ProductListDeleteButton extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      deleteModalOpen:false
    }
  }

  toggleDeleteModal = e => {
    e && e.preventDefault();
    this.setState({
      deleteModalOpen: !this.state.deleteModalOpen,
    })
  };

  deleteList = () => {
    this.props.fetchAuth(`product_lists/${this.props.productList.id}/`, {
      method: 'DELETE'
    }).then(json => {
      toast.success('Lista de productos eliminada');
      this.props.deleteProductList(this.props.productList.url);
      this.props.onListDelete()
    });
    this.toggleDeleteModal()
  };

  render() {
    return <React.Fragment>
      <Button color="danger" onClick={this.toggleDeleteModal}>Eliminar</Button>
      <Modal centered isOpen={this.state.deleteModalOpen} toggle={this.toggleDeleteModal}>
        <ModalHeader>Confirmar eliminación Lista {this.props.productList.name}</ModalHeader>
        <ModalFooter>
          <Button color="danger" onClick={this.deleteList}>Eliminar</Button>
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
    deleteProductList: url => {
      return dispatch({
        type: 'deleteApiResourceObject',
        url: url
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductListDeleteButton);