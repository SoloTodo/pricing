import React from 'react'
import {connect} from "react-redux";
import {Modal, ModalHeader, ModalFooter, Button} from "reactstrap";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {toast} from "react-toastify";

class BrandComparisonSegmentRowDeleteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModalOpen: false
    }
  }

  toggleDeleteModal = e => {
    e && e.preventDefault();
    if (this.props.disabled) {
      return
    }
    this.setState({
      deleteModalOpen: !this.state.deleteModalOpen,
    })
  };

  deleteRow = () => {
    this.props.fetchAuth(`brand_comparison_segment_rows/${this.props.row.id}/`, {
      method: 'DELETE'
    }).then(json => {
      this.toggleDeleteModal();
      this.props.onComparisonChange()
    }).catch(async error => {
      const json = await error.json();
      this.toggleDeleteModal();
      toast.error(json.errors)
    });
  };

  render() {
    return <React.Fragment>
      <a href="/" className={this.props.disabled? "text-secondary" : ""} onClick={this.toggleDeleteModal}><i className="fa fa-close"/></a>
      <Modal centered isOpen={this.state.deleteModalOpen} toggle={this.toggleDeleteModal}>
        <ModalHeader>Confirmar eliminación de la fila</ModalHeader>
        <ModalFooter>
          <Button color="danger" onClick={this.deleteRow}>Eliminar</Button>
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

export default connect(mapStateToProps)(BrandComparisonSegmentRowDeleteButton)
