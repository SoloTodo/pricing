import React from 'react'
import {connect} from "react-redux";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class BrandComparisonSegmentRowMoveButton extends React.Component {
  buttonClickHandler = e => {
    e.preventDefault();
    if (this.props.disabled) {
      return
    }

    this.props.fetchAuth(`brand_comparison_segment_rows/${this.props.row.id}/move/`, {
      method: 'POST',
      body: JSON.stringify({
        direction: this.props.direction
      })
    }).then(json => {
      this.props.onComparisonChange();
    })
  };

  render() {
    return <a href="/" className={this.props.disabled? "text-secondary" : ""} onClick={this.buttonClickHandler}>
      <i className={`fa fa-arrow-${this.props.direction}`}/>
    </a>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  return {
    fetchAuth,
  }
}

export default connect(mapStateToProps)(BrandComparisonSegmentRowMoveButton)
