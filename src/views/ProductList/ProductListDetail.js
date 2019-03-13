import React from 'react'
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {pricingStateToPropsUtils} from "../../utils";
import {connect} from "react-redux";

class ProductListDetail extends React.Component{
  render() {
    const productList = this.props.ApiResourceObject(this.props.apiResourceObject);
    console.log(productList.entries);
    return <div>{productList.name}</div>
  }
}

function mapStateToProps(state) {
  const {ApiResourceObject, fetchAuth} = apiResourceStateToPropsUtils(state);
  const {user} = pricingStateToPropsUtils(state);

  return {
    user,
    ApiResourceObject,
    fetchAuth,
  }
}

export default connect(mapStateToProps)(ProductListDetail);