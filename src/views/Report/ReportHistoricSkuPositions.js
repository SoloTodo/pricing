import React from 'react'
import {connect} from "react-redux";

import {filterApiResourceObjectsByType} from "../../react-utils/ApiResource";

class ReportHistoricSkuPositions extends React.Component {
  render() {
    return <div>Pendiente</div>
  }
}

function mapStateToProps(state) {
  return {
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores').filter(store => store.permissions.includes('view_store_entity_positions')),
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories').filter(category => category.permissions.includes('view_category_entity_positions')),
    brands: filterApiResourceObjectsByType(state.apiResourceObjects, 'brands'),
  }
}

export default connect(mapStateToProps)(ReportHistoricSkuPositions);
