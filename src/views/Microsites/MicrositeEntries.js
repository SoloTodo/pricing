import React from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardHeader, CardBody, Table, Button } from "reactstrap";

import {
    apiResourceStateToPropsUtils,
    filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";
import MicrositeAddProductButton from "../../Components/Microsites/MicrositeAddProductButton";


class MicrositeEntries extends React.Component {
    handleMicrositeChange = () => {
        this.props.fetchAuth(`microsite/brands/${this.props.apiResourceObject.id}/`).then(json => {
            this.props.updateMicrositeBrand(json)
        });
    }

    render() {
        const microsite = this.props.ApiResourceObject(this.props.apiResourceObject);
        const entries = microsite.entries;
        const extra_fields = microsite.fields.split(',');


        return <Row>
            <Col sm="12">
                <Card>
                    <CardHeader className="d-flex justify-content-between">
                        <span>{microsite.name}</span>
                        <MicrositeAddProductButton microsite={microsite} handleMicrositeChange={this.handleMicrositeChange}/>
                    </CardHeader>
                    <CardBody>
                        <Table striped>
                            <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Ordenamiento</th>
                                <th>Ordenamiento Home</th>
                                {extra_fields.map(field =>
                                    <th key={field}>
                                        {field.trim()}
                                    </th>
                                )}
                                <th>Eliminar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {entries.map(entry => {
                                const category = this.props.categories.filter(category => category.url === entry.product.category)[0];
                                return <tr key={entry.id}>
                                    <td>{entry.product.name}</td>
                                    <td>{category.name}</td>
                                    <td>{entry.ordering}</td>
                                    <td>{entry.home_ordering}</td>
                                    {extra_fields.map(field => {
                                        const field_name = field.trim();
                                        return <td key={field_name}>
                                            {entry[field_name]}
                                        </td>
                                    })}
                                    <td><Button color="danger">X</Button></td>
                                </tr>
                            })}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    }
}

function mapStateToProps(state) {
    const {fetchAuth} = apiResourceStateToPropsUtils(state);
    return {
        fetchAuth,
        categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories')
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