import React from 'react'
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {Card, CardHeader, CardBody} from 'reactstrap'

import BrandComparisonRenameButton from '../../Components/BrandComparison/BrandComparisonRenameButton'
import BrandComparisonPriceTypeButton from '../../Components/BrandComparison/BrandComparisonPriceTypeButton'
import BrandComparisonDeleteButton from '../../Components/BrandComparison/BrandComparisonDeleteButton'
import BrandComparisonSelectStoresButton from '../../Components/BrandComparison/BrandComparisonSelectStoresButton'
import BrandComparisonTable from './BrandComparisonTable'

import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";

class BrandComparisonDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleted: false,
    };
  }

  componentDidMount() {
    this.setRowData('1');
    this.setRowData('2');
  }

  setRowData = brandIndex => {
    const comparison = this.props.apiResourceObject;
    const categoryId = comparison.category.id;
    const selectedStores = comparison.stores.map(store_url => this.props.stores.filter(store => store.url === store_url)[0].id);

    let endpoint = `categories/${categoryId}/full_browse/?`;

    for (const storeId of selectedStores) {
      endpoint += `stores=${storeId}&`
    }

    this.props.fetchAuth(endpoint + `db_brands=${comparison[`brand_${brandIndex}`].id}`).then(json => {
      const results = json['results'];

      for (const segment of comparison.segments) {
        for (const row of segment.rows) {
          if (row[`product_${brandIndex}`]) {
            if (!results.some(result => result.product.id === row[`product_${brandIndex}`].id)) {
              results.push({
                entities: [],
                product: row[`product_${brandIndex}`]
              })
            }
          }
        }
      }
      this.setState({
        [`brand${brandIndex}RowData`]: results
      })
    });
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

    if (!this.state.brand1RowData || !this.state.brand2RowData) {
      return <div>Loading...</div>
    }

    const brandComparison = this.props.apiResourceObject;
    return <div>
      <Card>
        <CardHeader className="d-flex justify-content-between ">
          <BrandComparisonRenameButton
            brandComparison={brandComparison}
            onComparisonChange={this.handleComparisonChange}/>
          <div>
            <BrandComparisonSelectStoresButton
              brandComparison={brandComparison}
              onComparisonChange={this.handleComparisonChange}/>
            <BrandComparisonPriceTypeButton
              brandComparison={brandComparison}
              onComparisonChange={this.handleComparisonChange}/>
            <BrandComparisonDeleteButton
              brandComparison={brandComparison}
              callback={this.deleteCallback}/>
          </div>
        </CardHeader>
        <CardBody>
          <BrandComparisonTable
            brandComparison={brandComparison}
            onComparisonChange={this.handleComparisonChange}
            brand1RowData={this.state.brand1RowData}
            brand2RowData={this.state.brand2RowData}
          />
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