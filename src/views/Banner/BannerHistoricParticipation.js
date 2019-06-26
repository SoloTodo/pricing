import React from 'react'
import {connect} from 'react-redux';
import moment from 'moment/moment';
import {Row, Col, Card, CardHeader, CardBody, CardFooter} from 'reactstrap'

import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormDateRangeField,
  ApiFormSubmitButton
} from '../../react-utils/api_forms';

import {
  apiResourceStateToPropsUtils,
  filterApiResourceObjectsByType
} from '../../react-utils/ApiResource';

class BannerHistoricParticipation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      downloadLink: undefined
    }
  }

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
    const groupingFields = [
      {id: 'brand', name: 'Marca'},
      {id: 'category', name: 'Categoría'},
      {id: 'store', name: 'Tienda'},
      {id: 'section', name: 'Section'},
      {id: 'subsection_type', name: 'Tipo subsección'}
    ];
    const stores = this.props.stores.filter(store => store.permissions.includes('view_store_banners'));

    return <ApiForm
      endpoints={[`banners/historic_active_participation`]}
      fields={['timestamp', 'grouping_field', 'stores', 'brands', 'categories', 'sections', 'subsection_types', 'submit']}
      onResultsChange={this.setDownloadLink}
      requiresSubmit={true}>
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader><i className="fas fa-search"/> Filtros</CardHeader>
            <CardBody>
              <Row className="api-form-filters">
                <Col xs="12" sm="6">
                  <label>Rango de fechas (desde / hasta)</label>
                  <ApiFormDateRangeField
                    name="timestamp"
                    id="timestamp"
                    initial={[todayMinus30Days, today]}/>
                </Col>
                <Col xs="12" sm="6">
                  <label>Agrupar por</label>
                  <ApiFormChoiceField
                    name="grouping_field"
                    choices={groupingFields}
                    required={true}
                    placeholder='Todas'/>
                </Col>
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Tiendas</label>
                  <ApiFormChoiceField
                    name="stores"
                    multiple={true}
                    choices={stores}
                    placeholder='Todas'/>
                </Col>
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Secciones</label>
                  <ApiFormChoiceField
                    name="sections"
                    multiple={true}
                    choices={this.props.sections}
                    placeholder='Todas'/>
                </Col>
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Tipo</label>
                  <ApiFormChoiceField
                    name="subsection_types"
                    multiple={true}
                    choices={this.props.subsection_types}
                    placeholder='Todas'/>
                </Col>
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Marcas</label>
                  <ApiFormChoiceField
                    name="brands"
                    multiple={true}
                    choices={this.props.brands}
                    placeholder='Todas'/>
                </Col>
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Categorías</label>
                  <ApiFormChoiceField
                    name="categories"
                    multiple={true}
                    choices={this.props.categories}
                    placeholder='Todas'/>
                </Col>
              </Row>
            </CardBody>
            <CardFooter className="d-flex justify-content-end">
              <ApiFormSubmitButton
                label="Generar"
                loadingLabel="Generando"
                loading={this.state.downloadLink === null}/>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </ApiForm>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  return {
    fetchAuth,
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores'),
    brands: filterApiResourceObjectsByType(state.apiResourceObjects, 'brands'),
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories'),
    sections: filterApiResourceObjectsByType(state.apiResourceObjects, 'banner_sections'),
    subsection_types: filterApiResourceObjectsByType(state.apiResourceObjects, 'banner_subsection_types'),
  }
}

export default connect(mapStateToProps)(BannerHistoricParticipation);