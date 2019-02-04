import React from 'react'
import {
  apiResourceStateToPropsUtils,
  filterApiResourceObjectsByType,
} from "../../react-utils/ApiResource";
import connect from "react-redux/es/connect/connect";
import {Row, Col, Card, CardHeader, CardBody, UncontrolledCollapse} from 'reactstrap'
import {settings} from "../../settings";
import {FormattedMessage} from "react-intl";
import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormTextField,
  ApiFormDiscreteRangeField,
  ApiFormContinuousRangeField,
  ApiFormPriceRangeField
} from "../../react-utils/api_forms";

import {Redirect} from "react-router-dom";
import { toast } from 'react-toastify';
import {
  pricingStateToPropsUtils
} from "../../utils";
import {areObjectsEqual} from "../../react-utils/utils";
import CategoryDetailShareOfShelvesChart from "./CategoryDetailShareOfShelvesChart";
import {Accordion, AccordionItem} from "react-sanfona";
import './CategoryDetailBrowse.css'
import LaddaButton, {EXPAND_LEFT} from "react-ladda"



class CategoryDetailShareOfShelves extends React.Component {
  initialState = {
    formLayout: undefined,
    apiFormFieldChangeHandler: undefined,
    formValues: {},
    results: undefined,
    resultsAggs: {},
    priceRange: undefined,
    columns: undefined,
    specsFiltersModelOpen: false
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.initialState,
      loading: false
    };
    this.fieldsData = {};
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
      const stateChanges = {
        results: json.payload.results,
        resultsAggs: json.payload.aggs,
      };

      if (!this.state.priceRange) {
        stateChanges.priceRange = {
          min: Math.floor(parseFloat(json.payload.price_ranges.normal_price_usd.min)),
          max: Math.ceil(parseFloat(json.payload.price_ranges.normal_price_usd.max)),
          p80th: Math.floor(parseFloat(json.payload.price_ranges.normal_price_usd['80th']))
        }
      }

