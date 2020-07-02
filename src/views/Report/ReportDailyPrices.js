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
import {booleanChoices} from "../../utils";
import {toast} from "react-toastify";

class ReportDailyPrices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
      apiFormFieldChangeHandler: undefined,
      downloadLink: undefined
    }
  }

  handleFormValueChange = formValues => {
    this.setState({formValues})
  };

  setDownloadLink = json => {
    if (json) {
      toast.success('El reporte esta siendo generado. Una vez finalizado este será enviado a su correo.',
        {autoClose: false})
    } else {
      this.setState({
        downloadLink: null
      })
    }
  };

  render() {
    const today = moment.utc().startOf('day');
    const todayMinus7Days = moment.utc().startOf('day').subtract(7, 'days');

    return <Row>
      <Col sm="12">
        <Card>
          <CardHeader>
            <i className="fas fa-search">&nbsp;</i> Filtros
          </CardHeader>
          <ApiForm
            endpoints={['reports/daily_prices/']}
            fields={['timestamp', 'category', 'stores', 'countries', 'store_types', 'currency', 'brands', 'exclude_unavailable', 'filename', 'submit']}
            onResultsChange={this.setDownloadLink}
            onFormValueChange={this.handleFormValueChange}
            requiresSubmit={true}>
            <CardBody>
              <Row className="api-form-filters">
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Rango de fechas (desde / hasta)</label>
                  <ApiFormDateRangeField
                    name="timestamp"
                    id="timestamp"
                    initial={[todayMinus7Days, today]}
                    value={this.state.formValues.timestamp}
                  />
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Categoría</label>
                  <ApiFormChoiceField
                    name="category"
                    required={true}
                    choices={this.props.categories}
                    value={this.state.formValues.category}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Moneda</label>
                  <ApiFormChoiceField
                    name="currency"
                    choices={this.props.currencies}
                    placeholder="No convertir"
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
                    value={this.state.formValues.stores}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Países</label>
                  <ApiFormChoiceField
                    name="countries"
                    choices={this.props.countries}
                    multiple={true}
                    placeholder="Todos"
                    value={this.state.formValues.countries}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Tipos</label>
                  <ApiFormChoiceField
                    name="store_types"
                    choices={this.props.store_types}
                    multiple={true}
                    placeholder="Todos"
                    value={this.state.formValues.store_types}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Marca</label>
                  <ApiFormChoiceField
                    name="brands"
                    choices={this.props.brands}
                    multiple={true}
                    placeholder="Todas"
                    value={this.state.formValues.brands}
                    debounceTimeout={1}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>¿Excluir no disponibles?
                  </label>
                  <ApiFormChoiceField
                    name="exclude_unavailable"
                    choices={booleanChoices}
                    required={true}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Nombre de archivo (opcional)</label>
                  <ApiFormTextField
                    name="filename"
                    placeholder="Opcional"
                    debounceTimeout={1}/>
                </Col>

                <Col xs="12" sm="7" md="6" lg="12" xl="12">
                  <label htmlFor="submit">&nbsp;</label>
                  <ApiFormSubmitButton
                    value={this.state.formValues.submit}
                    label="Generar"
                    loadingLabel="Generar"
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
    brands: filterApiResourceObjectsByType(state.apiResourceObjects, 'brands'),
    countries: filterApiResourceObjectsByType(state.apiResourceObjects, 'countries'),
  }
}

export default connect(mapStateToProps)(ReportDailyPrices);
