import React from 'react'
import {connect} from "react-redux";
import {toast} from "react-toastify";
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from "reactstrap";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";



class KeywordSearchDeleteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModalOpen: false
    }
  }

  toggleDeleteModal = e => {
    e && e.preventDefault();
    this.setState({
      deleteModalOpen: !this.state.deleteModalOpen
    })
  };

  deleteSearch = () => {
    this.props.fetchAuth(`keyword_searches/${this.props.keywordSearch.id}/`, {
      method: 'DELETE'
    }).then(json => {
      toast.success('Keyword Search eliminado');
      this.props.deleteKeywordSearch(this.props.keywordSearch.url);
      this.toggleDeleteModal()
      this.props.callback();
    })
  };

  render() {
    return <React.Fragment>
      <Button color="danger" onClick={this.toggleDeleteModal}>Eliminar</Button>
      <Modal centered isOpen={this.state.deleteModalOpen} toggle={this.toggleDeleteModal}>
        <ModalHeader>Confirmar eliminación de búsqueda</ModalHeader>
        <ModalBody>
          Si elimina una búsqueda se perderán todos los datos históricos asociados a ésta.
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.deleteSearch}>Eliminar</Button>
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
    deleteKeywordSearch: url => {
      return dispatch({
        type: 'deleteApiResourceObject',
        url: url
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeywordSearchDeleteButton);