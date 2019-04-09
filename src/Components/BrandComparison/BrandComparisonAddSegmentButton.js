import React from 'react'
import {connect} from "react-redux";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input} from "reactstrap";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class BrandComparisonAddSegmentButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addSegmentModalOpen: false,
      name: ''
    }
  }

  toggleAddSegmentModalOpen = () => {
    this.setState({
      addSegmentModalOpen: !this.state.addSegmentModalOpen
    })
  };

  inputChangeHandler = e => {
    this.setState({
      name: e.target.value
    })
  };

  addSegment = () => {
    const name = this.state.name;
    this.props.fetchAuth(`brand_comparisons/${this.props.brandComparison.id}/add_segment/`, {
      method: 'POST',
      body: JSON.stringify({
        name
      })
    }).then(json => {
      this.props.onComparisonChange(json);
      this.toggleAddSegmentModalOpen()
    })
  };

  render() {
    return <React.Fragment>
      <Button color="link" size="sm" onClick={this.toggleAddSegmentModalOpen}>
        <i className="fa fa-plus"/>
      </Button>
      <Modal centered isOpen={this.state.addSegmentModalOpen} toggle={this.toggleAddSegmentModalOpen}>
        <ModalHeader>Añadir Segmento</ModalHeader>
        <ModalBody>
          <Label for="newSegmentName">Nombre</Label>
          <Input id="newSegmentName" onChange={this.inputChangeHandler} type="text" value={this.state.name}/>
        </ModalBody>
        <ModalFooter>
          <Button disabled={!Boolean(this.state.name)} onClick={this.addSegment} color="success">Guardar</Button>
          <Button onClick={this.toggleAddSegmentModalOpen} color="danger">Cancelar</Button>
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

export default connect(mapStateToProps)(BrandComparisonAddSegmentButton);