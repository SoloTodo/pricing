import React, {Component} from 'react'
import {connect} from "react-redux";
import {
  apiResourceStateToPropsUtils
} from "../../react-utils/ApiResource";
import {settings} from "../../settings";
import ProductDetailPricesTable from "./ProductDetailPricesTable";
import {NavLink} from "react-router-dom";
import {Row, Col, Card, CardHeader, CardBody} from "reactstrap";
import './ProductDetail.css'
import ProductUserAlertButton from "../../Components/Product/ProductUserAlertButton";
import ProductAddOrRemoveFromListButton from '../../Components/Product/ProductAddOrRemoveFromListButton'
import ProductDetailPricingHistoryChart from "./ProductDetailPricingHistoryChart";
import moment from "moment";
import Button from "reactstrap/es/Button";
import {pricingStateToPropsUtils} from "../../utils";

class ProductDetail extends Component {
  initialState = {
    renderedSpecs: undefined,
    specsModalOpen: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.initialState,
      chart: undefined
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentProduct = this.props.apiResourceObject;
    const nextProduct = nextProps.apiResourceObject;

    if (currentProduct.id !== nextProduct.id) {
      this.setState(this.initialState, () => this.componentUpdate(nextProduct));
    }

    this.setState({
      chart: {
        ...this.state.chart,
        currency:nextProps.preferredCurrency
      }
    })
  }

  componentDidMount(){
    this.componentUpdate(this.props.apiResourceObject);
    this.updateChart()
  }

  updateChart(){
    const product = this.props.apiResourceObject;

    const startDate = moment().startOf('day').subtract(30, 'days');
    const endDate = moment().startOf('day');

    this.props.fetchAuth(`products/${product.id}/pricing_history?timestamp_0=${startDate.format()}&exclude_unavailable=1`).then(json => {
      this.setState({
        chart: {
          data: json,
          currency: this.props.preferredCurrency,
          priceType: {id:'offer', name:'Precio Oferta'},
          startDate: startDate,
          endDate: endDate
        }
      });
    })
  }

  componentUpdate(product) {
    product = this.props.ApiResourceObject(product);

    const specsTemplateUrl = `${settings.apiResourceEndpoints.category_templates}?website=${settings.ownWebsiteId}&purpose=${settings.categoryTemplateDetailPurposeId}&category=${product.category.id}`;

    this.props.fetchAuth(specsTemplateUrl)
      .then(categoryTemplates => {
        if (!categoryTemplates.length) {
          this.setState({
            renderedSpecs: null
          });
          return
        }

        this.props.fetchAuth(`${categoryTemplates[0].url}render?product=${product.id}`)
          .then(renderData => {
            this.setState({
              renderedSpecs: renderData.body
            })
          })
      })
  }

  render() {
    const product = this.props.ApiResourceObject(this.props.apiResourceObject);
    let techSpecs = null;

    switch (this.state.renderedSpecs) {
      case undefined:
        techSpecs = <div />;
        break;
      case null:
        techSpecs = <em>Las especificaciones técnicas de este producto no están disponibles actualmente</em>;
        break;
      default:
        techSpecs = <div className="product_specs" dangerouslySetInnerHTML={{ __html: this.state.renderedSpecs }} />
    }

    return (
      <Row>
        <Col sm="12" md="8" lg="8" xl="5" >
          <Card>
            <CardHeader><span className="fas fa-photo"/> Fotografía</CardHeader>
            <CardBody className="center-aligned">
              <div className="product-image-container">
                <img src={product.pictureUrl} alt={product.name} className="img-fluid"  />
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12" md="4" lg="4" xl="7" id="prices-card">
          <Card>
            <CardHeader>Precios actuales</CardHeader>
            <CardBody>
              <ProductDetailPricesTable product={this.props.apiResourceObject} />
            </CardBody>
          </Card>
          <Card>
            <CardHeader>Opciones</CardHeader>
            <CardBody>
              <ProductUserAlertButton product={product}/>
              {/*<ProductAddOrRemoveFromListButton product={product}/>*/}
            </CardBody>
          </Card>
        </Col>
        <Col sm="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              Historico de Precios
              <NavLink to={`/products/${product.id}/pricing_history`}>
                <Button color='primary' type="button" className="btn">
                  Ver historial completo
                </Button>
              </NavLink>
            </CardHeader>
            <CardBody>
              {this.state.chart?
                <ProductDetailPricingHistoryChart
                  product={this.props.apiResourceObject}
                  chart={this.state.chart}/>:'Loading...'}
            </CardBody>
          </Card>
        </Col>
        <Col sm="12">
          <Card>
            <CardHeader>Especificaciones Técnicas</CardHeader>
            <CardBody>
              {techSpecs}
            </CardBody>
          </Card>
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state) {
  const {ApiResourceObject, fetchAuth} = apiResourceStateToPropsUtils(state);
  const {user, preferredCurrency} = pricingStateToPropsUtils(state);

  return {
    user,
    preferredCurrency,
    ApiResourceObject,
    fetchAuth,
  }
}

export default connect(mapStateToProps)(ProductDetail);
