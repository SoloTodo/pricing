import React from 'react'

import SkuDetailPositionHistoryChart from './SkuDetailPositionHistoryChart'
import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {connect} from "react-redux";

class SkuDetailPositionHistory extends React.Component {
  render() {
    return <SkuDetailPositionHistoryChart entity={this.props.apiResourceObject}/>
  }
}


function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
  }
}


export default connect(mapStateToProps)(SkuDetailPositionHistory);