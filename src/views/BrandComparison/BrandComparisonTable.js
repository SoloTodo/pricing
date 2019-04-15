import React from 'react'
import {connect} from "react-redux";
import {Table} from "reactstrap";

import {
  filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";
import {createOptions} from '../../react-utils/form_utils';

import BrandComparisonAddSegmentButton from "../../Components/BrandComparison/BrandComparisonAddSegmentButton"
import BrandComparisonSegmentDeleteButton from "../../Components/BrandComparison/BrandComparisonSegmentDeleteButton"
import BrandComparisonSegmentRenameButton from "../../Components/BrandComparison/BrandComparisonSegmentRenameButton"
import BrandComparisonSegmentMoveButton from "../../Components/BrandComparison/BrandComparisonSegmentMoveButton"
import BrandComparisonSegmentAddRowButton from "../../Components/BrandComparison/BrandComparisonSegmentAddRowButton"
import BrandComparisonSegmentRowDeleteButton from "../../Components/BrandComparison/BrandComparisonSegmentRowDeleteButton"
import BrandComparisonSegmentRowMoveButton from "../../Components/BrandComparison/BrandComparisonSegmentRowMoveButton";
import BrandComparisonProductSelect from "../../Components/BrandComparison/BrandComparisonProductSelect"
import BrandComparisonSegmentRowPriceCell from "../../Components/BrandComparison/BrandComparisonSegmentRowPriceCell"


import './BrandComparisonTable.css'

class BrandComparisonTable extends React.Component {
  createOptionsWithGroup = (rowData) => {
    const customCreateOptions = localRowData => createOptions(localRowData.map(data => ({...data, name: data.product.name, id: data.product.id})));

    return [
      {label: 'Pendientes', options: customCreateOptions(rowData.filter(data => data.entities.length && !data.rowIds.length))},
      {label: 'Ya ingresados', options:customCreateOptions(rowData.filter(data => data.entities.length && data.rowIds.length))},
      {label: 'No disponibles', options:customCreateOptions(rowData.filter(data => !data.entities.length))}
    ]
  };

  render() {
    const brandComparison = this.props.brandComparison;
    const storesDict = {};
    for (const store of this.props.stores) {
      storesDict[store.url] = store
    }

    const brand1Options = this.createOptionsWithGroup(this.props.brand1RowData);
    const brand2Options = this.createOptionsWithGroup(this.props.brand2RowData);

    return <Table className="comparison-table" bordered size="sm">
      <thead>
      <tr>
        <th className="center-aligned">&nbsp;</th>
        <th className="center-aligned">{brandComparison.brand_1.name}</th>
        {brandComparison.stores.map(storeUrl => <th key={storeUrl} className="center-aligned pricing-cell">{storesDict[storeUrl].name}</th>)}
        <th className="center-aligned">{brandComparison.brand_2.name}</th>
        {brandComparison.stores.map(storeUrl => <th key={storeUrl} className="center-aligned pricing-cell">{storesDict[storeUrl].name}</th>)}
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
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="rotate">{segment.name}</span>
                  </div>
                </div>
              </td>}
              <td className={`row-cell ${rowIndex === 0? "segment-border" : ""}`}>
                <BrandComparisonProductSelect
                  options={brand1Options}
                  row = {row}
                  brandIndex="1"
                  onComparisonChange={this.props.onComparisonChange}/>
              </td>
              {brandComparison.stores.map(storeUrl =>
                <td key={storeUrl} className={`row-cell ${rowIndex === 0? "segment-border" : ""}`}>
                  <BrandComparisonSegmentRowPriceCell
                    storeUrl={storeUrl}
                    product={row.product_1}
                    rowData={this.props.brand1RowData}
                    comparisonProduct={row.product_2}
                    comparisonRowData={this.props.brand2RowData}
                    priceType={brandComparison.price_type}/>
                </td>
              )}
              <td className={`row-cell ${rowIndex === 0? "segment-border" : ""}`}>
                <BrandComparisonProductSelect
                  options={brand2Options}
                  row = {row}
                  brandIndex="2"
                  onComparisonChange={this.props.onComparisonChange}/>
              </td>
              {brandComparison.stores.map(storeUrl =>
                <td key={storeUrl} className={`row-cell ${rowIndex === 0? "segment-border" : ""}`}>
                  <BrandComparisonSegmentRowPriceCell
                    storeUrl={storeUrl}
                    product={row.product_2}
                    rowData={this.props.brand2RowData}
                    priceType={brandComparison.price_type}/>
                </td>
              )}
              <td className={`segment-row ${rowIndex === 0 && 'segment-border'}`}>
                <div className="d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <BrandComparisonSegmentRowMoveButton
                      row={row}
                      direction='up'
                      disabled={rowIndex === 0}
                      onComparisonChange={this.props.onComparisonChange}/>
                    <BrandComparisonSegmentRowDeleteButton
                      row={row}
                      disabled={segment.rows.length === 1}
                      onComparisonChange={this.props.onComparisonChange}/>
                  </div>
                  <div className="d-flex justify-content-between">
                    <BrandComparisonSegmentRowMoveButton
                      row={row}
                      direction='down'
                      disabled={rowIndex === segment.rows.length-1}
                      onComparisonChange={this.props.onComparisonChange}/>
                    <BrandComparisonSegmentAddRowButton
                      segment={segment}
                      row={row}
                      onComparisonChange={this.props.onComparisonChange}/>
                  </div>
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
