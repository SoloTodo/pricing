import React from 'react'
import {ApiFormResultTableWithPagination} from '../react-utils/api_forms'

class PricingFormResultTableWithPagination extends React.Component {
  render() {
    return <ApiFormResultTableWithPagination icon="fas fa-list" cardClass="card-body" {...this.props}/>
  }
}

export default PricingFormResultTableWithPagination;