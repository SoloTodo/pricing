import React from 'react'
import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {connect} from "react-redux";
import {settings} from "../../settings";
import {Table, Card, CardBody} from 'reactstrap'
import {NavLink} from "react-router-dom";
import {formatDateStr} from "../../react-utils/utils";
import {pricingStateToPropsUtils} from "../../utils";
import CardHeader from "reactstrap/es/CardHeader";

class AlertDetailChangeHistory extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      changeHistory:undefined
    };
    this.alert = this.props.ApiResourceObject(this.props.apiResourceObject);
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
      })
  }

  render() {
    if (!this.state.changeHistory) {
      return <div/>
    }

    let previous_notification = this.state.changeHistory[0];

    return <Card>
      <CardHeader>Historial de cambios</CardHeader>
      <CardBody>
        <Table striped bordered>
          <thead>
          <tr>
            <th className="center-aligned"/>
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

            let offer_tds = undefined;

            if (notification.previous_offer_price_registry) {
              let offer_change_class = '';
              let offer_icon = '';

              const current_offer_registry = notification.previous_offer_price_registry;
              const previous_offer_registry = previous_notification.previous_offer_price_registry || current_offer_registry;

              const currency = this.props.currencies.find(currency => currency.url === current_offer_registry.entity.currency);
              const convertedOfferPrice = this.props.convertToPreferredCurrency(parseFloat(current_offer_registry.offer_price), currency);

              if (parseFloat(current_offer_registry.offer_price) < parseFloat(previous_offer_registry.offer_price)) {
                offer_change_class = 'text-success';
                offer_icon = <i className="fas fa-caret-down"/>
              } else if (parseFloat(current_offer_registry.offer_price) > parseFloat(previous_offer_registry.offer_price)) {
                offer_change_class = 'text-danger';
                offer_icon = <i className="fas fa-caret-up"/>
              }

              offer_tds = <React.Fragment>
                <td>{this.props.stores.find(store => store.url === current_offer_registry.entity.store).name}</td>
                <td><NavLink to={`/skus/${current_offer_registry.entity.id}`}>{current_offer_registry.entity.sku}</NavLink></td>
                <td className={`${offer_change_class} right-aligned`}>{offer_icon} {this.props.formatCurrency(convertedOfferPrice, this.props.preferredCurrency)}</td>
              </React.Fragment>
            } else {
              offer_tds = <td className="center-aligned" colSpan="3"> Producto no disponible </td>
            }

            let normal_tds = undefined;

            if (notification.previous_normal_price_registry) {
              let normal_change_class = '';
              let normal_icon = '';

              const current_normal_registry = notification.previous_normal_price_registry;
              const previous_normal_registry = previous_notification.previous_normal_price_registry || current_normal_registry;

              const currency = this.props.currencies.find(currency => currency.url === current_normal_registry.entity.currency);
              const convertedNormalPrice =  this.props.convertToPreferredCurrency(parseFloat(current_normal_registry.normal_price), currency);
              //const convertedOfferPrice = this.props.convertToPreferredCurrency(parseFloat(current_offer_registry.offer_price), currency);

              if (parseFloat(current_normal_registry.normal_price) < parseFloat(previous_normal_registry.normal_price)) {
                normal_change_class = 'text-success';
                normal_icon = <i className="fas fa-caret-down"/>
              } else if (parseFloat(current_normal_registry.normal_price) > parseFloat(previous_normal_registry.normal_price)) {
                normal_change_class = 'text-danger';
                normal_icon = <i className="fas fa-caret-up"/>
              }

              normal_tds = <React.Fragment>
                <td>{this.props.stores.find(store => store.url === current_normal_registry.entity.store).name}</td>
                <td><NavLink to={`/skus/${current_normal_registry.entity.id}`}>{current_normal_registry.entity.sku}</NavLink></td>
                <td className={`${normal_change_class} right-aligned`}>{normal_icon} {this.props.formatCurrency(convertedNormalPrice, this.props.preferredCurrency)}</td>
              </React.Fragment>
            } else {
              normal_tds = <td className="center-aligned" colSpan="3"> Producto no disponible </td>
            }



            previous_notification = notification;

            return <tr key={i}>
              <td>{formatDateStr(notification.creation_date)}</td>
              {normal_tds}
              {offer_tds}
            </tr>
          })}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  }
}

function mapStateToProps(state) {
  const {fetchAuth, ApiResourceObject} = apiResourceStateToPropsUtils(state);
  const {preferredCurrency, preferredNumberFormat, formatCurrency, convertToPreferredCurrency} = pricingStateToPropsUtils(state);

  return {
    fetchAuth,
    ApiResourceObject,
    preferredCurrency,
    preferredNumberFormat,
    formatCurrency,
    convertToPreferredCurrency,
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores'),
    currencies: filterApiResourceObjectsByType(state.apiResourceObjects, 'currencies')
  }
}

export default connect(mapStateToProps)(AlertDetailChangeHistory);
