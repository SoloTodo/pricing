import React from 'react';
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap'
import {
  createOrderingOptionChoices,
  ApiForm,
  ApiFormChoiceField,
  ApiFormDateRangeField,
  ApiFormTextField,
  ApiFormResultTableWithPagination
} from "../../react-utils/api_forms";
import {
  formatDateStr,
} from "../../react-utils/utils";
import {
  filterApiResourceObjectsByType,
} from "../../react-utils/ApiResource";

class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
      apiFormFieldChangeHandler: undefined,
      products: undefined
    }
  }

  setApiFormFieldChangeHandler = apiFormFieldChangeHandler => {
    this.setState({
      apiFormFieldChangeHandler
    })
  };

  handleFormValueChange = formValues => {
    this.setState({formValues})
  };

  setProducts = json => {
    this.setState({
      products: json ? json.payload : null
    })
  };

  render() {
    const categories = this.props.categories;

    const columns = [
      {
        label: 'Nombre',
        ordering: 'name',
        renderer: result => <NavLink to={'/products/' + result.id}>{result.name}</NavLink>
      },
      {
        label: 'Categoría',
        ordering: 'category',
        renderer: result => result.category.name
      },
      {
        label: 'Fecha creación',
        ordering: 'creation_date',
        renderer: result => formatDateStr(result.creationDate),
        cssClasses: 'hidden-xs-down'
      },
      {
        label: 'Última actualización',
        ordering: 'last_updated',
        renderer: result => formatDateStr(result.lastUpdated),
        cssClasses: 'hidden-xs-down'
      }
    ];

    return (
      <ApiForm
        endpoints={["products/"]}
        fields={['categories', 'search', 'creationDate', 'lastUpdated', 'page', 'page_size', 'ordering']}
        onResultsChange={this.setProducts}
        onFormValueChange={this.handleFormValueChange}
        setFieldChangeHandler={this.setApiFormFieldChangeHandler}>
        <ApiFormChoiceField
          name="ordering"
          choices={createOrderingOptionChoices(['id', 'name', 'category', 'creation_date', 'last_updated'])}
          hidden={true}
          initial="name"
          value={this.state.formValues.ordering}
          onChange={this.state.apiFormFieldChangeHandler}/>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader><i className="fas fa-search">&nbsp;</i>Filtros</CardHeader>
              <CardBody>
                <Row className="api-form-filters">
                  <Col xs="12" sm="6" md="6" lg="6" xl="6">
                    <label>Categorías</label>
                    <ApiFormChoiceField
                      name="categories"
                      choices={categories}
                      placeholder='Todas'
                      searchable={!this.props.isExtraSmall}
                      onChange={this.state.apiFormFieldChangeHandler}
                      value={this.state.formValues.categories}
                    />
                  </Col>
                  <Col xs="12" sm="6" md="6" lg="6" xl="6">
                    <label>Palabras clave</label>
                    <ApiFormTextField
                      name="search"
                      onChange={this.state.apiFormFieldChangeHandler}
                      value={this.state.formValues.search}
                    />
                  </Col>
                  <Col xs="12" sm="6" md="6" lg="6" xl="6">
                    <label>Fecha creación (desde / hasta)</label>
                    <ApiFormDateRangeField
                      name="creationDate"
                      nullable={true}
                      onChange={this.state.apiFormFieldChangeHandler}
                      value={this.state.formValues.creationDate}
                    />
                  </Col>
                  <Col xs="12" sm="6" md="6" lg="6" xl="6">
                    <label>Fecha actualización (desde / hasta)</label>
                    <ApiFormDateRangeField
                      name="lastUpdated"
                      nullable={true}
                      onChange={this.state.apiFormFieldChangeHandler}
                      value={this.state.formValues.lastUpdated}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <ApiFormResultTableWithPagination
              icon="fas fa-list"
              cardClass="card-body"
              page_size_choices={[50, 100, 200]}
              page={this.state.formValues.page}
              page_size={this.state.formValues.page_size}
              data={this.state.products}
              onChange={this.state.apiFormFieldChangeHandler}
              columns={columns}
              ordering={this.state.formValues.ordering}
              loading={<div />}
            />
          </Col>
        </Row>
      </ApiForm>
    )
  }
}

function mapStateToProps(state) {
  return {
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories'),
    isExtraSmall: state.browser.is.extraSmall
  }
}

export default connect(mapStateToProps)(ProductList);