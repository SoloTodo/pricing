import React from 'react'
import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {connect} from "react-redux";
import moment from "moment";

class SkuDetailPositionHistoryChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entityPositions: undefined
    }
  }

  userHasPositionPermissions = entity => {
    const store = this.props.stores.filter(store => store.url === entity.store)[0];
    const category = this.props.categories.filter(category => category.url === entity.category)[0];

    return store.permissions.includes('view_store_entity_positions')
      && category.permissions.includes('view_category_entity_positions')
  };

  componentDidMount() {
    if (this.userHasPositionPermissions(this.props.entity)) {
      const entity = this.props.entity;
      const positionEndpoint = `entity_section_positions/?entities=${entity.id}`;
      this.props.fetchAuth(positionEndpoint).then(json => {
        this.setState({
          entityPositions: json.results
        })
      })
    }
  }

  preparePositionHistoryChartData = () => {
    let result = [];
    const convertedData = {};

    for (const position of this.state.entityPositions) {
      const key = position.section.name;
      if (!convertedData[key]) {
        convertedData[key] = []
      }
      convertedData[key].push({
        timestamp: moment(position.entity_history.timestamp),
        value: position.value
      })
    }

    for (const section in convertedData) {
      let lastTimestampSeen = undefined;
      let positionHistory = [];

      for (const data of convertedData[section]) {
        const timestamp = data['timestamp'];

        if (lastTimestampSeen) {
          positionHistory = positionHistory.concat([])
        }

        let value = data['value'];
        lastTimestampSeen = timestamp;
        positionHistory.push({
          section,
          value,
          timestamp
        })
      }
      result.push({
        section,
        positionHistory
      })
    }

    console.log(result)
  };

  render() {
    if (!this.state.entityPositions) {
      return null
    }

    this.preparePositionHistoryChartData();
    return <div>Hola</div>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories'),
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores')
  }
}

export default connect(mapStateToProps)(SkuDetailPositionHistoryChart);