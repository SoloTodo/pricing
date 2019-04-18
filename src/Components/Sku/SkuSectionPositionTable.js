import React from 'react'
import {connect} from 'react-redux'
import {Card, CardHeader, CardBody, Table} from 'reactstrap'

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class SkuSectionPositionTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entityPositions: undefined
    }
  }

  userHasPositionPermissions = entity => {
    return entity.store.permissions.includes('view_store_entity_positions')
      && entity.category.permissions.includes('view_category_entity_positions')
  };

  componentDidMount() {
    if (this.userHasPositionPermissions(this.props.entity)) {
      const entity = this.props.entity;
      const positionEndpoint = `entity_section_positions/?entities=${entity.id}&is_active=1`;
      this.props.fetchAuth(positionEndpoint).then(json => {
        this.setState({
          entityPositions: json.results
        })
      })
    }
  }

  render() {
    if (!this.state.entityPositions) {
      return null;
    }

    console.log(this.state.entityPositions);

    let content;

    if (this.props.entity.activeRegistry) {
      if (this.state.entityPositions.length) {
        content = <Table striped>
          <thead>
          <tr>
            <th>Sección</th>
            <th>Posición</th>
          </tr>
          </thead>
          <tbody>
          {this.state.entityPositions.map(position =>
            <tr key={position.id}>
              <td>{position.section.name}</td>
              <td>{position.value}</td>
            </tr>
          )}
          </tbody>
        </Table>
      } else {
        content = <em>Este SKU no contiene información de posicionamiento.</em>
      }
    } else {
      content = <em>Este SKU no está listado actualmente en el sitio del retailer.</em>
    }

    return <Card>
      <CardHeader> Posicionamiento actual</CardHeader>
      <CardBody>
        {content}
      </CardBody>
    </Card>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
  }
}

export default connect(mapStateToProps)(SkuSectionPositionTable);