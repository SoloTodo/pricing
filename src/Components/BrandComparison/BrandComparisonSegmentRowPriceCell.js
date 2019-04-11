import React from 'react'
import {connect} from "react-redux";
import {NavLink} from 'react-router-dom'
import Big from 'big.js'

import {formatCurrency} from "../../react-utils/next_utils";
import {filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {pricingStateToPropsUtils} from "../../utils";

class BrandComparisonSegmentRowPriceCell extends React.Component {
  render() {
    const product = this.props.product;
    let price = 0;
    let priceContainer = '-';

    if (product) {
      const rowData = this.props.rowData.filter(row => row.product.id === product.id)[0];
      const entity = rowData.entities.filter(entity => entity.store === this.props.storeUrl)[0];

      if (entity) {
        price = new Big(entity.active_registry[`${this.props.priceType}_price`]);
        const entityCurrency = this.props.currencies.filter(currency => currency.url === entity.currency)[0];
        priceContainer = <NavLink to={`/skus/${entity.id}`} className="text-dark">
          {formatCurrency(price, entityCurrency, this.props.preferredCurrency, this.props.preferredNumberFormat.thousands_separator, this.props.preferredNumberFormat.decimal_separator)}
        </NavLink>
      }
    }

    const comparisonProduct = this.props.comparisonProduct;
    let comparisonContainer = null;

    if (comparisonProduct) {
      const comparisonRowData = this.props.comparisonRowData.filter(row => row.product.id === comparisonProduct.id)[0];
      const comparisonEntity = comparisonRowData.entities.filter(entity => entity.store === this.props.storeUrl)[0];
      if (price && comparisonEntity) {
        const price2 = new Big(comparisonEntity.active_registry[`${this.props.priceType}_price`]);
        const comparison = new Big(100).times(price.minus(price2)).div(price2).round();

        if (comparison.cmp(new Big(0)) === 1) {
          comparisonContainer = <em className="d-flex justify-content-end text-danger">
            +{comparison.toString()}%
          </em>
        } else if (comparison.cmp(new Big(0)) === -1) {
          comparisonContainer = <em className="d-flex justify-content-end text-success">
            {comparison.toString()}%
          </em>
        }
      }
    }

    return <React.Fragment>
      <span className="d-flex justify-content-end">
        {priceContainer}
      </span>
      {comparisonContainer}
    </React.Fragment>
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
