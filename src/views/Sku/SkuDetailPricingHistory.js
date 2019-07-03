import React from 'react';
import {connect} from "react-redux";
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap'
import {
  apiResourceStateToPropsUtils,
  filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";
import moment from 'moment';
import {
  ApiForm,
  ApiFormDateRangeField,
  ApiFormChoiceField,
} from '../../react-utils/api_forms'
import SkuDetailPricingHistoryChart from "./SkuDetailPricingHistoryChart";
import {UncontrolledTooltip} from "reactstrap";
import {pricingStateToPropsUtils} from "../../utils";

class SkuDetailPricingHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
      chart: undefined
    }
  }

  handleFormValueChange = formValues => {
    this.setState({formValues})
  };

  setChartData = (bundle) => {
    if (!bundle) {
      this.setState({
        chart: null
      });
      return;
    }

    const data = bundle.payload;

    this.setState({
      chart: {
        startDate: bundle.fieldValues.timestamp.startDate,
        endDate: bundle.fieldValues.timestamp.endDate,
        currency: bundle.fieldValues.currency,
        data: data
      }
    });
  };

  render() {
    const entity = this.props.ApiResourceObject(this.props.apiResourceObject);

    const entityCreationDate = moment.utc(entity.creationDate).startOf('day');
    const todayMinus30Days = moment.utc().startOf('day').subtract(30, 'days');

    let dateRangeInitialMin = entityCreationDate;
    if (entityCreationDate.isBefore(todayMinus30Days)) {
      dateRangeInitialMin = todayMinus30Days;
    }


    const dateRangeInitialMax = moment.utc().startOf('day');

    const currencyOptions = this.props.currencies.map(currency => {
      let priority = 3;
      let name = currency.name;

      if (currency.id === entity.currency.id) {
        priority = 1;
        name += ' (default)'
      } else if (currency.id === this.props.preferredCurrency.id) {
        priority = 2
      }

      return {
        ...currency,
        name: name,
        priority: priority
      }
    });

    currencyOptions.sort((a, b) => a.priority - b.priority);

    return (
        <div className="d-flex flex-column">
          <UncontrolledTooltip placement="top" target="timestamp_label">
            Rango de fechas. El valor mínimo es la fecha de detección del sku ({moment(entity.creationDate).format('ll')})
          </UncontrolledTooltip>
          <UncontrolledTooltip placement="top" target="currency_label">
            Los datos de precio son convertidos a esta moneda usando tasas de cambio estándar
          </UncontrolledTooltip>
          <ApiForm
              endpoints={[entity.url + 'pricing_history/']}
              fields={['timestamp', 'currency']}
              onResultsChange={this.setChartData}
              onFormValueChange={this.handleFormValueChange}>
            <Card>
              <CardHeader>Filtros</CardHeader>
              <CardBody>
                <Row className="api-form-filters">
                  <Col sm="12" md="12" lg="8" xl="6">
                    <label id="timestamp_label" className="dashed" htmlFor="timestamp">
                      Rango de Fechas (desde / hasta)
                    </label>
                    <ApiFormDateRangeField
                        name="timestamp"
                        id="timestamp"
                        label={'Rango de fechas (desde / hasta)'}
                        min={entityCreationDate}
                        initial={[dateRangeInitialMin, dateRangeInitialMax]}
                        value={this.state.formValues.timestamp}/>
                  </Col>
                  <Col xs="12" sm="6" md="6" lg="4" xl="4">
                    <label id="currency_label" className="dashed" htmlFor="currency">
                      Moneda
                    </label>
                    <ApiFormChoiceField
                        name="currency"
                        id="currency"
                        label="Moneda"
                        choices={currencyOptions}
                        required={true}
                        searchable={false}
                        value={this.state.formValues.currency}/>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Card className="d-flex flex-column flex-grow">
              <CardHeader className="card-header">
                Resultado
              </CardHeader>
              <CardBody className="d-flex flex-column">
                <SkuDetailPricingHistoryChart
                    entity={this.props.apiResourceObject}
                    chart={this.state.chart}/>
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
    currencies: filterApiResourceObjectsByType(state.apiResourceObjects, 'currencies'),
  }
}

export default connect(mapStateToProps)(SkuDetailPricingHistory);