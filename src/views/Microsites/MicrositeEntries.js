import React from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardHeader, CardBody, Table} from "reactstrap";

import {
    apiResourceStateToPropsUtils,
    filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";
import MicrositeAddProductButton from "../../Components/Microsites/MicrositeAddProductButton";
import MicrositeEntryRow from "../../Components/Microsites/MicrositeEntryRow";


class MicrositeEntries extends React.Component {
    handleMicrositeChange = () => {
        this.props.fetchAuth(`microsite/brands/${this.props.apiResourceObject.id}/`).then(json => {
            this.props.updateMicrositeBrand(json)
        });
    }

    render() {
        const microsite = this.props.ApiResourceObject(this.props.apiResourceObject);
        const entries = microsite.entries;
        const extra_fields = microsite.fields.split(',').map(field => field.trim());

        const field_names = {
            'sku': 'SKU',
            'brand_url': 'URL',
            'title': 'Nombre',
            'description': 'Descripción',
            'reference_price': 'Precio Referencia'
        }


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
                                        {field_names[field]}
                                    </th>
                                )}
                                <th>Eliminar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {entries.map(entry => {
                                const category = this.props.categories.filter(category => category.url === entry.product.category)[0];
                                return <MicrositeEntryRow key={entry.id} entry={entry} category={category} extra_fields={extra_fields}/>
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