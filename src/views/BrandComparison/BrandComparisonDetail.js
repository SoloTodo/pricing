import React from 'react'
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {Card, CardHeader, CardBody} from 'reactstrap'

import BrandComparisonRenameButton from '../../Components/BrandComparison/BrandComparisonRenameButton'
import BrandComparisonPriceTypeButton from '../../Components/BrandComparison/BrandComparisonPriceTypeButton'
import BrandComparisonDeleteButton from '../../Components/BrandComparison/BrandComparisonDeleteButton'
import BrandComparisonSelectStoresButton from '../../Components/BrandComparison/BrandComparisonSelectStoresButton'
import BrandComparisonTable from './BrandComparisonTable'
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class BrandComparisonDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleted: false,
    };
  }

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
            onComparisonChange={this.handleComparisonChange}/>
        </CardBody>
      </Card>
    </div>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  return {
    fetchAuth,
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