import React from 'react';
import {Card, CardHeader, CardBody, Col, Row, Tooltip} from 'reactstrap';
import {connect} from "react-redux";
import {Link, NavLink} from "react-router-dom";
import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";

import {formatCurrency} from "../../react-utils/utils";

import {
  createOrderingOptionChoices,
  ApiForm,
  ApiFormChoiceField,
  ApiFormTextField,
} from '../../react-utils/api_forms'
import {pricingStateToPropsUtils, booleanChoices} from "../../utils";
import PricingFormResultTableWithPagination from "../../Components/PricingFormResultTableWithPagination";

import './SkuList.css'

class SkuList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
      apiFormFieldChangeHandler: undefined,
      entities: undefined,
      availableTooltipOpen: false,
      visibleTooltipOpen: false,
    }
  }

  toggle(field) {
    this.setState({
      [field]: !this.state[field],
    });
  }

  setApiFormFieldChangeHandler = apiFormFieldChangeHandler => {
    this.setState({
      apiFormFieldChangeHandler
    })
  };

  handleFormValueChange = formValues => {
    this.setState({formValues})
  };

  setEntities = json => {
    this.setState({
      entities: json ? json.payload : null
    })
  };

  getExtraClasses = entity =>{
    let extraClasses = "";

    if (!entity.product || !(entity.activeRegistry && entity.activeRegistry.is_available) || !entity.isVisible){
      extraClasses += "table-warning"
    }

    return extraClasses;
  };

  render() {
    const preferredCurrency = this.props.ApiResourceObject(this.props.preferredCurrency);

    const labels = {
      normalPrice: 'Normal',
      offerPrice: 'Oferta',
      original: 'orig.'
    };

    const localFormatCurrency = (value, valueCurrency, conversionCurrency) => {
      return formatCurrency(value, valueCurrency, conversionCurrency,
          this.props.preferredNumberFormat.thousands_separator,
          this.props.preferredNumberFormat.decimal_separator)
    };

    const convertCurrencies = this.state.entities && this.state.entities.results.some(entity => entity.currency !== preferredCurrency.url);

    const columns = [
      {
        label: 'Nombre',
        ordering: 'name',
        renderer: entity => <NavLink to={'/entities/' + entity.id}>{entity.name || <em>N/A</em>}</NavLink>
      },
      {
        label: 'Cell plan',
        renderer: entity => entity.cellPlanName || <em>N/A</em>,
        cssClasses: 'hidden-xs-down',
        displayFilter: entities => entities.some(entity => entity.cellPlanName !== null)
      },
      {
        label: 'Store',
        ordering: 'store',
        renderer: entity => <span>
          <Link to={'/stores/' + entity.store.id}>{entity.store.name}</Link>
          <a href={entity.externalUrl} target="_blank" className="ml-2">
            <span className="glyphicons glyphicons-link">&nbsp;</span>
          </a>
        </span>
      },
      {
        label: 'SKU',
        ordering: 'sku',
        renderer: entity => entity.sku || <em>N/A</em>,
        cssClasses: 'hidden-xs-down',
      },
      {
        label: 'Categoría',
        ordering: 'category',
        renderer: entity => entity.category.name,
        cssClasses: 'hidden-xs-down',
      },
      {
        label: 'Producto',
        renderer: entity => entity.product ?
            <span>
              <NavLink to={'/products/' + entity.product.id}>{entity.product.name}</NavLink>
              {entity.cellPlan &&
              <span>
                <NavLink to={'/products/' + entity.cellPlan.id}>{entity.cellPlan.name}</NavLink>
              </span>
              }
              </span>
            : <em>N/A</em>,
        cssClasses: 'hidden-sm-down',
      },
      {
        label: <React.Fragment>
          <span id="available" className="tooltiped">¿Disponible?</span>
          <Tooltip placement="top" isOpen={this.state.availableTooltipOpen} target="available" toggle={() => {this.toggle('availableTooltipOpen');}}>Explicación2</Tooltip>
        </React.Fragment>,
        renderer: entity => <i className={entity.activeRegistry && entity.activeRegistry.is_available ?
            'far fa-check-square' :
            'far fa-square' }/>,
        cssClasses: 'hidden-md-down center-aligned',
      },
      {
        label: <React.Fragment>
          <span id="visible" className="tooltiped">¿Relevante?</span>
          <Tooltip placement="top" isOpen={this.state.visibleTooltipOpen} target="visible" toggle={() => {this.toggle('visibleTooltipOpen');}}>Explicación</Tooltip>
        </React.Fragment>,

        renderer: entity => <i className={entity.isVisible ?
            'far fa-check-square' :
            'far fa-square'}/>,
        cssClasses: 'hidden-md-down center-aligned',
      },
      {
        label: <span>{labels.normalPrice}
          {convertCurrencies &&
          <span>&nbsp;({labels.original})</span>}</span>,
        renderer: entity => entity.activeRegistry ?
            <span>{localFormatCurrency(entity.activeRegistry.normal_price, entity.currency)}</span> :
            <em>N/A</em>,
        cssClasses: 'hidden-lg-down right-aligned',
      },
      {
        label: <span>{labels.offerPrice}
          {convertCurrencies &&
          <span>&nbsp;({labels.original})</span>
          }</span>,
        renderer: entity => entity.activeRegistry ?
            <span>{localFormatCurrency(entity.activeRegistry.offer_price, entity.currency)}</span> :
            <em>N/A</em>,
        cssClasses: 'hidden-lg-down right-aligned',
      },
      {
        label: <span>{labels.normalPrice}
          {convertCurrencies &&
          <span>&nbsp;({preferredCurrency.isoCode})</span>
          }</span>,
        displayFilter: () => convertCurrencies,
        renderer: entity => entity.activeRegistry ?
            <span>{localFormatCurrency(entity.activeRegistry.normal_price, entity.currency, preferredCurrency)}</span> :
            <em>N/A</em>,
        cssClasses: 'show-xxl-up right-aligned',
      },
      {
        label: <span>{labels.offerPrice}
          {convertCurrencies &&
          <span>&nbsp;({preferredCurrency.isoCode})</span>
          }</span>,
        displayFilter: () => convertCurrencies,
        renderer: entity => entity.activeRegistry ?
            <span>{localFormatCurrency(entity.activeRegistry.offer_price, entity.currency, preferredCurrency)}</span> :
            <em>N/A</em>,
        cssClasses: 'show-xxl-up right-aligned',
      },
    ];

    return (
        <div>
          <ApiForm
              endpoints={["entities/"]}
              fields={['stores', 'categories', 'is_available', 'is_visible', 'is_associated', 'search', 'page', 'page_size', 'ordering']}
              onResultsChange={this.setEntities}
              onFormValueChange={this.handleFormValueChange}
              setFieldChangeHandler={this.setApiFormFieldChangeHandler}>
            <ApiFormChoiceField
                name="ordering"
                choices={createOrderingOptionChoices(['name', 'store', 'sku', 'category'])}
                hidden={true}
                required={true}
                value={this.state.formValues.ordering}
                onChange={this.state.apiFormFieldChangeHandler}
            />
            <Row>
              <Col sm="12">
                <Card>
                  <CardHeader>
                    <i className="fas fa-search">&nbsp;</i>Filtros
                  </CardHeader>
                  <CardBody>
                    <Row className="entity-form-controls">
                      <Col xs="12" sm="6" md="6" lg="6" xl="6">
                        <label htmlFor="stores">Tiendas</label>
                        <ApiFormChoiceField
                            name="stores"
                            id="stores"
                            choices={this.props.stores}
                            multiple={true}
                            searchable={!this.props.isExtraSmall}
                            onChange={this.state.apiFormFieldChangeHandler}
                            value={this.state.formValues.stores}
                            placeholder='Todas'/>
                      </Col>
                      <Col xs="12" sm="6" md="6" lg="6" xl="6">
                        <label htmlFor="categories">Categorías</label>
                        <ApiFormChoiceField
                            name="categories"
                            id="categories"
                            choices={this.props.categories}
                            multiple={true}
                            searchable={!this.props.isExtraSmall}
                            onChange={this.state.apiFormFieldChangeHandler}
                            value={this.state.formValues.categories}
                            placeholder='Todas'/>
                      </Col>
                      <Col xs="12" sm="3" md="3" lg="2" xl="2">
                        <label id="is_available_label" htmlFor="is_available">¿Disponible?</label>
                        <ApiFormChoiceField
                            name="is_available"
                            id="is_available"
                            choices={booleanChoices}
                            searchable={false}
                            onChange={this.state.apiFormFieldChangeHandler}
                            value={this.state.formValues.is_available}
                            placeholder='Todas'/>
                      </Col>
                      <Col xs="12" sm="3" md="3" lg="2" xl="2">
                        <label id="is_visible_label" htmlFor="is_visible">¿Relevante?</label>
                        <ApiFormChoiceField
                            name="is_visible"
                            id="is_visible"
                            choices={booleanChoices}
                            searchable={false}
                            onChange={this.state.apiFormFieldChangeHandler}
                            value={this.state.formValues.is_visible}
                            placeholder='Todas'/>
                      </Col>
                      <Col xs="12" sm="3" md="3" lg="2" xl="2">
                        <label id="is_associated_label" htmlFor="is_associated">¿Homologado?</label>
                        <ApiFormChoiceField
                            name="is_associated"
                            id="is_associated"
                            choices={booleanChoices}
                            searchable={false}
                            onChange={this.state.apiFormFieldChangeHandler}
                            value={this.state.formValues.is_associated}
                            placeholder='Todas'/>
                      </Col>
                      <Col xs="12" sm="5" md="6" lg="4" xl="4">
                        <label htmlFor="search">Palabras clave</label>
                        <ApiFormTextField
                            name="search"
                            onChange={this.state.apiFormFieldChangeHandler}
                            value={this.state.formValues.search}/>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <PricingFormResultTableWithPagination
                    label='SKUs'
                    page_size_choices={[50, 100, 200]}
                    page={this.state.formValues.page}
                    page_size={this.state.formValues.page_size}
                    data={this.state.entities}
                    onChange={this.state.apiFormFieldChangeHandler}
                    columns={columns}
                    ordering={this.state.formValues.ordering}
                    getExtraClasses={this.getExtraClasses}
                />
              </Col>
            </Row>
          </ApiForm>
        </div>
    )
  }
}

function mapStateToProps(state) {
  const {ApiResourceObject} = apiResourceStateToPropsUtils(state);
  const {preferredCurrency, preferredNumberFormat } = pricingStateToPropsUtils(state);

  return {
    ApiResourceObject,
    preferredCurrency,
    preferredNumberFormat,
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores'),
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories'),
    isExtraSmall: state.browser.is.extraSmall
  }
}

export default connect(mapStateToProps)(SkuList);
