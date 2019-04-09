import React from 'react'
import {connect} from "react-redux";

import {formatCurrency} from "../../react-utils/utils";
import {filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {pricingStateToPropsUtils} from "../../utils";

class BrandComparisonSegmentRowPriceCell extends React.Component {
  render() {
    const product = this.props.product;
    let value = 'N/A';

    if (product) {
      const rowData = this.props.rowData.filter(row => row.product.id === product.id)[0];
      const entity = rowData.entities.filter(entity => entity.store === this.props.storeUrl);

      if (entity.length) {
        value = entity[0].active_registry[`${this.props.priceType}_price`];
        //const entityCurrency = this.props.currencies.filter(currency => currency.url === entity.currency)[0]
        //value = formatCurrency(value, entityCurrency, this.props.preferredCurrency)
      }
    }

    return <span>{value}</span>
  }
}

function mapStateToProps(state) {
  const {preferredCurrency} = pricingStateToPropsUtils(state);

  return {
    preferredCurrency,
    currencies: filterApiResourceObjectsByType(state.apiResourceObjects, 'currency'),
  }
}

export default connect(mapStateToProps)(BrandComparisonSegmentRowPriceCell);
