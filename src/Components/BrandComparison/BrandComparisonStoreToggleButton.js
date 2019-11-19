import React from 'react'
import {Button} from "reactstrap";

export default class BrandComparisonStoreToggleButton extends React.Component {
  render() {
    return <Button color="primary" className="mr-2" onClick={this.props.toggleStoreDisplay}>
      {this.props.displayStores ? 'Ocultar tiendas' : 'Mostrar tiendas'}
    </Button>
  }
}