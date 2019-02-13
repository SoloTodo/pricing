import React from 'react'
import {connect} from "react-redux";
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap'
import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormSubmitButton
} from "../../react-utils/api_forms";
import {
  filterApiResourceObjectsByType,
} from "../../react-utils/ApiResource";


class ReportWtb extends React.Component {
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
    return <Row>
      <Col sm="12">
        <Card>
          <CardHeader>
            <i className="fas fa-search"/>Filtros
          </CardHeader>
          <ApiForm
            endpoints={['reports/wtb_report/']}
            fields={['wtb_brand', 'category', 'stores', 'countries', 'store_types', 'currency', 'submit']}
            onResultsChange={this.setDownloadLink}
            onFormValueChange={this.handleFormValueChange}
            setFieldChangeHandler={this.setApiFormFieldChangeHandler}
            requiresSubmit={true}>
            <CardBody>
              <Row className="api-form-filters">
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Marca</label>
                  <ApiFormChoiceField
                    name="wtb_brand"
                    required={true}
                    choices={this.props.wtb_brands}
                    onChange={this.state.apiFormFieldChangeHandler}
                    value={this.state.formValues.wtb_brand}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Categoría</label>
                  <ApiFormChoiceField
                    name="category"
                    required={true}
                    choices={this.props.categories}
                    onChange={this.state.apiFormFieldChangeHandler}
                    value={this.state.formValues.category}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Moneda</label>
                  <ApiFormChoiceField
                    name="currency"
                    choices={this.props.currencies}
                    placeholder="No convertir"
                    onChange={this.state.apiFormFieldChangeHandler}
                    value={this.state.formValues.currency}
                  />
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Tiendas</label>
                  <ApiFormChoiceField
                    name="stores"
                    choices={this.props.stores}
                    multiple={true}
                    placeholder="Todas"
                    searchable={true}
                    onChange={this.state.apiFormFieldChangeHandler}
                    value={this.state.formValues.stores}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Países</label>
                  <ApiFormChoiceField
                    name="countries"
                    choices={this.props.countries}
                    multiple={true}
                    placeholder="Todos"
                    onChange={this.state.apiFormFieldChangeHandler}
                    value={this.state.formValues.countries}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Tipos</label>
                  <ApiFormChoiceField
                    name="store_types"
                    choices={this.props.store_types}
                    multiple={true}
                    placeholder="Todos"
                    onChange={this.state.apiFormFieldChangeHandler}
                    value={this.state.formValues.store_types}/>
                </Col>

                <Col xs="12" sm="7" md="6" lg="12" xl="12">
                  <label htmlFor="submit"/>
                  <ApiFormSubmitButton
                    value={this.state.formValues.submit}
                    label="Generar"
                    loadingLabel="Generando"
                    onChange={this.state.apiFormFieldChangeHandler}
                    loading={this.state.downloadLink === null}/>
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
  const stores = filterApiResourceObjectsByType(state.apiResourceObjects, 'stores').filter(store => store.permissions.includes('view_store_reports'));
  const countryList = stores.map(store => store.country);
  const countries = filterApiResourceObjectsByType(state.apiResourceObjects, 'countries').filter(country => countryList.includes(country.url));

  return {
    stores,
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories').filter(category => category.permissions.includes('view_category_reports')),
    currencies: filterApiResourceObjectsByType(state.apiResourceObjects, 'currencies'),
    store_types: filterApiResourceObjectsByType(state.apiResourceObjects, 'store_types'),
    countries,
    wtb_brands: filterApiResourceObjectsByType(state.apiResourceObjects, 'wtb_brands')
  }
}

export default connect(mapStateToProps)(ReportWtb);
