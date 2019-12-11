import React from 'react'
import {connect} from "react-redux";
import { toast } from 'react-toastify';
import {Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap'
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class BrandComparisonAlertsCreateButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alertModalIsActive: false,
    }
  }

  toggleAlertModal = () => {
    this.setState({
      alertModalIsActive: !this.state.alertModalIsActive
    })
  };

  handleAlertCreateSubmit = e => {
    e.preventDefault();

  };

  render() {
    return <React.Fragment>
      <Button color="success" className="mr-2" onClick={this.toggleAlertModal}>Crear Alerta</Button>
      <Modal centered id="pending_products" size="lg" isOpen={this.state.alertModalIsActive} toggle={this.toggleAlertModal}>
        <ModalHeader>Crear nueva alerta</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <form>

              </form>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter><Button color="success" onClick={this.handleAlertCreateSubmit}>Crear</Button></ModalFooter>
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

export default connect(mapStateToProps)(BrandComparisonAlertsCreateButton);