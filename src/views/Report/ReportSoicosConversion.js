import React from 'react'
import {connect} from "react-redux";
import moment from "moment";
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap'

import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormSubmitButton,
  ApiFormDateRangeField
} from "../../react-utils/api_forms";

import {
  filterApiResourceObjectsByType,
} from "../../react-utils/ApiResource";

import {pricingStateToPropsUtils} from "../../utils";


class ReportSoicosConversion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
      downloadLink: undefined
    }
  }

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
    const today = moment.utc().startOf('day');
    const todayMinus30Days = moment.utc().startOf('day').subtract(30, 'days');
    return <Row>
      <Col sm="12">
        <Card>
          <CardHeader>
            <i className="fas fa-search"/>Filtros
          </CardHeader>
          <ApiForm
            endpoints={['reports/soicos_conversions/']}
            fields={['timestamp', 'stores', 'categories', 'websites', 'submit']}
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
                    initial={[todayMinus30Days, today]}
                    value={this.state.formValues.timestamp}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Categoría</label>
                  <ApiFormChoiceField
                    name="categories"
                    choices={this.props.categories}
                    multiple={true}
                    placeholder="Todas"
                    value={this.state.formValues.categories}/>
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
                  <label>Sitios</label>
                  <ApiFormChoiceField
                    name="websites"
                    choices={this.props.websites}
                    multiple={true}
                    placeholder="Todos"
                    value={this.state.formValues.websites}/>
                </Col>

                <Col xs="12" sm="7" md="6" lg="12" xl="12">
                  <label htmlFor="submit"/>
                  <ApiFormSubmitButton
                    value={this.state.formValues.submit}
                    label="Generar"
                    loadingLabel="Generando"
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
    websites: filterApiResourceObjectsByType(state.apiResourceObjects, 'websites')
  }
}

export default connect(mapStateToProps)(ReportSoicosConversion);
