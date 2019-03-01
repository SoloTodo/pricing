import React from 'react'
import {connect} from "react-redux";
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap'
import {ApiForm, ApiFormChoiceField, ApiFormResultsTable} from "../../react-utils/api_forms";
import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import BannerActiveParticipationChart from './BannerActiveParticipationChart'
import LaddaButton, {EXPAND_LEFT} from "react-ladda"


class BannerActiveParticipation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      apiFormFieldChangeHandler: undefined,
      participation: undefined,
      loading: false,
    };
    this.fieldsData = {}
  }

  apiFormFieldChangeHandlerDecorator = apiFormFieldChangeHandler => {
    return (updatedFieldsData={}, pushUrl) => {
      this.fieldsData = {
        ...this.fieldsData,
        ...updatedFieldsData
      };
      apiFormFieldChangeHandler(updatedFieldsData, pushUrl)
    }
  };

  setApiFormFieldChangeHandler = apiFormFieldChangeHandler => {
    this.setState({
      apiFormFieldChangeHandler: this.apiFormFieldChangeHandlerDecorator(apiFormFieldChangeHandler)
    })
  };

  handleFormValueChange = formValues => {
    this.setState({formValues})
  };

  setParticipation = json => {
    this.setState({
      participation: json ? json.payload : null
    });
  };

  handleReportButtonClick = e => {
    e.preventDefault();
    this.setState({
      loading: true,
    });

    let apiSearch = '';
    const endpoint = `banners/active_participation/?response_format=xls`;
    for (const fieldName of Object.keys(this.fieldsData)) {
      for (const apiParamKey of Object.keys(this.fieldsData[fieldName].apiParams)) {
        for (const apiParamValue of this.fieldsData[fieldName].apiParams[apiParamKey]) {
          apiSearch += `${apiParamKey}=${apiParamValue}&`
        }
      }
    }
    this.props.fetchAuth(`${endpoint}&${apiSearch}`).then(json => {
      window.location = json.url;
      this.setState({
        loading: false,
      });
    });
  };

  render() {
    const groupingFields = [
      {id: 'brand', name: 'Marca'},
      {id: 'category', name: 'Categoría'},
      {id: 'store', name: 'Tienda'},
      {id: 'section', name: 'Section'},
      {id: 'subsection_type', name: 'Tipo subsección'}
    ];

    const active_grouping = this.state.formValues.grouping_field;

    const columns = [
      {
        label: active_grouping? active_grouping.name : '',
        renderer: result => result.groupingLabel
      },
      {
        label: 'Participación (puntaje)',
        renderer: result => result.participationScore
      },
      {
        label: 'Participación (%)',
        renderer: result => (result.participationPercentage).toFixed(2)
      },
      {
        label: 'Posición promedio',
        renderer: result => (result.positionAvg).toFixed(2)
      }
    ];

    const stores = this.props.stores.filter(store => store.permissions.includes('view_store_banners'));

    return <div>
      <ApiForm
        endpoints={["banners/active_participation/"]}
        fields={['grouping_field', 'stores', 'brands', 'categories', 'sections']}
        onResultsChange={this.setParticipation}
        onFormValueChange={this.handleFormValueChange}
        setFieldChangeHandler={this.setApiFormFieldChangeHandler}>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader><i className="fas fa-search">&nbsp;</i>Filtros</CardHeader>
              <CardBody>
                <Row className="api-form-filters">
                  <Col xs="12" sm="6" md="6" lg="6" xl="6">
                    <label>Tiendas</label>
                    <ApiFormChoiceField
                      name="stores"
                      multiple={true}
                      choices={stores}
                      placeholder='Todas'
                      onChange={this.state.apiFormFieldChangeHandler}
                      value={this.state.formValues.stores}
                    />
                  </Col>
                  <Col xs="12" sm="6" md="6" lg="6" xl="6">
                    <label>Secciones</label>
                    <ApiFormChoiceField
                      name="sections"
                      multiple={true}
                      choices={this.props.sections}
                      placeholder='Todas'
                      onChange={this.state.apiFormFieldChangeHandler}
                      value={this.state.formValues.banner_sections}
                    />
                  </Col>
                  <Col xs="12" sm="6" md="6" lg="6" xl="6">
                    <label>Tipo</label>
                    <ApiFormChoiceField
                      name="subsection_types"
                      multiple={true}
                      choices={this.props.subsection_types}
                      placeholder='Todas'
                      onChange={this.state.apiFormFieldChangeHandler}
                      value={this.state.formValues.subsection_types}
                    />
                  </Col>
                  <Col xs="12" sm="6" md="6" lg="6" xl="6">
                    <label>Marcas</label>
                    <ApiFormChoiceField
                      name="brands"
                      multiple={true}
                      choices={this.props.brands}
                      placeholder='Todas'
                      onChange={this.state.apiFormFieldChangeHandler}
                      value={this.state.formValues.brands}
                    />
                  </Col>
                  <Col xs="12" sm="6" md="6" lg="6" xl="6">
                    <label>Categorías</label>
                    <ApiFormChoiceField
                      name="categories"
                      multiple={true}
                      choices={this.props.categories}
                      placeholder='Todas'
                      onChange={this.state.apiFormFieldChangeHandler}
                      value={this.state.formValues.categories}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ApiForm>
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              Participación
              <LaddaButton loading={this.state.loading}
                           onClick={this.handleReportButtonClick}
                           data-style={EXPAND_LEFT}
                           className="btn btn-primary">
                {this.state.loading? 'Generando': 'Descargar'}
              </LaddaButton>
            </CardHeader>
            <CardBody>
              <Row>
                <Col sm="6">
                  <label>Agrupar por</label>
                  <ApiFormChoiceField
                    name="grouping_field"
                    choices={groupingFields}
                    required={true}
                    placeholder='Todas'
                    onChange={this.state.apiFormFieldChangeHandler}
                    value={this.state.formValues.stores}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm="6">
                  <BannerActiveParticipationChart data={this.state.participation}/>
                </Col>
                <Col sm="6">
                  <br/>
                  <ApiFormResultsTable
                    results={this.state.participation}
                    columns={columns}
                    onChange={this.state.apiFormFieldChangeHandler}/>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
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

export default connect(mapStateToProps)(BannerActiveParticipation);