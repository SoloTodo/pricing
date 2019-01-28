import React from 'react';
import {connect} from "react-redux";
import {
  apiResourceStateToPropsUtils,
} from "../../react-utils/ApiResource";

import {NavLink} from "react-router-dom";
import { Markdown } from 'react-showdown';
import ImageGallery from 'react-image-gallery';
import {formatCurrency, formatDateStr} from "../../react-utils/utils";
import {pricingStateToPropsUtils} from "../../utils";
import imageNotAvailable from '../../images/image-not-available.svg';
import {Row, Col, Card, CardHeader, CardBody, Table, Alert} from "reactstrap";

class SkuDetail extends React.Component {
  initialState = {
    stock: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.initialState,
      warnings: [],
    }
  }

  componentDidMount() {
    const entity = this.props.apiResourceObject;

    if (!entity.product){
      this.state.warnings.push({label: 'Este SKU aún no ha sido homologado', visibility: true});
    }
    if (!(entity.active_registry && entity.active_registry.is_available)){
      this.state.warnings.push({label: 'Este SKU no está disponible para compra', visibility: true});
    }
    if (!entity.is_visible){
      this.state.warnings.push({label: 'Este SKU ha sido marcado como no relevante por el staff de SoloTodo', visibility:true});
    }

    if (this.userHasStockPermissions(entity)) {
      if (entity.active_registry && entity.active_registry.is_available) {
        const endpoint = entity.active_registry.url + 'stock/';
        this.props.fetchAuth(endpoint).then(json => {
          const stock = json.stock;
          this.setState({
            stock
          })
        })
      } else {
        this.setState({
          stock: 0
        })
      }
    }
  }

  userHasStockPermissions = entity => {
    entity = entity || this.props.apiResourceObject;
    entity = this.props.ApiResourceObject(entity);

    return entity.store.permissions.includes('view_store_stocks');
  };

  onDismiss = index => {
    const warnings = this.state.warnings;
    warnings[index].visibility = false;
    this.setState({ warnings });
  };

  render() {
    const localFormatCurrency = (value, valueCurrency, conversionCurrency) => {
      return formatCurrency(value, valueCurrency, conversionCurrency,
        this.props.preferredNumberFormat.thousands_separator,
        this.props.preferredNumberFormat.decimal_separator)
    };

    const entity = this.props.ApiResourceObject(this.props.apiResourceObject);
    const displayStocksCell = this.userHasStockPermissions();

    const preferredCurrency = this.props.ApiResourceObject(this.props.preferredCurrency);

    const conditions = [
      {
        'id': 'https://schema.org/NewCondition',
        'name': 'Nuevo'
      },
      {
        'id': 'https://schema.org/DamagedCondition',
        'name': 'Dañado'
      },
      {
        'id': 'https://schema.org/RefurbishedCondition',
        'name': "Refurbished"
      },
      {
        'id': 'https://schema.org/UsedCondition',
        'name': "Usado"
      }
    ];

    const currentCondition = conditions.filter(condition => condition.id === entity.condition)[0];

    let images = null;

    if (entity.pictureUrls && entity.pictureUrls.length) {
      images = entity.pictureUrls.map(pictureUrl => ({
        original: pictureUrl,
        thumbnail: pictureUrl
      }))
    }

    return (
      <div>
        <Row>
          {this.state.warnings.map((warning, index) => {
            return <Col key={index} xs="12">
              <Alert color="warning" isOpen={warning.visibility} toggle={() => this.onDismiss(index)}>
                {warning.label}
              </Alert>
            </Col>
          })}

          <Col sm="12" md="6" lg="6" xl="5" id="entity-pictures-carousel-card">
            <Card>
              <CardHeader>
                <i className="fas fa-images">&nbsp;</i>
                Imágenes
              </CardHeader>
              <CardBody className="center-aligned">
                {images ?
                  <ImageGallery
                    items={images}
                    showFullscreenButton={false}
                    showPlayButton={false}
                  /> :
                  <img src={imageNotAvailable} className="img-fluid" alt={entity.name} />}
              </CardBody>
            </Card>
          </Col>
          <Col sm="12" md="6" lg="6" xl="7">
            <Card>
              <CardHeader>Información General</CardHeader>
              <CardBody>
                <Table striped responsive className="mb-0">
                  <tbody>
                  <tr>
                    <th>Nombre</th>
                    <td>{entity.name}</td>
                  </tr>
                  <tr>
                    <th>Producto</th>
                    <td>{entity.product ?
                      <NavLink to={'/products/' + entity.product.id}>{entity.product.name}</NavLink> :
                      <em>N/A</em>}</td>
                  </tr>
                  {entity.category.id === 6 && <tr>
                    <th>Plan celular</th>
                    <td>{entity.cellPlan ? <NavLink to={'/products/' + entity.cellPlan.id}>{entity.cellPlan.name}</NavLink> : "Liberado"}</td>
                  </tr>
                  }
                  <tr>
                    <th>Precio normal</th>
                    <td>
                      {entity.activeRegistry ?
                        <span>{localFormatCurrency(entity.activeRegistry.normal_price, entity.currency)}</span> :
                        <em>N/A</em>
                      }
                    </td>
                  </tr>
                  <tr>
                    <th>Precio oferta</th>
                    <td>
                      {entity.activeRegistry ?
                        <span>{localFormatCurrency(entity.activeRegistry.offer_price, entity.currency)}</span> :
                        <em>N/A</em>
                      }
                    </td>
                  </tr>
                  <tr>
                    <th>Tienda</th>
                    <td>
                      <NavLink to={'/stores/' + entity.store.id}>{entity.store.name}</NavLink><a href={entity.externalUrl} target="_blank" rel="noopener noreferrer"> <i className="fas fa-link"/></a>
                    </td>
                  </tr>
                  <tr>
                    <th>Categoría</th>
                    <td>{entity.category.name}</td>
                  </tr>
                  <tr>
                    <th>SKU</th>
                    <td>{entity.sku || <em>N/A</em>}</td>
                  </tr>
                  <tr>
                    <th>Fecha de detección</th>
                    <td>{formatDateStr(entity.creationDate)}</td>
                  </tr>
                  <tr>
                    <th>Última actualización</th>
                    <td>{formatDateStr(entity.lastPricingUpdate)}</td>
                  </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>Opciones</CardHeader>
              <CardBody>
                <ul className="list-without-decoration subnavigation-links">
                  <li>
                    <NavLink to={`/entities/${entity.id}/pricing_history`}>
                      Historial de precios
                    </NavLink>
                  </li>
                </ul>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col sm="12" md="6" xl="5">
            <Card>
              <CardHeader>Información Pricing</CardHeader>
              <CardBody>
                <Table striped responsive className="mb-0">
                  <tbody>
                  <tr>
                    <th>Moneda</th>
                    <td>{entity.currency.isoCode}</td>
                  </tr>

                  {preferredCurrency.url !== entity.currency.url &&
                  <tr>
                    <th>
                      Precio normal
                      <span>&nbsp;({preferredCurrency.isoCode})</span>
                    </th>
                    <td>
                      {entity.activeRegistry ?
                        <span>{localFormatCurrency(entity.activeRegistry.normal_price, entity.currency, preferredCurrency)}</span> :
                        <em>N/A</em>
                      }
                    </td>
                  </tr>
                  }
                  {preferredCurrency.url !== entity.currency.url &&
                  <tr>
                    <th>
                      Precio oferta
                      <span>&nbsp;({preferredCurrency.isoCode})</span>
                    </th>
                    <td>
                      {entity.activeRegistry ? <span>{localFormatCurrency(entity.activeRegistry.offer_price, entity.currency, preferredCurrency)}</span> : <em>N/A</em>}
                    </td>
                  </tr>
                  }
                  <tr>
                    <th>¿Disponible?</th>
                    <td><i className={entity.activeRegistry && entity.activeRegistry.is_available ?
                      'far fa-check-square' :
                      'far fa-square'}/>
                    </td>
                  </tr>
                  <tr>
                    <th>¿Relevante?</th>
                    <td>
                      <i className={entity.isVisible ?
                        'far fa-check-square' :
                        'far fa-square'}/>
                    </td>
                  </tr>
                  {displayStocksCell && <tr>
                    <th>Stock</th>
                    <td>
                      {this.state.stock}
                    </td>
                  </tr>
                  }
                  <tr>
                    <th>Condición</th>
                    <td>
                      {currentCondition.name}
                    </td>
                  </tr>
                  <tr>
                    <th>Part number</th>
                    <td>{entity.partNumber || <em>N/A</em>}</td>
                  </tr>
                  <tr>
                    <th>EAN</th>
                    <td>{entity.ean || <em>N/A</em>}</td>
                  </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col sm="12" md="6" xl="7">
            <Card>
              <CardHeader>Descripción</CardHeader>
              <CardBody id="description-container">
                <Markdown markup={ entity.description } tables={true} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>)
  }
}

function mapStateToProps(state) {
  const {ApiResourceObject, fetchAuth} = apiResourceStateToPropsUtils(state);
  const {preferredCurrency, preferredNumberFormat } = pricingStateToPropsUtils(state);

  return {
    ApiResourceObject,
    fetchAuth,
    preferredCurrency,
    preferredNumberFormat,
  }
}


export default connect(mapStateToProps)(SkuDetail);