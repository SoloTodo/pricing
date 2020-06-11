import React from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardHeader, CardBody, Table } from "reactstrap";

import {filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {NavLink} from "react-router-dom";


class MicrositeList extends React.Component {
    render() {
        return <Row>
            <Col sm="12">
                <Card>
                    <CardHeader>Sitios</CardHeader>
                    <CardBody>
                        <Table striped>
                            <thead>
                            <tr>
                                <th>Sitio</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.props.microsites.map(microsite => (
                                <tr key={microsite.name}>
                                    <td><NavLink to={`/microsites/${microsite.id}`}>{microsite.name}</NavLink></td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    }
}

function mapStateToProps(state) {
    return {
        microsites: filterApiResourceObjectsByType(state.apiResourceObjects, 'microsite_brands')
    }
}

export default connect(mapStateToProps)(MicrositeList)