import React from 'react'
import Select from 'react-select'

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";
import {UncontrolledTooltip} from "reactstrap";


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

  onHighlightedClick = (e, isHighlighted) => {
    e.preventDefault();
    this.props.fetchAuth(`brand_comparison_segment_rows/${this.props.row.id}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        [`is_product_${this.props.brandIndex}_highlighted`]: !isHighlighted
      })
    }).then(json => {
      this.props.onComparisonChange()
    })
  };

  getProductWarnings = productOption => {
    const warnings = [];
    if (productOption) {
      const data = productOption.option;
      if (data.rowIds.length > 1) {
        warnings.push('Este producto ya ha sido ingresado.')
      }
      if(!data.entities.length){
        warnings.push('Producto no disponible.')
      }
    }
    return warnings;
  };

  render() {
    const product = this.props.row[`product_${this.props.brandIndex}`];
    const isHighlighted = this.props.row[
        `is_product_${this.props.brandIndex}_highlighted`];
    const allOptions = this.props.options.map(x => x.options).flat();

    const productOption = product ? allOptions.filter(option => option.option.id === product.id)[0] : null;
    const warnings = this.getProductWarnings(productOption);
    const highlighted_class = isHighlighted? "fas fa-sun text-warning ml-1" : "fas fa-sun text-secondary ml-1"

    return <div className="d-flex align-items-center">
      {warnings.length > 0 && <span className="mr-2" id={`brand${this.props.brandIndex}Row${this.props.row.id}`}>
        <i className="fas fa-warning text-warning"/>
        <UncontrolledTooltip placement="top" target={`brand${this.props.brandIndex}Row${this.props.row.id}`}>
          {warnings.map(warning => <React.Fragment key={warning}><span>{warning}</span><br/></React.Fragment>)}
        </UncontrolledTooltip>
      </span>}
      <Select
        className="flex-grow-1"
        options={this.props.options}
        value={productOption}
        isClearable={true}
        onChange={this.onProductChange}/>
      <a href="/" onClick={(e)=>this.onHighlightedClick(e, isHighlighted)}>
        <i className={highlighted_class}>
      </i></a>
    </div>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
  }
}

export default connect(mapStateToProps)(BrandComparisonProductSelect);