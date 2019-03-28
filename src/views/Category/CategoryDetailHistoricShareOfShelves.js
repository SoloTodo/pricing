import React from 'react'
import {connect} from "react-redux"
import moment from "moment/moment";
import {Row, Col, Card, CardHeader, CardBody} from "reactstrap"
import {Accordion, AccordionItem} from "react-sanfona";

import {
  apiResourceStateToPropsUtils,
  filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";
import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormSubmitButton,
  ApiFormDateRangeField
} from "../../react-utils/api_forms";

import {settings} from "../../settings";
import {pricingStateToPropsUtils} from "../../utils";
import {getProcessedForm, getBucketingOptions} from "./CategoryDetailShareOfShelves";

class CategoryDetailHistoricShareOfShelves extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
      apiFormFieldChangeHandler: undefined,
      downloadLink: undefined
    }
  }

  componentDidMount() {
    const category = this.props.apiResourceObject

    this.props.fetchAuth(settings.apiResourceEndpoints.category_specs_form_layouts  + '?category=' + category.id)
      .then(all_form_layouts => {
        const processed_form_layouts = all_form_layouts.map(layout => {
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

        processed_form_layouts.sort((a,b) => b.priority - a.priority);
        const formLayout = processed_form_layouts[0] || null;

        if (formLayout && this.props.preferredCountry) {
          formLayout.fieldsets = formLayout.fieldsets.map((fieldset, idx) => ({
            id: fieldset.id,
            label: fieldset.label,
            expanded: idx === 0 ? true : undefined,
            filters: fieldset.filters.filter(filter =>
              !filter.country || filter.country === this.props.preferredCountry.url
            )
          }))
        }
        this.setState({
          formLayout: formLayout,
        })
      })
  }

  setApiFormFieldChangeHandler = apiFormFieldChangeHandler => {
    this.setState({
      apiFormFieldChangeHandler
    })
  };

  handleFormValueChange = formValues => {
    this.setState({formValues})
  };

  setDownloadLink = json => {
    console.log(json);
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

  render() {
    const category = this.props.apiResourceObject;
    const today = moment().startOf('day');
    const todayMinus30Days = moment().startOf('day').subtract(30, 'days');

    const formLayout = this.state.formLayout;

    if (typeof(formLayout) === 'undefined') {
      return <div>Loading</div>
    }

    const usdCurrency = this.props.currencies.filter(currency => currency.url === settings.usdCurrencyUrl)[0];

    const [processedFormLayout, apiFormFields] = getProcessedForm(
      formLayout,
      this.state,
      usdCurrency,
      this.props.preferredCurrency,
      this.props.preferredNumberFormat);

    apiFormFields.push('timestamp', 'stores', 'countries', 'bucketing_field', 'submit');

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

    const bucketingOptions = getBucketingOptions(this.state.formLayout);

    return <Row>
      <Col sm="12" md="6" lg="8" xl="8">
        <Card>
          <CardHeader>
            <i className="fas fa-search"/> Filtros
          </CardHeader>
          <ApiForm
            endpoints={[`categories/${category.id}/historic_share_of_shelves/`]}
            fields={['timestamp', 'stores', 'countries', 'submit']}
            onResultsChange={this.setDownloadLink}
            onFormValueChange={this.handleFormValueChange}
            setFieldChangeHandler={this.setApiFormFieldChangeHandler}
            requiresSubmit={true}>
            <CardBody>
              <Row className='api-form-filters'>
                <Col xs="12" sm="6">
                  <label>Rango de fechas (desde / hasta)</label>
                  <ApiFormDateRangeField
                    name="timestamp"
                    id="timestamp"
                    initial={[todayMinus30Days, today]}
                    value={this.state.formValues.timestamp}
                    onChange={this.state.apiFormFieldChangeHandler}/>
                </Col>
                <Col xs="12" sm="6">
                  <label>Tiendas</label>
                  <ApiFormChoiceField
                    name="stores"
                    choices={this.props.stores}
                    multiple={true}
                    placeholder="Todas"
                    searchable={true}
                    value={this.state.formValues.stores}
                    onChange={this.state.apiFormFieldChangeHandler}/>
                </Col>
                <Col xs="12" sm="6">
                  <label>Países</label>
                  <ApiFormChoiceField
                    name="countries"
                    choices={this.props.countries}
                    multiple={true}
                    placeholder="Todos"
                    searchable={true}
                    value={this.state.formValues.countries}
                    onChange={this.state.apiFormFieldChangeHandler}/>
                </Col>
                <Col xs="12" sm="6">
                  <label>Agrupación</label>
                  <ApiFormChoiceField
                    name="bucketing_field"
                    id="bucketing_field"
                    required={true}
                    choices={bucketingOptions}
                    value={this.state.formValues.bucketing_field}
                    onChange={this.state.apiFormFieldChangeHandler}/>
                </Col>
                <Col xs="12" sm="7" md="6" lg="12" xl="12">
                  <label htmlFor="submit"/>
                  <ApiFormSubmitButton
                    value={this.state.formValues.submit}
                    label="Generar"
                    loadingLabel="Generando"
                    onChange={this.state.apiFormFieldChangeHandler}
                    loading={this.state.downloadLink === null}/>
                </Col>
              </Row>
            </CardBody>
          </ApiForm>
        </Card>
      </Col>
      <Col sm="12" md="6" lg="4" xl="4">
        <Card>
          <CardHeader id="filters"><i className="fas fa-search"/> Filtros</CardHeader>
            <CardBody id="category-browse-filters">
              {filtersComponent}
            </CardBody>
        </Card>
      </Col>
    </Row>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  const {preferredCountry, preferredCurrency, preferredNumberFormat} = pricingStateToPropsUtils(state);

  return {
    fetchAuth,
    preferredCountry,
    preferredNumberFormat,
    preferredCurrency,
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores'),
    countries: filterApiResourceObjectsByType(state.apiResourceObjects, 'countries'),
    currencies: filterApiResourceObjectsByType(state.apiResourceObjects, 'currencies'),
  }
}

export default connect(mapStateToProps)(CategoryDetailHistoricShareOfShelves);
