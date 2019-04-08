import React from 'react'
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";

class BrandComparisonSegmentRowMoveButton extends React.Component {
  buttonClickHandler = e => {
    e.preventDefault();
    this.props.fetchAuth(`brand_comparison_segment_rows/${this.props.row.id}/move/`, {
      method: 'POST',
      body: JSON.stringify({
        direction: this.props.direction
      })
    }).then(json => {
      this.props.fetchAuth(`brand_comparisons/${this.props.comparisonId}/`).then(json => {
        this.props.updateBrandComparison(json)
      });
    })
  };

  render() {
    return <a href="/" className={this.props.disabled && 'text-secondary'} onClick={this.buttonClickHandler}><i className={`fa fa-arrow-${this.props.direction}`}/></a>
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

export default connect(mapStateToProps, mapDispatchToProps)(BrandComparisonSegmentRowMoveButton)
