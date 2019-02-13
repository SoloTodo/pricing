import React, {Component} from 'react'
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


class ReportSecPrices extends Component {
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
            <i className="fas fa-search"/> Filtros
          </CardHeader>
          <ApiForm
            endpoints={['reports/sec_prices/']}
            fields={['category', 'stores', 'submit']}
            onResultsChange={this.setDownloadLink}
            onFormValueChange={this.handleFormValueChange}
            setFieldChangeHandler={this.setApiFormFieldChangeHandler}
            requiresSubmit={true}>
            <CardBody>
              <Row className="api-form-filters">
                <Col xs="12" sm="6">
                  <label>Categoría</label>
                  <ApiFormChoiceField
                    name="category"
                    required={true}
                    choices={this.props.categories}
                    placeholder="Todas"
                    onChange={this.state.apiFormFieldChangeHandler}
                    value={this.state.formValues.category}/>
                </Col>

                <Col xs="12" sm="6">
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

                <Col xs="12" sm="6">
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
  return {
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores').filter(store => store.permissions.includes('view_store_reports')),
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories').filter(category => category.permissions.includes('view_category_reports')),
    currencies: filterApiResourceObjectsByType(state.apiResourceObjects, 'currencies'),
    store_types: filterApiResourceObjectsByType(state.apiResourceObjects, 'store_types'),
    countries: filterApiResourceObjectsByType(state.apiResourceObjects, 'countries'),
  }
}

export default connect(mapStateToProps)(ReportSecPrices);