      this.setState(stateChanges)
    } else {
      // Only reset the actual results to keep the old filter aggregations
      this.setState({
        results: null
      })
    }
  };

  componentDidMount() {
    this.componentUpdate(this.props.apiResourceObject, this.props.preferredCountry)
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
    return `categories/${this.props.apiResourceObject.id}/browse/`;
  };

  handleFieldsetChange = (fieldset, expanded) => {
    const newFieldsets = this.state.formLayout.fieldsets.map(stateFieldset => {
      const newExpanded = stateFieldset.id === fieldset.id ? expanded : stateFieldset.expanded;

      return {
        ...stateFieldset,
        expanded: newExpanded
      }
    });

    this.setState({
      formLayout: {
        ...this.state.formLayout,
        fieldsets: newFieldsets
      }
    })
  };

  handleReportButtonClick = (e) => {
    e.preventDefault();
    this.setState({
      loading: true,
    });

    let apiSearch = '';
    const endpoint = `reports/current_prices?category=${this.props.apiResourceObject.id}`;
    for (const fieldName of Object.keys(this.fieldsData)) {
      for (const apiParamKey of Object.keys(this.fieldsData[fieldName].apiParams)) {
        for (const apiParamValue of this.fieldsData[fieldName].apiParams[apiParamKey]) {
          apiSearch += `${apiParamKey}=${apiParamValue}&`
        }
      }
    }

    this.props.fetchAuth(`${endpoint}&${apiSearch}`)
      .then(json => {
        window.location = json.url;
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    const formLayout = this.state.formLayout;

    if (typeof(formLayout) === 'undefined' || !this.state.columns) {
      return <div/>
    }

    if (formLayout === null) {
      toast.warn(<FormattedMessage id="category_no_search_form" defaultMessage="No search form has been defined for this category"/>);

      return <Redirect to={{
        pathname: `/categories/${this.props.apiResourceObject.id}`,
      }} />
    }

    const resultsAggs = this.state.resultsAggs;

    const currenciesDict = {};
    for (const currency of this.props.currencies) {
      currenciesDict[currency.url] = this.props.ApiResourceObject(currency)
    }

    const usdCurrency = this.props.currencies.filter(currency => currency.url === settings.usdCurrencyUrl)[0];

    const apiFormFields = ['stores', 'countries', 'store_types', 'normal_price_usd', 'search'];
    const processedFormLayout = [
      {
        id: 'normal_price',
        label:<legend>Precio Normal</legend>,
        expanded: true,
        filters: [{
          name: 'normal_price_usd',
          component: <ApiFormPriceRangeField
            name="normal_price_usd"
            onChange={this.state.apiFormFieldChangeHandler}
            min={this.state.priceRange && this.state.priceRange.min}
            max={this.state.priceRange && this.state.priceRange.max}
            p80th={this.state.priceRange && this.state.priceRange.p80th}
            currency={usdCurrency}
            conversionCurrency={this.props.preferredCurrency}
            numberFormat={this.props.preferredNumberFormat}
          />
        }]
      },
      {
        id: 'keywords',
        label: <legend>Palabras clave</legend>,
        expanded: true,
        filters: [{
          name: 'search',
          component: <ApiFormTextField
            name="search"
            placeholder={<FormattedMessage id="keywords" defaultMessage="Keywords" />}
            onChange={this.state.apiFormFieldChangeHandler}
            debounceTimeout={2000}
          />
        }]
      }
    ];

    for (const fieldset of formLayout.fieldsets) {
      const fieldSetFilters = [];
      for (const filter of fieldset.filters) {
        apiFormFields.push(filter.name);

        const filterChoiceIdToNameDict = {};
        let originalFilterChoices = undefined;

        if (filter.type === 'exact') {
          originalFilterChoices = filter.choices || [{id: 0, name: 'No'}, {id: 1, name: 'Sí'}]
        } else {
          originalFilterChoices = filter.choices || []
        }

        for (const choice of originalFilterChoices) {
          filterChoiceIdToNameDict[choice.id] = choice.name;
        }

        const filterDocCountsDict = {};

        let filterAggs = [];
        const rawFilterAggs = resultsAggs[filter.name];

        if (rawFilterAggs) {
          for (const filterDocCount of rawFilterAggs) {
            filterDocCountsDict[filterDocCount.id] = filterDocCount.doc_count
          }

          for (const choice of originalFilterChoices) {
            const choiceDocCount = filterDocCountsDict[choice.id];

            if (!choiceDocCount) {
              continue
            }

            filterAggs.push({
              ...choice,
              doc_count: choiceDocCount
            })
          }
        } else {
          filterAggs = originalFilterChoices
        }

        let filterComponent = null;

        if (filter.type === 'exact') {
          let filterChoices = undefined;
          const value = this.state.formValues[filter.name];

          let arrayValue = [];
          if (Array.isArray(value)) {
            arrayValue = value
          } else if (value) {
            arrayValue = [value]
          } else {
            arrayValue = null
          }

          if (filterAggs) {
            filterChoices = filterAggs.map(choice => ({
              ...choice,
              name: filterChoiceIdToNameDict[choice.id],
            }));

            if (arrayValue) {
              for (const selectedValue of arrayValue) {
                let valueInChoices = Boolean(filterChoices.filter(choice => choice.id.toString() === selectedValue.id.toString()).length);
                if (!valueInChoices) {
                  filterChoices.push({
                    ...selectedValue,
                    doc_count: 0
                  })
                }
              }
            }
          } else {
            filterChoices = originalFilterChoices
          }

          filterComponent = <ApiFormChoiceField
            name={filter.name}
            choices={filterChoices}
            placeholder={filter.label}
            searchable={true}
            onChange={this.state.apiFormFieldChangeHandler}
            multiple={Boolean(filter.choices)}
          />
        } else if (filter.type === 'lte') {
          let filterChoices = undefined;

          if (filterAggs) {
            let ongoingResultCount = 0;

            filterChoices = filterAggs.map(choice => {
              ongoingResultCount += choice.doc_count;

              return {
                ...choice,
                name: `${filterChoiceIdToNameDict[choice.id]}`,
                doc_count: ongoingResultCount
              };
            });
          } else {
            filterChoices = originalFilterChoices
          }

          filterComponent = <ApiFormChoiceField
            name={filter.name}
            apiField={filter.name + '_1'}
            urlField={filter.name + '_end'}
            choices={filterChoices}
            placeholder={filter.label}
            searchable={true}
            onChange={this.state.apiFormFieldChangeHandler}
          />
        } else if (filter.type === 'gte') {
          let filterChoices = undefined;

          if (filterAggs) {
            let totalResultCount = filterAggs.reduce((acum, elem) => acum + elem.doc_count, 0);

            filterChoices = filterAggs.map(choice => {
              let result = {
                ...choice,
                name: `${filterChoiceIdToNameDict[choice.id]}`,
                doc_count: totalResultCount
              };

              totalResultCount -= choice.doc_count;

              return result
            });
          } else {
            filterChoices = originalFilterChoices
          }

          filterComponent = <ApiFormChoiceField
            name={filter.name}
            apiField={filter.name + '_0'}
            urlField={filter.name + '_start'}
            choices={filterChoices}
            placeholder={filter.label}
            searchable={true}
            onChange={this.state.apiFormFieldChangeHandler}
          />
        } else if (filter.type === 'range') {
          if (filter.continuous_range_step) {
            // Continous (weight....)

            filterComponent = <ApiFormContinuousRangeField
              name={filter.name}
              label={filter.label}
              onChange={this.state.apiFormFieldChangeHandler}
              choices={rawFilterAggs}
              step={filter.continuous_range_step}
              unit={filter.continuous_range_unit}
              resultCountSuffix={<FormattedMessage id="results_lower_case" defaultMessage="results" />}
            />
          } else {
            // Discrete (screen size...)
            let filterChoices = undefined;

            if (filterAggs) {
              filterChoices = filterAggs.map(choice => ({
                ...choice,
                label: `${filterChoiceIdToNameDict[choice.id]}`,
              }));
            } else {
              filterChoices = originalFilterChoices.map(choice => ({
                ...choice,
                label: choice.name,
                value: parseFloat(choice.value)
              }))
            }

            filterComponent = <ApiFormDiscreteRangeField
              name={filter.name}
              label={filter.label}
              onChange={this.state.apiFormFieldChangeHandler}
              choices={filterChoices}
              resultCountSuffix={<FormattedMessage id="results_lower_case" defaultMessage="results" />}
            />
          }
        }

        fieldSetFilters.push({
          ...filter,
          component: filterComponent,
        })
      }

      processedFormLayout.push({
        label: fieldset.label,
        filters: fieldSetFilters
      })
    }

    const filtersComponent = <Accordion allowMultiple={true}>
      {processedFormLayout.map(fieldset => (
        <AccordionItem
          key={fieldset.id || fieldset.label}
          title={fieldset.label}
          expanded={fieldset.expanded}
          titleTag={'legend'}
          onExpand={() => this.handleFieldsetChange(fieldset, true)}
          onClose={() => this.handleFieldsetChange(fieldset, false)}>
          {fieldset.filters.map(filter => (
            <div key={filter.name} className="pt-2">
              {filter.component}
            </div>
          ))}
        </AccordionItem>
      ))}
    </Accordion>;

    const countryUrls = this.props.stores.map(store => store.country);
    const countries = this.props.countries.filter(country => countryUrls.includes(country.url));

    const storeTypeUrls = this.props.stores.map(store => store.type);
    const storeTypes = this.props.storeTypes.filter(storeType => storeTypeUrls.includes(storeType.url));

    let brandChoices = undefined;

    for (const fieldset of this.state.formLayout.fieldsets) {
      const brand_filter = fieldset.filters.filter(filter => filter.name === 'brands');
      if (brand_filter.length) {
        brandChoices = brand_filter[0].choices;
        break;
      }
    }

    return (
      <ApiForm
        endpoints={[this.apiEndpoint()]}
        fields={apiFormFields}
        onResultsChange={this.setResults}
        onFormValueChange={this.handleFormValueChange}
        setFieldChangeHandler={this.setApiFormFieldChangeHandler}>
        <Row>
          <Col sm="12" md="6" lg="8" xl="8">
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
                    <Col xs="12" sm="6" md="6" lg="6" xl="6">
                      <label htmlFor="countries">Países</label>
                      <ApiFormChoiceField
                        name="countries"
                        id="countries"
                        choices={countries}
                        multiple={true}
                        onChange={this.state.apiFormFieldChangeHandler}
                        placeholder="Todos"/>
                    </Col>
                    <Col xs="12" sm="6" md="6" lg="6" xl="6">
                      <label htmlFor="store_types">Tipos</label>
                      <ApiFormChoiceField
                        name="store_types"
                        id="store_types"
                        choices={storeTypes}
                        multiple={true}
                        onChange={this.state.apiFormFieldChangeHandler}
                        placeholder="Todos"/>
                    </Col>
                  </Row>
                </CardBody>
              </UncontrolledCollapse>
            </Card>
          </Col>
          <Col sm="12" md="6" lg="4" xl="4">
            <Card>
              <CardHeader id="filters"><i className="fas fa-search"/> Filtros</CardHeader>
              <UncontrolledCollapse toggler="#filters">
                <CardBody id="category-browse-filters">
                  {filtersComponent}
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
                <LaddaButton loading={this.state.loading}
                             onClick={this.handleReportButtonClick}
                             data-style={EXPAND_LEFT}
                             className="btn btn-primary">
                  {this.state.loading? 'Generando': 'Descargar'}
                </LaddaButton>
              </CardHeader>
              <CardBody>
                <CategoryDetailShareOfShelvesChart data={this.state.resultsAggs} brandChoices={brandChoices}/>
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
    storeTypes: filterApiResourceObjectsByType(state.apiResourceObjects, 'store_types'),
    countries: filterApiResourceObjectsByType(state.apiResourceObjects, 'countries'),
    isExtraSmall: state.browser.is.extraSmall
  }
}

export default connect(mapStateToProps)(CategoryDetailShareOfShelves);
