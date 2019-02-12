import React from 'react'
import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {connect} from "react-redux";
import {Row, Col, Card, CardHeader, CardBody, Table, Nav, NavItem, Modal, ModalHeader, ModalBody, Button} from 'reactstrap'
import {NavLink} from "react-router-dom";
import {toast} from "react-toastify";

import {formatDateStr} from "../../react-utils/utils";
import {apiSettings as settings} from "../../react-utils/settings";
import ModalFooter from "reactstrap/es/ModalFooter";

class AlertDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModalIsActive: false,
    };
    this.alert = this.props.ApiResourceObject(this.props.apiResourceObject);

  }

  toggleDeleteModal = () => {
    this.setState({
      deleteModalIsActive: !this.state.deleteModalIsActive
    })
  };

  handleDeleteButtonClick = e => {
    e.preventDefault();
    this.toggleDeleteModal();
  };

  handleConfirmDeleteButtonClick = () => {
    this.props.fetchAuth(`${settings.apiResourceEndpoints.user_alerts}${this.alert.id}/`,{
     method:'DELETE'
    }).then(json => {
      toast.success('Alerta eliminada exitosamente');
      this.props.deleteAlert(this.alert);
    })
  };

  render() {
    const alert = this.alert;
    return <React.Fragment>
      <Row>
        <Col sm="6" md="8">
          <Card>
            <CardHeader>{alert.entity? alert.entity.product.name : alert.alert.product.name}</CardHeader>
            <CardBody>
              <Table responsive striped>
                <tbody>
                <tr>
                  <th>Tipo</th>
                  <td>{alert.entity? 'SKU' : 'Producto'}</td>
                </tr>
                <tr>
                  <th>Producto / SKU</th>
                  <td>{alert.entity?
                    <span>
                    <NavLink to={'/products/' + alert.entity.product.id}>{alert.entity.product.name}</NavLink>&nbsp;
                      (<NavLink to={'/skus/' + alert.entity.id}>{alert.entity.sku}</NavLink>)
                  </span> :
                    <NavLink to={'/products/' + alert.alert.product.id}>{alert.alert.product.name}</NavLink>}</td>
                </tr>
                <tr>
                  <th>Tiendas</th>
                  <td>{alert.entity?
                    this.props.stores.filter(store => store.url === alert.entity.store)[0].name :
                    <div>
                      {alert.alert.stores.map(store_url => <li key={store_url} className="list-without-decoration">
                        {this.props.stores.filter(store => store.url === store_url)[0].name}
                      </li>)}
                    </div>}</td>
                </tr>
                <tr>
                  <th>Fecha creación</th>
                  <td>{formatDateStr(alert.alert.creation_date)}</td>
                </tr>
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
        <Col sm="6" md="4">
          <Card>
            <CardHeader>Opciones</CardHeader>
            <CardBody>
              <Nav vertical>
                <NavItem><NavLink to={'/alerts/' + alert.id}>Información General</NavLink></NavItem>
                <NavItem><NavLink to={'/alerts/' + alert.id + '/change_history'}>Historial de cambios</NavLink></NavItem>
              </Nav>
              <Button color="danger" onClick={this.handleDeleteButtonClick}><i className="fas fa-trash"/> Eliminar alerta</Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal centered id="delete_alert" isOpen={this.state.deleteModalIsActive} toggle={this.toggleDeleteModal}>
        <ModalHeader>Confirmación de eliminación</ModalHeader>
        <ModalBody> Confirme que desea eliminar la alerta.</ModalBody>
        <ModalFooter>
            <Button color="danger" onClick={this.handleConfirmDeleteButtonClick}><i className="fas fa-trash"/> Eliminar alerta</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {fetchAuth, ApiResourceObject} = apiResourceStateToPropsUtils(state);
  return {
    fetchAuth,
    ApiResourceObject,
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores')

  }
}

function mapDispatchToProps(dispatch) {
  return {
    deleteAlert: alert => {
      dispatch({
        type: 'deleteApiResourceObject',
        url: alert.url
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertDetail);