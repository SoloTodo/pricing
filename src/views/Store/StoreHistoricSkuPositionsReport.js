import React from 'react'
import {connect} from "react-redux";
import moment from "moment";
import {Row, Col, Card, CardHeader, CardBody} from "reactstrap";

import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormSubmitButton,
  ApiFormTextField
} from "../../react-utils/api_forms";

import {filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import ApiFormDateRangeField from "../../react-utils/api_forms/ApiFormDateRangeField";
import {toast} from "react-toastify";

class StoreHistoricSkuPositionsReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      downloadLink: undefined
    }
  }

  setLoading = json => {
    if (json) {
      toast.success('El reporte esta siendo generado. Una vez finalizado este será enviado a su correo.',
        {autoClose: false})
    } else {
      this.setState({
        loading: null
      })
    }
  };

  render() {
    const today = moment.utc().startOf('day');
    const todayMinus30Days = moment.utc().startOf('day').subtract(30, 'days');


    return <ApiForm
      endpoints={[`stores/${this.props.apiResourceObject.id}/historic_entity_positions_report/`]}
      fields={['timestamp', 'categories', 'brands', 'position_threshold', 'submit']}
      onResultsChange={this.setLoading}
      requiresSubmit={true}>
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader>
              <i className="fas fa-search">&nbsp;</i>Filtros
            </CardHeader>
            <CardBody>
              <Row className="api-form-filters">
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Rango de fechas (desde / hasta)</label>
                  <ApiFormDateRangeField
                    name="timestamp"
                    id="timestamp"
                    initial={[todayMinus30Days, today]}/>
                </Col>
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Categorías</label>
                  <ApiFormChoiceField
                    name="categories"
                    multiple={true}
                    choices={this.props.categories}
                    searchable={true}
                    placeholder="Todas"/>
                </Col>
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Marcas</label>
                  <ApiFormChoiceField
                    name="brands"
                    multiple={true}
                    choices={this.props.brands}
                    searchable={true}
                    placeholder="Todas"/>
                </Col>
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Umbral</label>
                  <ApiFormTextField
                    name="position_threshold"
                    debounceTimeout={1}/>
                </Col>
                <Col xs="12" sm="7" md="6" lg="12" xl="12">
                  <label htmlFor="submit">&nbsp;</label>
                  <ApiFormSubmitButton
                    label="Generar"
                    loadingLabel="Generando"
                    loading={this.state.downloadLink === null}/>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </ApiForm>
  }
}

function mapStateToProps(state) {
  return {
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories').filter(category => category.permissions.includes('view_category_entity_positions')),
    brands: filterApiResourceObjectsByType(state.apiResourceObjects, 'brands'),
  }
}

export default connect(mapStateToProps)(StoreHistoricSkuPositionsReport);
