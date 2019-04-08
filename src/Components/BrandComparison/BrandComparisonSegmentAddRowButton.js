import React from 'react'
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";

class BrandComparisonSegmentAddRowButton extends React.Component {
  buttonClickHandler = e => {
    e.preventDefault();
    this.props.fetchAuth(`brand_comparison_segments/${this.props.segment.id}/add_row/`, {
      method:'POST'
    }).then(json => {
      this.props.fetchAuth(`brand_comparisons/${this.props.comparisonId}/`).then(json => {
        this.props.updateBrandComparison(json)
      });
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

function mapDispatchToProps(dispatch) {
  return {
    updateBrandComparison: brandComparison => {
      return dispatch({
        type: 'addApiResourceObject',
        apiResource: brandComparison
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandComparisonSegmentAddRowButton)
