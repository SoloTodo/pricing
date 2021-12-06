import React from 'react';
import {Card, CardHeader, Table, CardBody, Col, Row, Nav, NavItem} from 'reactstrap';
import {connect} from "react-redux";
import {NavLink} from "react-router-dom";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {settings} from "../../settings";


class StoreDetail extends React.Component {
  download_matching_report = () => {
    const store = this.props.apiResourceObject

    const endpoint = `${settings.apiResourceEndpoints.stores}${store.id}/matching_report/`
    this.props.fetchAuth(endpoint).then(res => {
      window.location = res.url
    })
  }

  render() {
    const store = this.props.ApiResourceObject(this.props.apiResourceObject);

    return <Row>
      <Col sm="6" md="8">
        <Card>
          <CardHeader>{store.name}</CardHeader>
          <CardBody>
            <Table striped>
              <tbody>
              <tr>
                <th>Nombre</th>
                <td>{store.name}</td>
              </tr>
              <tr>
                <th>Tipo</th>
                <td>{store.type.name}</td>
              </tr>
              <tr>
                <th>País</th>
                <td>{store.country.name}</td>
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
              <NavItem><NavLink to={'/stores/' + store.id}>Información General</NavLink></NavItem>
              <NavItem><NavLink to={'/stores/' + store.id + '/update_logs'}>Registros de actualización</NavLink></NavItem>
              {store.permissions.includes('view_store_entity_positions') ?
                <React.Fragment>
                  <NavItem><NavLink to={'/stores/' + store.id + '/current_sku_positions'}>
                    Posicionamiento actual de SKUs
                  </NavLink></NavItem>
                  <NavItem> <NavLink to = {'/stores/' +store.id + '/historic_sku_positions'} >
                    Posicionamiento historico de SKUs
                  </NavLink></NavItem>
                </React.Fragment>
                : null
              }
              {store.permissions.includes('view_store_reports') &&
                <NavItem><a href="#" onClick={this.download_matching_report}>Descargar reporte de homologación</a></NavItem>
              }
            </Nav>
          </CardBody>
        </Card>
      </Col>
    </Row>
  }
}

function mapStateToProps(state) {
  const {ApiResourceObject, fetchAuth} = apiResourceStateToPropsUtils(state);
  return {
    ApiResourceObject,
    fetchAuth
  }
}

export default connect(mapStateToProps)(StoreDetail);