import React from 'react'
import {Button} from "reactstrap";
import {toast} from "react-toastify";
import {Modal, ModalHeader, ModalFooter} from "reactstrap";
import {connect} from "react-redux";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class BrandComparisonDeleteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModalOpen: false
    }
  }

  toggleDeleteModal = e => {
    e && e.preventDefault();
    this.setState({
      deleteModalOpen: !this.state.deleteModalOpen,
    })
  };

  deleteComparison = () => {
    this.props.fetchAuth(`brand_comparisons/${this.props.brandComparison.id}/`, {
      method: 'DELETE'
    }).then(json => {
      toast.success('Comparación eliminada');
      this.props.callback();
      this.props.deleteBrandComparison(this.props.brandComparison.url);
    });
  };

  render() {
    return <React.Fragment>
      <Button color="danger" onClick={this.toggleDeleteModal}>Eliminar</Button>
      <Modal centered isOpen={this.state.deleteModalOpen} toggle={this.toggleDeleteModal}>
        <ModalHeader>Confirmar eliminación de comparación: {this.props.brandComparison.name}</ModalHeader>
        <ModalFooter>
          <Button color="danger" onClick={this.deleteComparison}>Eliminar</Button>
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
    deleteBrandComparison: url => {
      return dispatch({
        type: 'deleteApiResourceObject',
        url: url
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandComparisonDeleteButton);