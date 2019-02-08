import React from 'react'
import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {connect} from "react-redux";

class AlertList extends React.Component{
  render() {
    return <div>Alertas!</div>
  }
}


function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
    alerts: filterApiResourceObjectsByType(state.apiResourceObjects, 'user_alerts')
  }
}

export default connect(mapStateToProps)(AlertList);