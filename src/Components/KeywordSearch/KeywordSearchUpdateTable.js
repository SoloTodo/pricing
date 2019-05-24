import React from 'react'
import {NavLink} from "react-router-dom";
import {Table} from "reactstrap";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";

class KeywordSearchUpdateTable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      positions: []
    }
  }

  componentDidMount() {
    if (this.props.updateUrl) {
      const endpoint = this.props.updateUrl + 'positions/';
      this.props.fetchAuth(endpoint).then(positions => {
        this.setState({
          positions
        })
      })
    }
  }

  render() {
    return <Table striped>
      <thead>
      <tr>
        <th>SKU</th>
        <th>Posición</th>
      </tr>
      </thead>
      <tbody>
      {this.props.updateUrl? this.state.positions.map(position =>
        <tr key={position.value}>
          <td><NavLink to={'/skus/' + position.entity.id}>{position.entity.name}</NavLink></td>
          <td>{position.value}</td>
        </tr>) :
        <tr>
          <td colSpan="2"><i>No hay información de posiciones en este momento.</i></td>
        </tr>
      }
      </tbody>

    </Table>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth
  }
}

export default connect(mapStateToProps)(KeywordSearchUpdateTable);