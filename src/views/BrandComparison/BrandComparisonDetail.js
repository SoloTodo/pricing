import React from 'react'
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {Card, CardHeader, CardBody} from 'reactstrap'

import BrandComparisonRenameButton from '../../Components/BrandComparison/BrandComparisonRenameButton'
import BrandComparisonPriceTypeButton from '../../Components/BrandComparison/BrandComparisonPriceTypeButton'
import BrandComparisonDeleteButton from '../../Components/BrandComparison/BrandComparisonDeleteButton'
import BrandComparisonSelectStoresButton from '../../Components/BrandComparison/BrandComparisonSelectStoresButton'
import BrandComparisonPendingProductsButton from "../../Components/BrandComparison/BrandComparisonPendingProductsButton";
import BrandComparisonTable from './BrandComparisonTable'

import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {areListsEqual} from "../../react-utils/utils";
import LaddaButton, {EXPAND_LEFT} from "react-ladda"
import BrandComparisonManualProductsButton from "../../Components/BrandComparison/BrandComparisonManualProductsButton";


class BrandComparisonDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleted: false,
      loading: false,
    };
  }

  componentDidMount() {
    this.setRowData('1');
    this.setRowData('2');
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(!areListsEqual(this.props.apiResourceObject.stores, nextProps.apiResourceObject.stores)){
      this.setRowData('1', nextProps.apiResourceObject);
      this.setRowData('2', nextProps.apiResourceObject);
    }
  }

  handleReportButtonClick = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });

    this.props.fetchAuth(`brand_comparisons/${this.props.apiResourceObject.id}/?export_format=xls`).then(json => {
      window.location = json.url;
      this.setState({
        loading:false
      })
    })
  };

  setRowData = (brandIndex, comparison) => {
    comparison = comparison || this.props.apiResourceObject;
    const categoryId = comparison.category.id;
    const selectedStores = comparison.stores.map(store_url => this.props.stores.filter(store => store.url === store_url)[0].id);

    let endpoint = `categories/${categoryId}/full_browse/?`;

    for (const storeId of selectedStores) {
      endpoint += `stores=${storeId}&`
    }

    this.props.fetchAuth(endpoint + `db_brands=${comparison[`brand_${brandIndex}`].id}`).then(json => {
      let rawRowData = json['results'];

      if (comparison.manual_products.length > 0) {
        let mpEndpoint = `products/available_entities/?`;

        for (const manual_product of comparison.manual_products) {
          mpEndpoint += `ids=${manual_product.id}&`
        }

        for (const storeId of selectedStores) {
          mpEndpoint += `stores=${storeId}&`
        }

        this.props.fetchAuth(mpEndpoint).then(json => {
          const extraRowData = json['results'];
          for (const data of extraRowData) {
            rawRowData.push(data);
          }

          for (const segment of comparison.segments) {
            for (const row of segment.rows) {
              if (row[`product_${brandIndex}`]) {
                // Manually add the products referenced by the comparison (in case they are not avaialble)
                const result = rawRowData.filter(result => result.product.id === row[`product_${brandIndex}`].id)[0];
                if (!result) {
                  rawRowData.push({
                    entities: [],
                    product: row[`product_${brandIndex}`]
                  })
                }
              }
            }
          }
          this.setState({
            [`brand${brandIndex}RawRowData`]: rawRowData
          })
        });
      } else {
        for (const segment of comparison.segments) {
          for (const row of segment.rows) {
            if (row[`product_${brandIndex}`]) {
              // Manually add the products referenced by the comparison (in case they are not avaialble)
              const result = rawRowData.filter(result => result.product.id === row[`product_${brandIndex}`].id)[0];
              if (!result) {
                rawRowData.push({
                  entities: [],
                  product: row[`product_${brandIndex}`]
                })
              }
            }
          }
        }
        this.setState({
          [`brand${brandIndex}RawRowData`]: rawRowData
        })
      }
    });
  };

  processRowData = (rawRowData, brandIndex) => {
    const comparison = this.props.apiResourceObject;
    const rowData = rawRowData.map(result => ({
      ...result,
      rowIds: [],
    }));

    for (const segment of comparison.segments) {
      for (const row of segment.rows) {
        if (row[`product_${brandIndex}`]) {
          const result = rowData.filter(result => result.product.id === row[`product_${brandIndex}`].id)[0];
          if (result) {
            result.rowIds.push(row.id)
          }
        }
      }
    }

    return rowData
  };

  deleteCallback = () => {
    this.setState({
      deleted:true
    })
  };

  handleComparisonChange = (updatedBrandComparison) => {
    if (updatedBrandComparison) {
      this.props.updateBrandComparison(updatedBrandComparison)
    } else {
      this.props.fetchAuth(`brand_comparisons/${this.props.apiResourceObject.id}/`).then(json => {
        this.props.updateBrandComparison(json)
      });
    }
  };

  render() {
    if (this.state.deleted){
      return <Redirect to={{pathname: '/brand_comparisons'}}/>
    }

    if (!this.state.brand1RawRowData || !this.state.brand2RawRowData) {
      return <div>Loading...</div>
    }

    const brand1RowData = this.processRowData(this.state.brand1RawRowData, '1');
    const brand2RowData = this.processRowData(this.state.brand2RawRowData, '2');

    const brandComparison = this.props.apiResourceObject;
    return <div>
      <Card>
        <CardHeader className="d-flex justify-content-between ">
          <BrandComparisonRenameButton
            brandComparison={brandComparison}
            onComparisonChange={this.handleComparisonChange}/>
          <div>
            <BrandComparisonManualProductsButton
              brandComparison={brandComparison}/>
            <BrandComparisonPendingProductsButton
              brandComparison={brandComparison}
              brand1RowData={brand1RowData}
              brand2RowData={brand2RowData}/>
            <BrandComparisonSelectStoresButton
              brandComparison={brandComparison}
              onComparisonChange={this.handleComparisonChange}/>
            <BrandComparisonPriceTypeButton
              brandComparison={brandComparison}
              onComparisonChange={this.handleComparisonChange}/>
            <LaddaButton loading={this.state.loading}
                         onClick={this.handleReportButtonClick}
                         data-style={EXPAND_LEFT}
                         className="btn btn-primary mr-2">
              {this.state.loading? 'Generando': 'Descargar'}
            </LaddaButton>
            <BrandComparisonDeleteButton
              brandComparison={brandComparison}
              callback={this.deleteCallback}/>
          </div>
        </CardHeader>
        <CardBody>
          <BrandComparisonTable
            brandComparison={brandComparison}
            onComparisonChange={this.handleComparisonChange}
            brand1RowData={brand1RowData}
            brand2RowData={brand2RowData}/>
        </CardBody>
      </Card>
    </div>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  return {
    fetchAuth,
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores')
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

export default connect(mapStateToProps, mapDispatchToProps)(BrandComparisonDetail);