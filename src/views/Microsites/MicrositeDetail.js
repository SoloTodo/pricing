import React from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";


class MicrositeDetail extends React.Component{
    render() {
        const microsite = this.props.ApiResourceObject(this.props.apiResourceObject);
        console.log(microsite)
        return <Row>
            <Col sm="6" md="8">
                <Card>
                    <CardHeader>{microsite.name}</CardHeader>
                    <CardBody>
                        <ul>
                            <li>Gestionar Productos</li>
                        </ul>
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

export default connect(mapStateToProps)(MicrositeDetail);