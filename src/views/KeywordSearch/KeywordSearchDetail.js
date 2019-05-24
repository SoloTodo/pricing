import React from 'react'
import {NavLink} from "react-router-dom";
import {Card, CardHeader, CardBody, Col, Row, Nav, NavItem} from 'reactstrap';

import KeywordSearchUpdateTable from "../../Components/KeywordSearch/KeywordSearchUpdateTable";

class KeywordSearchDetail extends React.Component{
  render() {
    const keywordSearch = this.props.apiResourceObject;
    return <Row>
      <Col sm="6" md="8">
        <Card>
          <CardHeader>Última actualización</CardHeader>
          <CardBody>
            <KeywordSearchUpdateTable
              updateUrl={keywordSearch.active_update}/>
          </CardBody>
        </Card>
      </Col>
      <Col sm="6" md="4">
        <Card>
          <CardHeader>Opciones</CardHeader>
          <CardBody>
            <Nav vertical>
              <NavItem><NavLink to={keywordSearch.id + '/updates'}>Todas las actualizaciones</NavLink></NavItem>
            </Nav>
          </CardBody>
        </Card>
      </Col>
    </Row>
  }
}

export default KeywordSearchDetail;