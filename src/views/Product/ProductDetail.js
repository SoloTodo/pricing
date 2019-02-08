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

class ProductDetail extends Component {
  initialState = {
    renderedSpecs: undefined,
    specsModalOpen: false,
  };

  constructor(props) {
    super(props);
    this.state = {...this.initialState}
  }

  componentWillMount() {
    this.componentUpdate(this.props.apiResourceObject);
  }

  componentWillReceiveProps(nextProps) {
    const currentProduct = this.props.apiResourceObject;
    const nextProduct = nextProps.apiResourceObject;

    if (currentProduct.id !== nextProduct.id) {
      this.setState(this.initialState, () => this.componentUpdate(nextProduct));
    }
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
              <ul className="list-without-decoration subnavigation-links">
                <li>
                  <NavLink to={`/products/${product.id}/pricing_history`}>
                    <button type="button" className="btn btn-link">
                      Historial pricing
                    </button>
                  </NavLink>
                </li>
              </ul>
              <ProductUserAlertButton product={product}/>
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

  return {
    ApiResourceObject,
    fetchAuth,
  }
}

export default connect(mapStateToProps)(ProductDetail);
