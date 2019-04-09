import React from 'react'
import {connect} from "react-redux";
import {Table} from "reactstrap";

import {
  filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";

import BrandComparisonAddSegmentButton from "../../Components/BrandComparison/BrandComparisonAddSegmentButton"
import BrandComparisonSegmentDeleteButton from "../../Components/BrandComparison/BrandComparisonSegmentDeleteButton"
import BrandComparisonSegmentRenameButton from "../../Components/BrandComparison/BrandComparisonSegmentRenameButton"
import BrandComparisonSegmentMoveButton from "../../Components/BrandComparison/BrandComparisonSegmentMoveButton"
import BrandComparisonSegmentAddRowButton from "../../Components/BrandComparison/BrandComparisonSegmentAddRowButton"
import BrandComparisonSegmentRowDeleteButton from "../../Components/BrandComparison/BrandComparisonSegmentRowDeleteButton"
import BrandComparisonSegmentRowMoveButton from "../../Components/BrandComparison/BrandComparisonSegmentRowMoveButton";

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
        <th className="center-aligned">&nbsp;</th>
      </tr>
      </thead>
      <tbody>
      {brandComparison.segments.map((segment, segmentIndex) =>
        <React.Fragment key={segment.ordering}>
          {segment.rows.map((row, rowIndex) =>
            <tr key={row.ordering}>
              {rowIndex === 0  &&
              <td rowSpan={segment.rows.length} className="segment segment-border">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column">
                    <BrandComparisonSegmentDeleteButton
                      segment={segment}
                      onComparisonChange={this.props.onComparisonChange}/>
                    <BrandComparisonSegmentRenameButton
                      segment={segment}
                      onComparisonChange={this.props.onComparisonChange}/>
                    <BrandComparisonSegmentMoveButton
                      segment={segment}
                      direction='up'
                      disabled={segmentIndex === 0}
                      onComparisonChange={this.props.onComparisonChange}/>
                    <BrandComparisonSegmentMoveButton
                      segment={segment}
                      direction='down'
                      disabled={segmentIndex === brandComparison.segments.length-1}
                      onComparisonChange={this.props.onComparisonChange}/>
                    <BrandComparisonSegmentAddRowButton
                      segment={segment}
                      onComparisonChange={this.props.onComparisonChange}/>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="rotate">{segment.name}</span>
                  </div>
                </div>
              </td>}
              <td className={rowIndex === 0? "segment-border" : ""}>{row.product_1 && row.product_1.name}</td>
              {brandComparison.stores.map(store_url => <td key={store_url} className={rowIndex === 0? "segment-border" : ""}>Precio</td>)}
              <td className={rowIndex === 0? "segment-border" : ""}>{row.product_2 && row.product_2.name}</td>
              {brandComparison.stores.map(store_url => <td key={store_url} className={rowIndex === 0? "segment-border" : ""}>Precio</td>)}
              <td className={`segment-row ${rowIndex === 0 && 'segment-border'}`}>
                <div className="d-flex justify-content-between">
                  <BrandComparisonSegmentRowMoveButton
                    row={row}
                    direction='up'
                    disabled={rowIndex === 0}
                    onComparisonChange={this.props.onComparisonChange}/>
                  <BrandComparisonSegmentRowMoveButton
                    row={row}
                    direction='down'
                    disabled={rowIndex === segment.rows.length-1}
                    onComparisonChange={this.props.onComparisonChange}/>
                  <BrandComparisonSegmentRowDeleteButton
                    row={row}
                    onComparisonChange={this.props.onComparisonChange}/>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      )}
      <tr>
        <td className="rotate center-aligned">
          <BrandComparisonAddSegmentButton
            brandComparison={brandComparison}
            onComparisonChange={this.props.onComparisonChange}/>
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
