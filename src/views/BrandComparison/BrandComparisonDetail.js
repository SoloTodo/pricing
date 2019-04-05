import React from 'react'
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {Card, CardHeader, CardBody} from 'reactstrap'

import BrandComparisonRenameButton from '../../Components/BrandComparison/BrandComparisonRenameButton'
import BrandComparisonPriceTypeButton from '../../Components/BrandComparison/BrandComparisonPriceTypeButton'
import BrandComparisonDeleteButton from '../../Components/BrandComparison/BrandComparisonDeleteButton'
import BrandComparisonSelectStoresButton from '../../Components/BrandComparison/BrandComparisonSelectStoresButton'
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

  render() {
    if (this.state.deleted){
      return <Redirect to={{pathname: '/brand_comparisons'}}/>
    }
    const brandComparison = this.props.apiResourceObject;
    return <div>
      <Card>
        <CardHeader className="d-flex justify-content-between ">
          <BrandComparisonRenameButton
            brandComparison={brandComparison}/>
          <div>
            <BrandComparisonSelectStoresButton
              brandComparison={brandComparison}/>
            <BrandComparisonPriceTypeButton
              brandComparison={brandComparison}/>
            <BrandComparisonDeleteButton
              brandComparison={brandComparison}
              callback={this.deleteCallback}/>
          </div>
        </CardHeader>
        <CardBody>

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

export default connect(mapStateToProps)(BrandComparisonDetail);