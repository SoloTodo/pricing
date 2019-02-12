import React, {Component} from 'react'
import {connect} from "react-redux";
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap'

import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormSubmitButton
} from "../../react-utils/api_forms";
import {filterApiResourceObjectsByType} from "../../react-utils/ApiResource";


class ReportStoreAnalysis extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
      apiFormFieldChangeHandler: undefined,
      downloadLink: undefined
    }
  }

  setApiFormFieldChangeHandler = apiFormFieldChangeHandler => {
    this.setState({
      apiFormFieldChangeHandler
    })
  };

  handleFormValueChange = formValues => {
    this.setState({formValues})
  };

  setDownloadLink = json => {
    if (json) {
      window.location = json.payload.url;
      this.setState({
        downloadLink: undefined
      })
    } else {
      this.setState({
        downloadLink: null
      })
    }
  };

  render() {
    const priceTypeChoices = [
      {
        id: 'offer_price',
        name: 'Precio oferta'
      },
      {
        id: 'normal_price',
        name: 'Precio normal'
      }
    ];

    const layoutChoices = [
      {
        id: 'layout_1',
        name: 'Layout 1'
      },
      {
        id: 'layout_2',
        name: 'Layout 2'
      }
    ];

    return <Row>
      <Col sm="12">
        <Card>
          <CardHeader>
            <i className="fas fa-search"/> Filtros
          </CardHeader>
          <ApiForm
            endpoints={['reports/store_analysis/']}
            fields={['store', 'competing_stores', 'categories', 'price_type', 'layout', 'submit']}
            onResultsChange={this.setDownloadLink}
            onFormValueChange={this.handleFormValueChange}
            setFieldChangeHandler={this.setApiFormFieldChangeHandler}
            requiresSubmit={true}>
            <CardBody className="card-block">
              <Row className="api-form-filters">
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Tienda</label>
                  <ApiFormChoiceField
                    name="store"
                    required={true}
                    choices={this.props.stores}
                    searchable={true}
                    placeholder="Todas"
                    onChange={this.state.apiFormFieldChangeHandler}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Tiendas para comparativa</label>
                  <ApiFormChoiceField
                    name="competing_stores"
                    choices={this.props.stores}
                    searchable={true}
                    multiple={true}
                    placeholder="Todas"
                    onChange={this.state.apiFormFieldChangeHandler}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Categorías</label>
                  <ApiFormChoiceField
                    name="categories"
                    choices={this.props.categories}
                    multiple={true}
                    placeholder='Todas'
                    searchable={true}
                    onChange={this.state.apiFormFieldChangeHandler}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Tipo de precio</label>
                  <ApiFormChoiceField
                    name="price_type"
                    choices={priceTypeChoices}
                    onChange={this.state.apiFormFieldChangeHandler}
                    required={true}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Layout</label>
                  <ApiFormChoiceField
                    name="layout"
                    choices={layoutChoices}
                    onChange={this.state.apiFormFieldChangeHandler}
                    required={true}/>
                </Col>

                <Col xs="12" sm="7" md="6" lg="12" xl="12">
                  <label htmlFor="submit">&nbsp;</label>
                  <ApiFormSubmitButton
                    label='Generar'
                    loadingLabel='Generando'
                    onChange={this.state.apiFormFieldChangeHandler}/>
                </Col>
              </Row>
            </CardBody>
          </ApiForm>
        </Card>
      </Col>
    </Row>

  }
}

function mapStateToProps(state) {
  return {
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores').filter(store => store.permissions.includes('view_store_reports')),
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories').filter(category => category.permissions.includes('view_category_reports')),
    currencies: filterApiResourceObjectsByType(state.apiResourceObjects, 'currencies'),
    store_types: filterApiResourceObjectsByType(state.apiResourceObjects, 'store_types'),
    countries: filterApiResourceObjectsByType(state.apiResourceObjects, 'countries'),
  }
}

export default connect(mapStateToProps)(ReportStoreAnalysis);
