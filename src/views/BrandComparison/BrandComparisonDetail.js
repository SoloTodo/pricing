import React from 'react'
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
} from 'reactstrap'

import BrandComparisonRenameButton from '../../Components/BrandComparison/BrandComparisonRenameButton'
import BrandComparisonPriceTypeButton from '../../Components/BrandComparison/BrandComparisonPriceTypeButton'
import BrandComparisonDeleteButton from '../../Components/BrandComparison/BrandComparisonDeleteButton'
import {Redirect} from "react-router-dom";

class BrandComparisonDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleted: false,
      editingName: false
    };
  }

  toggleEditingName = () => {
    this.setState({
      editingName: !this.state.editingName,
    });
  };

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
          {this.state.editingName?
            <BrandComparisonRenameButton
              brandComparison={this.props.apiResourceObject}
              callback={this.toggleEditingName}
            /> :
            <span className="align-self-center">
              {brandComparison.name}
              <Button color="link" className="pl-1">
                <i className="fa fa-pencil" onClick={this.toggleEditingName}/>
              </Button>
            </span>
          }
          <div>
            <Button color="primary" className="mr-2">Tiendas</Button>
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
  const {ApiResourceObject, fetchAuth} = apiResourceStateToPropsUtils(state);
  return {
    fetchAuth,
    ApiResourceObject
  }
}

export default connect(mapStateToProps)(BrandComparisonDetail);