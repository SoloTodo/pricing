import React from 'react'
import {connect} from "react-redux";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class BrandComparisonSegmentAddRowButton extends React.Component {
  buttonClickHandler = e => {
    e.preventDefault();
    this.props.fetchAuth(`brand_comparison_segments/${this.props.segment.id}/add_row/`, {
      method:'POST'
    }).then(json => {
      this.props.onComparisonChange();
    })
  };

  render() {
    return <a href="/" onClick={this.buttonClickHandler}><i className="fa fa-plus"/></a>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  return {
    fetchAuth,
  }
}

export default connect(mapStateToProps)(BrandComparisonSegmentAddRowButton)
