import React from 'react'
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import connect from "react-redux/es/connect/connect";

class CategoryDetailShareOfShelvesChart extends React.Component{
  render() {
    console.log(this.props.brandChoices);
    return <div/>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth
  }
}

export default connect(mapStateToProps)(CategoryDetailShareOfShelvesChart);
