import React from 'react'
import {connect} from 'react-redux'
import {Row, Col, Card, CardHeader} from 'reactstrap'
import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormResultTableWithPagination,
  ApiFormRemoveOnlyListField,
  createOrderingOptionChoices
} from '../../react-utils/api_forms'
import {
  apiResourceStateToPropsUtils,
  filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";
import {booleanChoices} from "../../utils";
import {formatDateStr} from "../../react-utils/utils";
import CardBody from "reactstrap/es/CardBody";
import './BannerList.css'


class BannerList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      apiFormFieldChangeHandler: undefined,
      banners: undefined
    };

    this.storeObject = {};
    for (const store of this.props.stores){
      this.storeObject[store.url] = store
    }
  }

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

  setBanners = json => {
    this.setState({
      banners: json? json.payload : null
    });
  };

  render() {
    const columns = [
      {
        label: 'Imagen',
        renderer: banner => <a href={banner.asset.picture_url} target="_blank" rel="noopener noreferrer"><img className="img-fluid banner-preview" src={banner.asset.picture_url} alt=""/></a>
      },
      {
        label: 'Tienda',
        ordering: 'store',
        renderer: banner => this.storeObject[banner.update.store].name
      },
      {
        label: 'Categoría',
        renderer: banner => banner.category || 'Home'
      },
      {
        label: '¿Activo?',
        renderer: banner => banner.update.is_active? 'Sí' : 'No'
      },
      {
        label: 'Completitud',
        renderer: banner => `${banner.asset.total_percentage || 0} %`
      },
      {
        label:'Posición',
        ordering: 'position',
        renderer: banner => banner.position
      },
      {
        label: 'Fecha creación',
        ordering: 'timestamp',
        renderer: banner => formatDateStr(banner.update.timestamp)
      }
    ];

    return <div className="animated fadeIn">
      <ApiForm
        endpoints={['banners/']}
        fields={['stores', 'ordering', 'is_active']}
        onResultsChange={this.setBanners}
        onFormValueChange={this.handleFormValueChange}
        setFieldChangeHandler={this.setApiFormFieldChangeHandler}>
        <ApiFormChoiceField
          name='ordering'
          choices={createOrderingOptionChoices(['store', 'timestamp', 'position'])}
          hidden={true}
          required={true}
          value={this.state.formValues.ordering}
          onChange={this.state.apiFormFieldChangeHandler}/>

        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>Filtros</CardHeader>
              <CardBody>
                <Row className="entity-form-controls">
                  <Col xs="12" sm="6">
                    <label htmlFor="stores">Tiendas</label>
                    <ApiFormChoiceField
                      name="stores"
                      id="stores"
                      choices={this.props.stores}
                      multiple={true}
                      onChange={this.state.apiFormFieldChangeHandler}
                      value={this.state.formValues.stores}
                      placeholder='Todas'/>
                  </Col>
                  <Col xs="12" sm="6">
                    <label htmlFor="is_active">¿Activo?</label>
                    <ApiFormChoiceField
                      name="is_active"
                      id="is_active"
                      choices={booleanChoices}
                      searchable={false}
                      onChange={this.state.apiFormFieldChangeHandler}
                      value={this.state.formValues.stores}/>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </ApiForm>
      <Row>
        <Col sm="12">
          <ApiFormResultTableWithPagination
            cardClass="card-body"
            page_size_choices={[50, 100, 200]}
            page={this.state.formValues.page}
            page_size={this.state.formValues.page_size}
            data={this.state.banners}
            onChange={this.state.apiFormFieldChangeHandler}
            columns={columns}
            ordering={this.state.formValues.ordering}/>
        </Col>
      </Row>
    </div>
  }
}

function mapStateToProps(state) {
  const {ApiResourceObject} = apiResourceStateToPropsUtils(state);

  return {
    ApiResourceObject,
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores')
  }
}

export default connect(mapStateToProps)(BannerList);
