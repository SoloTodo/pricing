import React from 'react';
import {connect} from "react-redux";
import {
  apiResourceStateToPropsUtils, filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";
import moment from 'moment';
import {
  convertToDecimal,
  listToObject,
} from "../../react-utils/utils";
import {
  ApiForm,
  ApiFormDateRangeField,
  ApiFormChoiceField,
  ApiFormResultsTable
} from "../../react-utils/api_forms";
import ProductDetailPricingHistoryChart from "./ProductDetailPricingHistoryChart";
import {Row, Col, Card, CardHeader, CardBody, UncontrolledTooltip} from "reactstrap";
import {NavLink} from "react-router-dom";
import {pricingStateToPropsUtils} from "../../utils";

class ProductDetailPricingHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
      apiFormFieldChangeHandler: undefined,
      chart: undefined,
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

  setChartData = (bundle) => {
    if (!bundle) {
      this.setState({
        chart: null,
      });
      return;
    }

    const convertedData = bundle.payload.map(pricingEntry => ({
      entity: pricingEntry.entity,
      pricingHistory: pricingEntry.pricing_history.map(entityHistory => ({
        timestamp: moment(entityHistory.timestamp),
        normalPrice: convertToDecimal(entityHistory.normal_price),
        offerPrice: convertToDecimal(entityHistory.offer_price),
      }))
    }));

    this.setState({
      chart: {
        startDate: bundle.fieldValues.timestamp.startDate,
        endDate: bundle.fieldValues.timestamp.endDate,
        currency: bundle.fieldValues.currency,
        priceType: bundle.fieldValues.price_type,
        data: convertedData
      }
    });
  };

  render() {
    const product = this.props.ApiResourceObject(this.props.apiResourceObject);

    const dateRangeInitialMin = moment().startOf('day').subtract(30, 'days');
    const dateRangeInitialMax = moment().startOf('day');

    const currencyOptions = this.props.currencies.map(currency => {
      const priority = currency.id === this.props.preferredCurrency.id ? 1 : 2;

      return {
        ...currency,
        name: currency.name,
        priority: priority
      }
    });

    currencyOptions.sort((a, b) => a.priority - b.priority);

    const countryUrlsInStores = this.props.stores.map(store => store.country);
    const countryOptions = this.props.countries.filter(country => countryUrlsInStores.includes(country.url));

    const excludeUnavailableOptions = [
      {
        id: '1',
        name: 'Solo disponibles'
      },
    ];

    const priceTypeOptions = [
      {
        id: 'normal',
        name: 'Precio Normal'
      },
      {
        id: 'offer',
        name: 'Precio Oferta'
      },
    ];

    const storeDict = listToObject(this.props.stores, 'url');

    const columns = [
      {
        label: 'Nombre',
        renderer: entry => <NavLink to={'/skus/' + entry.entity.id}>{entry.entity.name}</NavLink>
      },
      {
        label: 'Plan celular',
        renderer: entry => entry.entity.cell_plan ? entry.entity.cell_plan.name : <em>N/A</em>,
        displayFilter: entries => entries.some(entry => entry.entity.cell_plan !== null)
      },
      {
        label: 'Tienda',
        renderer: entry => {
          const store = storeDict[entry.entity.store];

          return <span>
              <NavLink
                to={'/stores/' + store.id}>{store.name}</NavLink>
              <a href={entry.entity.external_url} target="_blank"
                 rel="noopener noreferrer" className="ml-2">
                <span className="fas fa-link">&nbsp;</span>
              </a>
            </span>
        },
      },
      {
        label: 'SKU',
        renderer: entry => entry.entity.sku || <em>N/A</em>,
      },
      {
        label: '¿Disponible?',
        renderer: entry => <i className={entry.entity.active_registry && entry.entity.active_registry.is_available ?
          'far fa-check-square' :
          'far fa-square' }/>,
        cssClasses: 'hidden-md-down center-aligned',
      }
    ];

    return (
      <div className="animated fadeIn d-flex flex-column">
        <UncontrolledTooltip placement="top" target="currency_label">
          The price points are converted to this currency. The values are calculated using standard exchange rates
        </UncontrolledTooltip>

        <ApiForm
          endpoints={[product.url + 'pricing_history/']}
          fields={['timestamp', 'countries', 'stores', 'exclude_unavailable', 'currency', 'price_type']}
          onResultsChange={this.setChartData}
          onFormValueChange={this.handleFormValueChange}
          setFieldChangeHandler={this.setApiFormFieldChangeHandler}>
          <Card>
            <CardHeader><i className="fa fa-filter"/> Filtros</CardHeader>
            <CardBody>
              <Row className="api-form-filters">
                <Col sm="12" md="12" lg="8" xl="4">
                  <label htmlFor="timestamp">Rango fechas (desde / hasta)</label>
                  <ApiFormDateRangeField
                    name="timestamp"
                    id="timestamp"
                    initial={[dateRangeInitialMin, dateRangeInitialMax]}
                    value={this.state.formValues.timestamp}
                    onChange={this.state.apiFormFieldChangeHandler}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="4" xl="4">
                  <label htmlFor="countries">Países</label>
                  <ApiFormChoiceField
                    name="countries"
                    id="countries"
                    choices={countryOptions}
                    value={this.state.formValues.countries}
                    onChange={this.state.apiFormFieldChangeHandler}/>
                </Col>
                <Col xs="12" sm="6" md="6" lg="4" xl="4">
                  <label htmlFor="stores">Tiendas</label>
                  <ApiFormChoiceField
                    name="stores"
                    id="stores"
                    multiple={true}
                    searchable={true}
                    choices={this.props.stores}
                    value={this.state.formValues.stores}
                    onChange={this.state.apiFormFieldChangeHandler}/>
                </Col>
                <Col xs="12" sm="6" md="6" lg="4" xl="4">
                  <label htmlFor="exclude_unavailable">Ver</label>
                  <ApiFormChoiceField
                    name="exclude_unavailable"
                    id="exclude_unavailable"
                    required={false}
                    choices={excludeUnavailableOptions}
                    placeholder='Todos'
                    value={this.state.formValues.exclude_unavailable}
                    onChange={this.state.apiFormFieldChangeHandler}/>
                </Col>
                <Col xs="12" sm="6" md="6" lg="4" xl="4">
                  <label id="currency_label" htmlFor="currency">Moneda</label>
                  <ApiFormChoiceField
                    name="currency"
                    id="currency"
                    choices={currencyOptions}
                    placeholder='Mantener original'
                    apiField={null}
                    required={false}
                    searchable={false}
                    value={this.state.formValues.currency}
                    onChange={this.state.apiFormFieldChangeHandler}/>
                </Col>
                <Col xs="12" sm="6" md="6" lg="4" xl="4">
                  <label htmlFor="price_type">Tipo precio</label>
                  <ApiFormChoiceField
                    name="price_type"
                    id="price_type"
                    choices={priceTypeOptions}
                    required={true}
                    apiField={null}
                    searchable={false}
                    value={this.state.formValues.price_type}
                    onChange={this.state.apiFormFieldChangeHandler}/>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Card className="d-flex flex-column flex-grow">
            <CardHeader><i className="fa fa-line-chart" aria-hidden="true"/> Gráfico</CardHeader>
            <CardBody className="d-flex flex-column">
              <ProductDetailPricingHistoryChart
                product={this.props.apiResourceObject}
                chart={this.state.chart}/>
            </CardBody>
          </Card>

          <Card className="d-flex flex-column flex-grow">
            <CardHeader><i className="fas fa-inbox"/> SKUs Encontrados</CardHeader>
            <CardBody className="d-flex flex-column">
              <ApiFormResultsTable
                results={this.state.chart && this.state.chart.data}
                columns={columns}
              />
            </CardBody>
          </Card>
        </ApiForm>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {ApiResourceObject} = apiResourceStateToPropsUtils(state);
  const {preferredCurrency} = pricingStateToPropsUtils(state);

  return {
    ApiResourceObject,
    preferredCurrency,
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores'),
    countries: filterApiResourceObjectsByType(state.apiResourceObjects, 'countries'),
    currencies: filterApiResourceObjectsByType(state.apiResourceObjects, 'currencies'),
  }
}

export default connect(mapStateToProps)(ProductDetailPricingHistory);