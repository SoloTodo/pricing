import React from 'react'
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import moment from "moment";
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap'

import {
  apiResourceStateToPropsUtils,
  filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";
import {
  ApiForm,
  ApiFormDateRangeField
} from "../../react-utils/api_forms";

import SkuDetailPositionHistoryChart from './SkuDetailPositionHistoryChart'

class SkuDetailPositionHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chart: undefined,
    }
  }

  userHasPositionPermissions = entity => {
    const store = this.props.stores.filter(store => store.url === entity.store)[0];
    const category = this.props.categories.filter(category => category.url === entity.category)[0];

    return store.permissions.includes('view_store_entity_positions')
      && category.permissions.includes('view_category_entity_positions')
  };

  setChartData = json => {
    if (!json) {
      this.setState({
        chart: null
      });
      return;
    }

    const data = json.payload;

    this.setState({
      chart: {
        startDate: json.fieldValues.timestamp.startDate,
        endDate: json.fieldValues.timestamp.endDate,
        data: data
      }
    })
  };

  render() {
    const entity = this.props.apiResourceObject;

    if (!this.userHasPositionPermissions(entity)) {
      return <Redirect to={`/skus/${entity.id}`}/>
    }

    const dateRangeInitialMin = moment().startOf('day').subtract(30, 'days');
    const dateRangeInitialMax = moment().startOf('day');

    return <ApiForm
      endpoints={[`${entity.url}position_history/`]}
      fields={['timestamp']}
      onResultsChange={this.setChartData}>
      <Card>
        <CardHeader><i className="fa fa-filter"/> Filtros</CardHeader>
        <CardBody>
          <Row className="api-form-filters">
            <Col sm="12" md="12" lg="8" xl="4">
              <label htmlFor="timestamp">Rango fechas (desde / hasta)</label>
              <ApiFormDateRangeField
                name="timestamp"
                id="timestamps"
                initial={[dateRangeInitialMin, dateRangeInitialMax]}/>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card className="d-flex flex-column flex-grow">
        <CardHeader><i className="fa fa-line-chart" aria-hidden="true"/> Gráfico</CardHeader>
        <CardBody className="d-flex flex-column">
        <SkuDetailPositionHistoryChart
          chart={this.state.chart}
          entity={entity}/>
        </CardBody>
      </Card>
    </ApiForm>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories'),
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores')
  }
}

export default connect(mapStateToProps)(SkuDetailPositionHistory);