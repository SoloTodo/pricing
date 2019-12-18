import React from 'react'
import {Modal, ModalHeader, ModalBody, ModalFooter, Table, Button} from 'reactstrap'
import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {connect} from "react-redux";
import { toast } from 'react-toastify';
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
    this.componentUpdate()
  }

  componentUpdate = () => {
    this.props.fetchAuth(`brand_comparison_alerts/?brand_comparison=${this.props.brandComparison.id}`).then(json => {
      this.setState({
        alerts: json
      })
    })
  };

  toggleAlertsModal = () => {
    this.setState({
      alertsModalIsActive: !this.state.alertsModalIsActive
    })
  };

  handleRemoveAlertButton = (alert_id) => {
    this.props.fetchAuth(`brand_comparison_alerts/${alert_id}/`, {
      method: 'DELETE',
    }).then(json => {
      toast.success("Alerta eliminada exitosamente");
      this.componentUpdate()
    })
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
                <td>{alert.stores.map(store => this.props.stores.filter(s => s.url === store)[0].name).join(', ')}</td>
                <td className="center-aligned"><Button size="sm" color="danger" onClick={() => this.handleRemoveAlertButton(alert.id)}>Eliminar</Button></td>
              </tr>)}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <BrandComparisonAlertsCreateButton
            callback = {this.componentUpdate}
            brandComparison={this.props.brandComparison}/>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  }
}

function mapStateToProps(state){
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  return {
    fetchAuth,
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores')
  }
}

export default connect(mapStateToProps)(BrandComparisonAlertsButton)