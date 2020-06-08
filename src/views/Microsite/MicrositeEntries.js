import React from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { Row, Col, Card, CardHeader, CardBody, Table} from "reactstrap";

import MicrositeAddProductButton from "../../Components/Microsites/MicrositeAddProductButton";
import MicrositeEntryRow from "../../Components/Microsites/MicrositeEntryRow";
import {
    apiResourceStateToPropsUtils, filterApiResourceObjectsByType,
} from "../../react-utils/ApiResource";


class MicrositeEntries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategory: null
        }
    }

    setSelectedCategory = categoryOption => {
        this.setState({
            selectedCategory: categoryOption
        })
    }

    handleMicrositeChange = () => {
        this.props.fetchAuth(`microsite/brands/${this.props.apiResourceObject.id}/`).then(json => {
            this.props.updateMicrositeBrand(json)
        });
    }

    render() {
        const microsite = this.props.apiResourceObject;
        let entries = microsite.entries;
        const extraFields = microsite.fields.split(',').map(field => field.trim());

        if (this.state.selectedCategory) {
            entries = entries.filter(entry => entry.product.category === this.state.selectedCategory.value)
        }

        const fieldNames = {
            'sku': 'SKU',
            'brand_url': 'URL',
            'title': 'Nombre',
            'description': 'Descripción',
            'reference_price': 'Precio Referencia'
        }

        const categoryOptions = this.props.categories.map(category => {
            return {
                label: category.name,
                value: category.url,
            }
        })


        return <React.Fragment>
            <Row>
                <Col sm="12">
                    <Card>
                        <CardHeader><i className="fas fa-search">&nbsp;</i>Filtros</CardHeader>
                        <CardBody>
                            <Row>
                                <Col sm="6">
                                    <label>Categoría</label>
                                    <Select
                                        options={categoryOptions}
                                        value = {this.state.selectedCategory}
                                        onChange={this.setSelectedCategory}
                                        searchable={true}
                                        isSearchable={true}
                                        clearable={true}
                                        isClearable={true}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col sm="12">
                    <Card>
                        <CardHeader className="d-flex justify-content-between align-items-center">
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
                                    {extraFields.map(field =>
                                        <th key={field}>
                                            {fieldNames[field]}
                                        </th>
                                    )}
                                    <th>Eliminar</th>
                                </tr>
                                </thead>
                                <tbody>
                                {entries.map(entry => {
                                    return <MicrositeEntryRow
                                        key={entry.id}
                                        entry={entry}
                                        extraFields={extraFields}
                                        handleMicrositeChange={this.handleMicrositeChange}/>
                                })}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
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