import React from 'react'
import {connect} from "react-redux";

import {formatCurrency} from "../../react-utils/next_utils";
import {filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {pricingStateToPropsUtils} from "../../utils";

class BrandComparisonSegmentRowPriceCell extends React.Component {
  render() {
    const product = this.props.product;
    let value = '-';

    if (product) {
      const rowData = this.props.rowData.filter(row => row.product.id === product.id)[0];
      const entities = rowData.entities.filter(entity => entity.store === this.props.storeUrl);

      if (entities.length) {
        value = entities[0].active_registry[`${this.props.priceType}_price`];
        const entityCurrency = this.props.currencies.filter(currency => currency.url === entities[0].currency)[0]
        value = formatCurrency(value, entityCurrency, this.props.preferredCurrency, this.props.preferredNumberFormat.thousands_separator, this.props.preferredNumberFormat.decimal_separator)
      }
    }

    return <span className="d-flex justify-content-end">
      {value}
    </span>
  }
}

function mapStateToProps(state) {
  const {preferredCurrency, preferredNumberFormat} = pricingStateToPropsUtils(state);

  return {
    preferredCurrency,
    preferredNumberFormat,
    currencies: filterApiResourceObjectsByType(state.apiResourceObjects, 'currencies'),
  }
}

export default connect(mapStateToProps)(BrandComparisonSegmentRowPriceCell);
