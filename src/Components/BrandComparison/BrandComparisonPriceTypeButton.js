import React from 'react'
import {DropdownMenu, DropdownToggle, UncontrolledButtonDropdown} from "reactstrap";
import ListGroupItem from "reactstrap/es/ListGroupItem";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";

class BrandComparisonPriceTypeButton extends React.Component {
  constructor(props) {
    super(props);
    this.priceTypes = {
      'normal': 'Normal',
      'offer': 'Oferta'
    }
  }

  priceTypeChangeHandler = priceType => {
    if (priceType === this.props.brandComparison.price_type) {
      return
    }

    this.props.fetchAuth(`brand_comparisons/${this.props.brandComparison.id}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        price_type: priceType
      })
    }).then(json => {
      this.props.fetchAuth(`brand_comparisons/${this.props.brandComparison.id}/`).then(json => {
        this.props.addBrandComparison(json);
      });
    });
  };

  render() {
    const brandComparison = this.props.brandComparison;
    return <UncontrolledButtonDropdown className="mr-2">
      <DropdownToggle color="primary" caret>Tipo Precio: {this.priceTypes[brandComparison.price_type]}</DropdownToggle>
      <DropdownMenu>
        <ListGroupItem className="d-flex justify-content-between" action onClick={() => this.priceTypeChangeHandler('normal')}>
          Normal {brandComparison.price_type === 'normal'? <i className="fa fa-check"/>:''}
        </ListGroupItem>
        <ListGroupItem className="d-flex justify-content-between" action onClick={() => this.priceTypeChangeHandler('offer')}>
          Oferta {brandComparison.price_type === 'offer'? <i className="fa fa-check"/>:''}
        </ListGroupItem>
      </DropdownMenu>
    </UncontrolledButtonDropdown>
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
    addBrandComparison: brandComparison => {
      return dispatch({
        type: 'addApiResourceObject',
        apiResource: brandComparison
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandComparisonPriceTypeButton);