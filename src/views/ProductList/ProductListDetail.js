import React from 'react'
import {Redirect} from "react-router-dom";

export default class ProductListDetail extends React.Component{
  render() {
    return <Redirect to={{pathname: '/product_lists'}}/>
  }
}