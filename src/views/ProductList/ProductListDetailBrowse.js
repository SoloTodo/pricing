import React from 'react'
import {areObjectsEqual} from "../../react-utils/utils";
import {settings} from "../../settings";
import {ApiForm, ApiFormChoiceField} from "../../react-utils/api_forms";
import {Card, CardBody, CardHeader, Col, Row, UncontrolledCollapse} from "reactstrap";
import LaddaButton, {EXPAND_LEFT} from "react-ladda";
import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {pricingStateToPropsUtils} from "../../utils";
import connect from "react-redux/es/connect/connect";
import CategoryDetailBrowseResult from "../Category/CategoryDetailBrowseResult";

class ProductListDetailBrowse extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      formLayout: undefined,
      apiFormFieldChangeHandler: undefined,
      formValues: {},
      results: undefined,
      columns: undefined,
      loading: false
    };
    this.productList = this.props.ApiResourceObject(this.props.apiResourceObject);
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

  setResults = json => {
    if (json) {
      const products_order = this.productList.entries.map(entry => entry.product.id);
      const results = json.payload.results.sort((a, b) => {
        return products_order.indexOf(a.product.id) - products_order.indexOf(b.product.id)
      });

      const stateChanges = {
        results: results,
        resultsAggs: json.payload.aggs,
      };

      this.setState(stateChanges)
    } else {
      // Only reset the actual results to keep the old filter aggregations
      this.setState({
        results: null
      })
    }
  };

  componentDidMount() {
    this.componentUpdate(this.productList.category, this.props.preferredCountry)
  }

  componentWillReceiveProps(nextProps) {
    const oldCategory = this.props.apiResourceObject;
    const newCategory = nextProps.apiResourceObject;

    const oldPreferredCountry = this.props.preferredCountry;
    const newPreferredCountry = nextProps.preferredCountry;

    if (oldCategory.id !== newCategory.id || !areObjectsEqual(oldPreferredCountry, newPreferredCountry)) {
      this.setState(this.initialState, () => this.componentUpdate(newCategory, newPreferredCountry))
    }
  }

  componentUpdate(category, preferredCountry) {
    // Obtain layout of the form fields
    this.props.fetchAuth(settings.apiResourceEndpoints.category_specs_form_layouts + '?category=' + category.id)
      .then(all_form_layouts => {
        const processed_form_layouts = all_form_layouts
          .map(layout => {
            let priority = 0;
            if (layout.website === settings.ownWebsiteUrl) {
              priority = 2
            } else if (layout.website === null) {
              priority = 1
            }
            return {
              ...layout,
              priority
            }
          });

        processed_form_layouts.sort((a, b) => b.priority - a.priority);

        const formLayout = processed_form_layouts[0] || null;

        if (formLayout && preferredCountry) {
          formLayout.fieldsets = formLayout.fieldsets.map((fieldset, idx) => ({
            id: fieldset.id,
            label: fieldset.label,
            expanded: idx === 0 ? true : undefined,
            filters: fieldset.filters.filter(filter =>
              !filter.country || filter.country === preferredCountry.url
            )
          }))
        }

        this.setState({
          formLayout: formLayout,
        })
      });

    // Obtain columns for the results

    const columnEndpoints = `${settings.apiResourceEndpoints.category_columns}?categories=${category.id}&purposes=${settings.categoryBrowsePurposeId}`;
    this.props.fetchAuth(columnEndpoints)
      .then(json => {
        const filteredColumns = preferredCountry ?
          json.filter(column => !column.country || column.country === preferredCountry.url) :
          json;

        this.setState({
          columns: filteredColumns
        })
      })
  }

  apiEndpoint = () => {
    const products = this.productList.entries.map(entry => entry.product.id);
    let endpointFilters = '?';
    for (const product of products) {
      endpointFilters += 'products=' + product + '&'
    }
    return `categories/${this.productList.category.id}/full_browse/${endpointFilters}`;
  };

  handleReportButtonClick = (e) => {
    e.preventDefault();
    this.setState({
      loading: true,
    });

    let apiSearch = '';
    const endpoint = `reports/current_prices?category=${this.productList.category.id}`;
    for (const fieldName of Object.keys(this.fieldsData)) {
      for (const apiParamKey of Object.keys(this.fieldsData[fieldName].apiParams)) {
        for (const apiParamValue of this.fieldsData[fieldName].apiParams[apiParamKey]) {
          apiSearch += `${apiParamKey}=${apiParamValue}&`
        }
      }
    }

    const products = this.productList.entries.map(entry => entry.product.id);
    let endpointFilters = '';
    for (const product of products) {
      endpointFilters += 'products=' + product + '&'
    }

    console.log(endpoint);
    console.log(endpointFilters);
    console.log(apiSearch);

    this.props.fetchAuth(`${endpoint}&${endpointFilters}&${apiSearch}`)
      .then(json => {
        window.location = json.url;
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    return (
      <ApiForm
        endpoints={[this.apiEndpoint()]}
        fields={['stores']}
        onResultsChange={this.setResults}
        onFormValueChange={this.handleFormValueChange}
        setFieldChangeHandler={this.setApiFormFieldChangeHandler}>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader id="pricing-parameters">
                <i className="fas fa-search"/>Parámetros Pricing
              </CardHeader>
              <UncontrolledCollapse toggler="#pricing-parameters">
                <CardBody>
                  <Row className="api-form-filters">
                    <Col xs="12" sm="6" md="6" lg="6" xl="6">
                      <label htmlFor="stores">Tiendas</label>
                      <ApiFormChoiceField
                        name="stores"
                        id="stores"
                        choices={this.props.stores}
                        multiple={true}
                        searchable={!this.props.isExtraSmall}
                        onChange={this.state.apiFormFieldChangeHandler}
                        placeholder="Todas"/>
                    </Col>
                  </Row>
                </CardBody>
              </UncontrolledCollapse>
            </Card>
          </Col>
        </Row>
        <Row className="row">
          <Col sm="12">
            <Card>
              <CardHeader className="d-flex justify-content-between">
                <span><i className="fas fa-list"/> Resultados </span>
                <LaddaButton
                  loading={this.state.loading}
                  onClick={this.handleReportButtonClick}
                  data-style={EXPAND_LEFT}
                  className="btn btn-primary">
                  {this.state.loading? 'Generando': 'Descargar'}
                </LaddaButton>
              </CardHeader>
              <CardBody>
                <CategoryDetailBrowseResult
                  data={this.state.results}
                  specsColumns={this.state.columns}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ApiForm>
    )
  }
}

function mapStateToProps(state) {
  const {ApiResourceObject, fetchAuth} = apiResourceStateToPropsUtils(state);
  const {preferredCountry, preferredCurrency, preferredNumberFormat, formatCurrency} = pricingStateToPropsUtils(state);

  return {
    ApiResourceObject,
    fetchAuth,
    preferredCountry,
    preferredCurrency,
    preferredNumberFormat,
    formatCurrency,
    currencies: filterApiResourceObjectsByType(state.apiResourceObjects, 'currencies'),
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores'),
    isExtraSmall: state.browser.is.extraSmall
  }
}

export default connect(mapStateToProps)(ProductListDetailBrowse);