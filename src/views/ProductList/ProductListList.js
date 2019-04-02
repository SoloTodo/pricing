import React from 'react'
import {connect} from "react-redux";
import {Row, Col,Card, CardBody, CardHeader} from "reactstrap";
import {NavLink} from 'react-router-dom'
import {
  apiResourceStateToPropsUtils,
  filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";
import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormResultTableWithPagination
} from "../../react-utils/api_forms";
import {formatDateStr} from "../../react-utils/utils";
import ProductListReorderButton from "../../Components/ProductList/ProductListReorderButton";
import ProductListRenameButton from "../../Components/ProductList/ProductListRenameButton";
import ProductListDeleteButton from "../../Components/ProductList/ProductListDeleteButton";
import ProductListCreateButton from "../../Components/ProductList/ProductListCreateButton";
import moment from "moment";

class ProductListList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      apiFormFieldChangeHandler: undefined,
      productLists: undefined,
      endpoint: 'product_lists/'
    }
  }

  listChangeHandler = () => {
    this.setState({
      endpoint: `product_lists/?_=${new Date().getTime()}`
    })
  };

  setApiFormFieldChangeHandler = apiFormFieldChangeHandler => {
    this.setState({
      apiFormFieldChangeHandler
    })
  };

  handleFormValueChange = formValues => {
    this.setState({
      formValues
    })
  };

  setProductLists = json => {
    this.setState({
      productLists: json? json.payload : null
    });
  };

  updateEndpoint = () => {
    this.setState({
      endpoint: 'product_lists/?_='+moment().format()
    })
  };

  render() {
    const columns = [
      {
        label: 'Nombre',
        renderer: productList => <div className="d-flex justify-content-between">
          <NavLink to={`/product_lists/${productList.id}/current_prices`}>{productList.name}</NavLink>
          <ProductListRenameButton productList={productList} onListRename={this.listChangeHandler}/>
        </div>
      },
      {
        label: 'Categoría',
        renderer: productList => this.props.categories.filter(category => category.url === productList.categoryUrl)[0].name
      },
      {
        label: 'Fecha creación',
        renderer: productList => formatDateStr(productList.creationDate)
      },
      {
        label: 'Productos',
        renderer: productList => {return productList.entries.length? <div>
          {productList.entries.map(entry => <li className="list-without-decoration" key={entry.product.id}>
            <NavLink to={`/products/${entry.product.id}`}>{entry.product.name}</NavLink>
          </li>)}
        </div>: <em>Sin productos</em>}
      },
      {
        label: 'Reordenar',
        renderer: productList => <ProductListReorderButton
            productList={productList}
            onProductsReorder={this.listChangeHandler}/>
      },
      {
        label: 'Eliminar',
        renderer: productList => <ProductListDeleteButton
            productList={productList}
            onListDelete={this.listChangeHandler}/>
      }
    ];
    return <div>
      <ApiForm
          endpoints={[this.state.endpoint]}
          fields={['categories', 'page', 'page_size']}
          onResultsChange={this.setProductLists}
          onFormValueChange={this.handleFormValueChange}
          setFieldChangeHandler={this.setApiFormFieldChangeHandler}>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>Filtros</CardHeader>
              <CardBody>
                <Row className="entity-form-controls">
                  <Col xs="12" sm="6">
                    <label htmlFor="categories">Categorías</label>
                    <ApiFormChoiceField
                        name="categories"
                        id="categories"
                        choices={this.props.categories}
                        multiple={true}
                        onChange={this.state.apiFormFieldChangeHandler}
                        value={this.state.formValues.categories}
                        placeholder='Todas'/>
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
                label="Listas de Productos"
                cardClass="card-body"
                headerButton=<ProductListCreateButton callback={this.updateEndpoint}/>
            page_size_choices={[10,20,50]}
            page={this.state.formValues.page}
            page_size={this.state.formValues.page_size}
            data={this.state.productLists}
            columns={columns}
            onChange={this.state.apiFormFieldChangeHandler}/>
          </Col>
        </Row>
      </ApiForm>
    </div>
  }
}

function mapStateToProps(state) {
  const {ApiResourceObject} = apiResourceStateToPropsUtils(state);

  return {
    ApiResourceObject,
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories')
  }
}

export default connect(mapStateToProps)(ProductListList);