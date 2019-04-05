import React from 'react'
import {Table} from "reactstrap";
import {filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {connect} from "react-redux";

import BrandComparisonAddSegmentButton from "../../Components/BrandComparison/BrandComparisonAddSegmentButton"
import BrandComparisonSegmentDeleteButton from "../../Components/BrandComparison/BrandComparisonSegmentDeleteButton"
import BrandComparisonSegmentRenameButton from "../../Components/BrandComparison/BrandComparisonSegmentRenameButton"
import './BrandComparisonTable.css'

class BrandComparisonTable extends React.Component {
  render() {
    const brandComparison = this.props.brandComparison;
    const storesDict = {};
    for (const store of this.props.stores) {
      storesDict[store.url] = store
    }
    return <Table bordered size="sm">
      <thead>
      <tr>
        <th className="center-aligned">&nbsp;</th>
        <th className="center-aligned">{brandComparison.brand_1.name}</th>
        {brandComparison.stores.map(storeUrl => <th key={storeUrl} className="center-aligned">{storesDict[storeUrl].name}</th>)}
        <th className="center-aligned">{brandComparison.brand_2.name}</th>
        {brandComparison.stores.map(storeUrl => <th key={storeUrl} className="center-aligned">{storesDict[storeUrl].name}</th>)}
      </tr>
      </thead>
      <tbody>
      {brandComparison.segments.map(segment =>
        <React.Fragment key={segment.ordering}>
          {segment.rows.map(row =>
            <tr key={row.ordering}>
              {row.ordering === 1  &&
              <td rowSpan={segment.rows.length} className="rotate d-flex justify-content-between">
                <div className="d-flex flex-column">
                  <BrandComparisonSegmentDeleteButton
                    segment={segment}
                    comparisonId={brandComparison.id}/>
                  <BrandComparisonSegmentRenameButton
                    segment={segment}
                    comparisonId={brandComparison.id}/>
                  <a><i className="fa fa-arrow-up"/></a>
                  <a><i className="fa fa-arrow-down"/></a>
                  <a><i className="fa fa-plus"/></a>
                </div>
                <div className="d-flex center-aligned">
                  <span>{segment.name}</span>
                </div>
              </td>}
              <td>{row.product_1 && row.product_1.name}</td>
              {brandComparison.stores.map(store_url => <td key={store_url}>Precio</td>)}
              <td>{row.product_2 && row.product_2.name}</td>
              {brandComparison.stores.map(store_url => <td key={store_url}>Precio</td>)}
            </tr>
          )}
        </React.Fragment>
      )}
      <tr>
        <td className="rotate center-aligned">
          <BrandComparisonAddSegmentButton
            brandComparison={brandComparison}/>
        </td>
      </tr>
      </tbody>
    </Table>
  }
}

function mapStateToProps(state) {
  return {
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores'),
  }
}

export default connect(mapStateToProps)(BrandComparisonTable);
