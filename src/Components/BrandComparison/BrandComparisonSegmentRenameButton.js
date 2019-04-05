import React from 'react'
import {connect} from "react-redux";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label} from "reactstrap";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class BrandComparisonSegmentRenameButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renameModalOpen:false,
      newName: this.props.segment.name
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

  renameSegment = () => {
    const name = this.state.newName;
    this.props.fetchAuth(`brand_comparison_segments/${this.props.segment.id}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        name
      })
    }).then(json => {
      this.props.fetchAuth(`brand_comparisons/${this.props.comparisonId}/`).then(json => {
        this.props.updateBrandComparison(json)
      });
    });
    this.toggleRenameModal()
  };

  render() {
    return <React.Fragment>
      <a href="/" onClick={this.toggleRenameModal}><i className="fa fa-pencil"/></a>
      <Modal centered isOpen={this.state.renameModalOpen} toggle={this.toggleRenameModal}>
        <ModalHeader>Cambiar nombre segmento {this.props.segment.name}</ModalHeader>
        <ModalBody>
          <Label for="segmentNewName">Nuevo Nombre</Label>
          <Input id="segmentNewName" onChange={this.inputChangeHandler} type="text" value={this.state.newName}/>
        </ModalBody>
        <ModalFooter>
          <Button disabled={!Boolean(this.state.newName)} onClick={this.renameSegment} color="success">Guardar</Button>
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
    updateBrandComparison: brandComparison => {
      return dispatch({
        type: 'addApiResourceObject',
        apiResource: brandComparison
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandComparisonSegmentRenameButton)
