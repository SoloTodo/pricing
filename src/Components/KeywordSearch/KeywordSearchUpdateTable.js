import React from 'react'
import {NavLink} from "react-router-dom";
import {Table} from "reactstrap";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";

class KeywordSearchUpdateTable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      update: undefined,
      positions: []
    }
  }

  componentDidMount() {
    if (this.props.updateUrl) {
      const endpoint = this.props.updateUrl + 'positions/';
      this.props.fetchAuth(this.props.updateUrl).then(update => {
        this.setState({
          update
        })
      });
      this.props.fetchAuth(endpoint).then(positions => {
        this.setState({
          positions
        })
      })
    }
  }

  render() {
    const SUCESS = 2;
    const ERROR = 3;

    if (!this.state.update || !this.state.positions) {
      return <div/>
    }

    let noProductsMessage = "Búsqueda de keyword en Proceso.";

    // Exitoso
    if (this.state.update.status === SUCESS) {
      noProductsMessage = "La búsqueda del keyword no generó ningún resultado."
    }

    // Error
    if (this.state.update.status === ERROR) {
      noProductsMessage = "Ocurrió un error durante la búsqueda del keyword."
    }

    return <Table striped>
      <thead>
      <tr>
        <th>SKU</th>
        <th>Posición</th>
      </tr>
      </thead>
      <tbody>
      {this.state.positions.length ? this.state.positions.map(position =>
        <tr key={position.value}>
          <td><NavLink to={'/skus/' + position.entity.id}>{position.entity.name}</NavLink></td>
          <td>{position.value}</td>
        </tr>) :
        <tr>
          <td colSpan="2"><i>{noProductsMessage}</i></td>
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