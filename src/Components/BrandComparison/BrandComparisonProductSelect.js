import React from 'react'
import Select from 'react-select'

import {createOption, createOptions} from '../../react-utils/form_utils';
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";


class BrandComparisonProductSelect extends React.Component {
  onProductChange = e => {
    const value = e? e.option.id: null;
    this.props.fetchAuth(`brand_comparison_segment_rows/${this.props.row.id}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        [`product_${this.props.brandIndex}`]: value
      })
    }).then(json => {
      this.props.onComparisonChange()
    })
  };

  render() {
    const product = this.props.row[`product_${this.props.brandIndex}`];
    const productOption = product ? createOption(product) : null;

    return <Select
      options={createOptions(this.props.products)}
      value={productOption}
      isClearable={true}
      onChange={this.onProductChange}/>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  return {
    fetchAuth,
  }
}

export default connect(mapStateToProps)(BrandComparisonProductSelect);