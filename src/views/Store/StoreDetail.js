import React from 'react';
import {Card, CardHeader, Table, CardBody, Col, Row, Nav, NavItem} from 'reactstrap';
import {connect} from "react-redux";
import {NavLink} from "react-router-dom";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";


class StoreDetail extends React.Component {
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
            </Nav>
          </CardBody>
        </Card>
      </Col>
    </Row>
  }
}

function mapStateToProps(state) {
  const {ApiResourceObject} = apiResourceStateToPropsUtils(state);
  return {
    ApiResourceObject
  }
}

export default connect(mapStateToProps)(StoreDetail);