import React from 'react'
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  DropdownToggle,
  DropdownMenu, ListGroupItem, UncontrolledButtonDropdown
} from 'reactstrap'

import {toast} from "react-toastify";
import BrandComparisonRenameButton from '../../Components/BrandComparison/BrandComparisonRenameButton'
import BrandComparisonPriceTypeButton from '../../Components/BrandComparison/BrandComparisonPriceTypeButton'
import BrandComparisonDeleteButton from '../../Components/BrandComparison/BrandComparisonDeleteButton'
import BrandComparisonSelectStoresButton from '../../Components/BrandComparison/BrandComparisonSelectStoresButton'
import BrandComparisonPendingProductsButton from "../../Components/BrandComparison/BrandComparisonPendingProductsButton";
import BrandComparisonTable from './BrandComparisonTable'

import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {areListsEqual} from "../../react-utils/utils";
import BrandComparisonManualProductsButton from "../../Components/BrandComparison/BrandComparisonManualProductsButton";
import BrandComparisonStoreToggleButton
  from "../../Components/BrandComparison/BrandComparisonStoreToggleButton";
import BrandComparisonAlertsButton from "../../Components/BrandComparison/BrandComparisonAlertsButton";


class BrandComparisonDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleted: false,
      displayStores: true
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

  handleReportButtonClick = (e, reportFormat) => {
    e.preventDefault();
    const toastId = toast.info('Generando reporte, espere un momento por favor', {autoClose: false})

    this.props.fetchAuth(`brand_comparisons/${this.props.apiResourceObject.id}/?export_format=${reportFormat || 'xls'}`).then(json => {
      toast.dismiss(toastId);
      toast.success('Descargando reporte')
      window.location = json.url;
    })
  };

  setRowData = async (brandIndex, comparison) => {
    comparison = comparison || this.props.apiResourceObject;
    const otherIndex = (brandIndex%2)+1;
    const otherBrand = comparison[`brand_${otherIndex}`];

    const categoryId = comparison.category.id;
    const selectedStores = comparison.stores.map(store_url => this.props.stores.filter(store => store.url === store_url)[0].id);

    let endpoint = `categories/${categoryId}/full_browse/?`;

    for (const storeId of selectedStores) {
      endpoint += `stores=${storeId}&`
    }

    const promises = [
      this.props.fetchAuth(endpoint + `db_brands=${comparison[`brand_${brandIndex}`].id}`).then(json => json['results'])
    ];

    if (comparison.manual_products.length > 0) {
      let mpEndpoint = `products/available_entities/?`;

      for (const manual_product of comparison.manual_products) {
        mpEndpoint += `ids=${manual_product.id}&`
      }

      for (const storeId of selectedStores) {
        mpEndpoint += `stores=${storeId}&`
      }

      promises.push(this.props.fetchAuth(mpEndpoint).then(json => {
        const extraRowData = json['results'];
        return extraRowData.filter(data => data.product.brand !== otherBrand.url);
      }));
    }

    const rawRowData =  await Promise.all(promises).then(res => res.flat());

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

    this.setRowData(1, updatedBrandComparison);
    this.setRowData(2, updatedBrandComparison);
  };

  toggleStoreDisplay = () => {
    this.setState({
      displayStores: !this.state.displayStores
    })
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
            <BrandComparisonAlertsButton
              brandComparison={brandComparison}/>
            <BrandComparisonManualProductsButton
              brandComparison={brandComparison}
              handleComparisonChange={this.handleComparisonChange}/>
            <BrandComparisonPendingProductsButton
              brandComparison={brandComparison}
              brand1RowData={brand1RowData}
              brand2RowData={brand2RowData}/>
            <BrandComparisonSelectStoresButton
              brandComparison={brandComparison}
              onComparisonChange={this.handleComparisonChange}/>
            <BrandComparisonStoreToggleButton
              displayStores={this.state.displayStores}
              toggleStoreDisplay={this.toggleStoreDisplay}
            />
            <BrandComparisonPriceTypeButton
              brandComparison={brandComparison}
              onComparisonChange={this.handleComparisonChange}/>
            <UncontrolledButtonDropdown className="mr-2">
              <DropdownToggle color="primary" caret>Descargar</DropdownToggle>
              <DropdownMenu>
                <ListGroupItem className="d-flex justify-content-between" action onClick={evt => this.handleReportButtonClick(evt, 'xls')}>
                  Formato 1
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between" action onClick={evt => this.handleReportButtonClick(evt, 'xls_2')}>
                  Formato 2
                </ListGroupItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
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
            brand2RowData={brand2RowData}
            displayStores={this.state.displayStores}
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