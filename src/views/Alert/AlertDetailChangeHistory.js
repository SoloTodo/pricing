import React from 'react'
import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {connect} from "react-redux";
import Big from 'big.js'
import {settings} from "../../settings";
import {Row, Col, Table, Card, CardHeader, CardBody} from 'reactstrap'
import {NavLink} from "react-router-dom";
import {formatDateStr} from "../../react-utils/utils";
import {pricingStateToPropsUtils} from "../../utils";


class AlertDetailChangeHistory extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      changeHistory: undefined,
    };

    this.alert = this.props.ApiResourceObject(this.props.apiResourceObject);

    this.storeObjects = {};
    for (const store of this.props.stores) {
      this.storeObjects[store.url] = store;
    }
  }

  componentDidMount() {
    this.props.fetchAuth(`${settings.apiResourceEndpoints.user_alerts}${this.alert.id}/alert_notifications/`)
      .then(json => {
        // This push is for adding the last case, which is the current state of the alert.
        // The current state does not have an associated notification, and this is done
        // to normalize the data to map in the render function.
        json.push({
          previous_normal_price_registry: this.alert.alert.normal_price_registry,
          previous_offer_price_registry: this.alert.alert.offer_price_registry,
          creation_date: this.alert.alert.last_updated
        });

        this.setState({
          changeHistory: json
        })
      });
  }

  getConvertedFormattedPrices = registry => {
    const currency = this.props.currencies.find(currency => currency.url === registry.entity.currency);
    const convertedNormalPrice = this.props.convertToPreferredCurrency(Big(registry.normal_price), currency);
    const convertedOfferPrice = this.props.convertToPreferredCurrency(Big(registry.offer_price), currency);
    return {
      normal_price: this.props.formatCurrency(convertedNormalPrice, this.props.preferredCurrency),
      offer_price: this.props.formatCurrency(convertedOfferPrice, this.props.preferredCurrency)
    }
  };

  getRegistryContent = (registry, previousRegistry, type) => {
    // If previousRegistry is null, it's assigned to the current registry
    // because is necessary for it to exist for comparison reasons
    if (!previousRegistry) {
      previousRegistry = registry
    }

    if (registry) {
      let changeClass = '';
      let icon = '';

      const price = this.getConvertedFormattedPrices(registry)[`${type}_price`];

      if (Big(registry[`${type}_price`]).cmp(Big(previousRegistry[`${type}_price`])) === -1) {
        changeClass = 'text-success';
        icon = <i className="fas fa-caret-down"/>
      } else if (Big(registry[`${type}_price`]).cmp(Big(previousRegistry[`${type}_price`])) === 1) {
        changeClass = 'text-danger';
        icon = <i className="fas fa-caret-up"/>
      }

      return <React.Fragment>
        <td>{this.storeObjects[registry.entity.store].name}</td>
        <td><NavLink to={`/skus/${registry.entity.id}`}>{registry.entity.sku}</NavLink></td>
        <td className={`${changeClass} right-aligned`}>{icon} {price}</td>
      </React.Fragment>
    } else {
      return <td className="center-aligned" colSpan="3">Producto no disponible </td>
    }
  };

  render() {
    if (!this.state.changeHistory) {
      return <div/>
    }

    let previousNotification = this.state.changeHistory[0];

    return <React.Fragment>
      <Card>
        <CardHeader>Estado actual</CardHeader>
        <CardBody>
          <Row>
            <Col sm="6">
              <h5>Mejor precio normal</h5>
              <ul>
                <li>Tienda: {this.storeObjects[this.alert.alert.normal_price_registry.entity.store].name} </li>
                <li>SKU: <NavLink to={`/skus/${this.alert.alert.normal_price_registry.entity.id}`}>{this.alert.alert.normal_price_registry.entity.sku}</NavLink></li>
                <li>Valor: {this.getConvertedFormattedPrices(this.alert.alert.normal_price_registry).normal_price} </li>
              </ul>
            </Col>
            <Col sm="6">
              <h5>Mejor precio oferta</h5>
              <ul>
                <li>Tienda: {this.storeObjects[this.alert.alert.offer_price_registry.entity.store].name} </li>
                <li>SKU: <NavLink to={`/skus/${this.alert.alert.offer_price_registry.entity.id}`}>{this.alert.alert.offer_price_registry.entity.sku}</NavLink></li>
                <li>Valor: {this.getConvertedFormattedPrices(this.alert.alert.offer_price_registry).offer_price} </li>
              </ul>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Historial de cambios</CardHeader>
        <CardBody>
          <Table striped bordered>
            <thead>
            <tr>
              <th/>
              <th className="center-aligned" colSpan="3">Precio normal</th>
              <th className="center-aligned" colSpan="3">Precio oferta</th>
            </tr>
            <tr>
              <th className="center-aligned">Fecha</th>
              <th className="center-aligned">Tienda</th>
              <th className="center-aligned">SKU</th>
              <th className="center-aligned">Valor</th>
              <th className="center-aligned">Tienda</th>
              <th className="center-aligned">SKU</th>
              <th className="center-aligned">Valor</th>
            </tr>
            </thead>
            <tbody>
            {this.state.changeHistory.map((notification, i) => {
              const normalContent = this.getRegistryContent(
                notification.previous_normal_price_registry,
                previousNotification.previous_normal_price_registry,
                'normal');

              const offerContent = this.getRegistryContent(
                notification.previous_offer_price_registry,
                previousNotification.previous_offer_price_registry,
                'offer');

              previousNotification = notification;

              return <tr key={i}>
                <td>{formatDateStr(notification.creation_date)}</td>
                {normalContent}
                {offerContent}
              </tr>
            })}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {fetchAuth, ApiResourceObject} = apiResourceStateToPropsUtils(state);
  const {formatCurrency, convertToPreferredCurrency} = pricingStateToPropsUtils(state);

  return {
    fetchAuth,
    ApiResourceObject,
    formatCurrency,
    convertToPreferredCurrency,
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores'),
    currencies: filterApiResourceObjectsByType(state.apiResourceObjects, 'currencies')
  }
}

export default connect(mapStateToProps)(AlertDetailChangeHistory);
