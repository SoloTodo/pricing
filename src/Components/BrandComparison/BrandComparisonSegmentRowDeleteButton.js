import React from 'react'
import {connect} from "react-redux";
import {Modal, ModalHeader, ModalFooter, Button} from "reactstrap";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class BrandComparisonSegmentRowDeleteButton extends React.Component {
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

  deleteRow = () => {
    this.props.fetchAuth(`brand_comparison_segment_rows/${this.props.row.id}/`, {
      method: 'DELETE'
    }).then(json => {
      this.props.fetchAuth(`brand_comparisons/${this.props.comparisonId}/`).then(json => {
        this.toggleDeleteModal();
        this.props.updateBrandComparison(json);
      })
    });
  };

  render() {
    return <React.Fragment>
      <a href="/" onClick={this.toggleDeleteModal}><i className="fa fa-close"/></a>
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

function mapDispatchToProps(dispatch) {
  return {
    updateBrandComparison: brandComparison => {
      return dispatch({
        type: 'addApiResourceObject',
        apiResource: brandComparison
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandComparisonSegmentRowDeleteButton)
