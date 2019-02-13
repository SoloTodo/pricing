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
import ApiFormTextField from "../../react-utils/api_forms/ApiFormTextField";
import ApiFormDateRangeField from "../../react-utils/api_forms/ApiFormDateRangeField";
import moment from "moment/moment";


class ReportWeeklyPrices extends Component {
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
    const today = moment().startOf('day');
    const todayMinus30Days = moment().startOf('day').subtract(30, 'days');

    return <Row>
      <Col sm="12">
        <Card>
          <CardHeader>
            <i className="fas fa-search"/> Filtros
          </CardHeader>
          <ApiForm
            endpoints={['reports/weekly_prices/']}
            fields={['timestamp', 'category', 'stores', 'countries', 'store_types', 'currency', 'filename', 'submit']}
            onResultsChange={this.setDownloadLink}
            onFormValueChange={this.handleFormValueChange}
            setFieldChangeHandler={this.setApiFormFieldChangeHandler}
            requiresSubmit={true}>
            <CardBody>
              <Row className="api-form-filters">
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Rango de fechas (desde / hasta)</label>
                  <ApiFormDateRangeField
                    name="timestamp"
                    id="timestamp"
                    initial={[todayMinus30Days, today]}
                    value={this.state.formValues.timestamp}
                    onChange={this.state.apiFormFieldChangeHandler}/>
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
                    value={this.state.formValues.currency}/>
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

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Nombre de archivo (opcional)</label>
                  <ApiFormTextField
                    name="filename"
                    placeholder="Opcional"
                    onChange={this.state.apiFormFieldChangeHandler}
                    debounceTimeout={1}/>
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
  return {
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores').filter(store => store.permissions.includes('view_store_reports')),
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories').filter(category => category.permissions.includes('view_category_reports')),
    currencies: filterApiResourceObjectsByType(state.apiResourceObjects, 'currencies'),
    store_types: filterApiResourceObjectsByType(state.apiResourceObjects, 'store_types'),
    countries: filterApiResourceObjectsByType(state.apiResourceObjects, 'countries'),
  }
}

export default connect(mapStateToProps)(ReportWeeklyPrices);
