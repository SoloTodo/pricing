import React from 'react'
import {Modal, ModalHeader, ModalBody, ModalFooter, Table, Button} from 'reactstrap'
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";
import BrandComparisonAlertsCreateButton from "./BrandComparisonAlertsCreateButton";


class BrandComparisonAlertsButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alertsModalIsActive: false,
      alerts: undefined
    }
  }

  componentDidMount() {
    this.props.fetchAuth('brand_comparison_alerts/').then(json => {
      this.setState({
        alerts: json
      })
    })
  }

  toggleAlertsModal = () => {
    this.setState({
      alertsModalIsActive: !this.state.alertsModalIsActive
    })
  };

  handleRemoveAlertButton = (alert_id) => {

  };

  render() {
    if (!this.state.alerts) {
      return null
    }

    return <React.Fragment>
      <Button color="primary" className="mr-2" onClick={this.toggleAlertsModal}>Alertas</Button>
      <Modal centered id="alerts" size="lg" isOpen={this.state.alertsModalIsActive} toggle={this.toggleAlertsModal}>
        <ModalHeader>Alertas</ModalHeader>
        <ModalBody>
          <Table size="sm" striped bordered>
            <tbody>
            {this.state.alerts.map(alert =>
              <tr key={alert.id}>
                <td>{alert.id}</td>
                <td>{alert.last_check}</td>
                <td className="center-aligned"><Button size="sm" color="danger" onClick={() => this.handleRemoveAlertButton(alert.id)}>Eliminar</Button></td>
              </tr>
            )}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <BrandComparisonAlertsCreateButton/>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  }
}

function mapStateToProps(state){
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  return {
    fetchAuth
  }
}

export default connect(mapStateToProps)(BrandComparisonAlertsButton)