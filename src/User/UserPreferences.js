import React from 'react'
import {connect} from "react-redux";
import {settings} from "../settings";
import { ApiResourceObject } from "../react-utils/ApiResource";
import {pricingStateToPropsUtils, defaultProperty} from "../utils";

class UserPreferences extends React.Component {
  componentDidMount() {
    const apiResourceObjects = this.props.apiResourceObjects;
    const user = new ApiResourceObject(this.props.user, apiResourceObjects);

    // Set currency and number format

    if (!user.preferredCurrency || !user.preferredNumberFormat) {
      let countryByIpUrl = `${settings.endpoint}countries/by_ip/`;
      if (settings.customIp) {
        countryByIpUrl += `?ip=${settings.customIp}`;
      }

      fetch(countryByIpUrl)
          .then(res => res.json())
          .then(json => {
            const userCountry = json['url'] ?
                json : apiResourceObjects[defaultProperty('countries')];

            if (!user.preferredCurrency) {
              user.preferredCurrency = new ApiResourceObject(apiResourceObjects[userCountry.currency])
            }

            if (!user.preferredNumberFormat) {
              user.preferredNumberFormat = new ApiResourceObject(apiResourceObjects[userCountry.number_format]);
            }

            user.save(this.props.authToken, this.props.dispatch);
          })
    }
  }

  render() {
    if (!this.props.preferredNumberFormat || !this.props.preferredCurrency) {
      return null
    }

    return <React.Fragment>
      {this.props.children}
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {user, preferredNumberFormat, preferredCurrency} = pricingStateToPropsUtils(state);

  return {
    user,
    preferredNumberFormat,
    preferredCurrency,
    apiResourceObjects: state.apiResourceObjects,
    authToken: state.authToken,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserPreferences);
