import React from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardHeader, CardBody, Table } from "reactstrap";

import {filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import MicrositeAddProductButton from "../../Components/Microsites/MicrositeAddProductButton";


class MicrositeEntries extends React.Component {
    render() {
        const microsite = this.props.ApiResourceObject(this.props.apiResourceObject);
        const entries = microsite.entries;

        return <Row>
            <Col sm="12">
                <Card>
                    <CardHeader className="d-flex justify-content-between">
                        <span>{microsite.name}</span>
                        <MicrositeAddProductButton/>
                    </CardHeader>
                    <CardBody>
                        <Table striped>
                            <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Categoría</th>
                            </tr>
                            </thead>
                            <tbody>
                            {entries.map(entry => (
                                <tr key={entry.id}>
                                    <td>{entry.product.name}</td>
                                    <td>{entry.product.category}</td>
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

function mapDispatchToProps(dispatch) {
  return {
    updateMicrositeBrand: micrositeBrand => {
      return dispatch({
        type: 'addApiResourceObject',
        apiResource: micrositeBrand
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MicrositeEntries)