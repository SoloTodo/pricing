import React from 'react'
import {connect} from 'react-redux'
import {Row, Col, Card, CardHeader} from 'reactstrap'
import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormResultTableWithPagination,
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
        renderer: banner => <a href={banner.asset.picture_url} target="_blank" rel="noopener noreferrer"><img className="img-fluid banner-preview" src={banner.asset.picture_url} alt=""/></a>,
        cssClasses: 'text-center',
      },
      {
        label: 'Tienda',
        ordering: 'update__store',
        renderer: banner => this.storeObject[banner.update.store].name
      },
      {
        label: 'Subsección',
        ordering: 'subsection',
        renderer: banner => <a href={banner.externalUrl} target="_blank" rel="noopener noreferrer">{banner.subsection.section.name} > {banner.subsection.name}</a>
      },
      {
        label: 'Destino',
        renderer: banner => <ul className="list-without-decoration mb-0">{banner.destinationUrlList.map(url => {
          return <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">Link</a></li>
        })}</ul>
      },
      {
        label: '¿Activo?',
        renderer: banner => banner.update.is_active? 'Sí' : 'No'
      },
      {
        label: <div className='d-flex flex-row banner-content-container'>
          <div className="d-flex flex-column align-items-start banner-content-brand">Marca</div>
          <div className="d-flex flex-column align-items-start banner-content-category">Categoría</div>
          <div className="d-flex flex-column align-items-center banner-content-percentage">%</div>
        </div>,
        renderer: banner => {
          return banner.asset.total_percentage?
            <div>
              {banner.asset.contents.map(content =>
                <div className='d-flex flex-row banner-content-container'>
                  <div className="d-flex flex-column align-items-start banner-content-brand">{content.brand.name}</div>
                  <div className="d-flex flex-column align-items-start banner-content-category">{content.category.name}</div>
                  <div className="d-flex flex-column align-items-end banner-content-percentage">{`${content.percentage} %`}</div>
                </div>
              )}
            </div>
            : "Sin Contenido"
        }
      },
      {
        label:'Posición',
        ordering: 'position',
        renderer: banner => banner.position
      },
      {
        label: 'Fecha creación',
        ordering: 'update__timestamp',
        renderer: banner => formatDateStr(banner.update.timestamp)
      }
    ];

    return <div className="animated fadeIn">
      <ApiForm
        endpoints={['banners/']}
        fields={['stores', 'ordering', 'is_active', 'sections', 'page', 'page_size']}
        onResultsChange={this.setBanners}
        onFormValueChange={this.handleFormValueChange}
        setFieldChangeHandler={this.setApiFormFieldChangeHandler}>
        <ApiFormChoiceField
          name='ordering'
          choices={createOrderingOptionChoices(['update__timestamp', 'update__store', 'position', 'subsection'])}
          initial='-update__timestamp'
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
                  <Col xs="12" sm="6">
                    <label htmlFor="sections">Sección</label>
                    <ApiFormChoiceField
                      name="sections"
                      id="sections"
                      multiple={true}
                      choices={this.props.sections}
                      searchable={false}
                      onChange={this.state.apiFormFieldChangeHandler}
                      value={this.state.formValues.sections}
                      placeholder='Todas'/>
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
            icon="fas fa-list"
            cardClass="card-body"
            page_size_choices={[10, 20, 50]}
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
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores').filter(store => store.permissions.includes('view_store_banners')),
    sections: filterApiResourceObjectsByType(state.apiResourceObjects, 'banner_sections')
  }
}

export default connect(mapStateToProps)(BannerList);
