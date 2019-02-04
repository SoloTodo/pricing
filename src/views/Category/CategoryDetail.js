import React from 'react'
import {Redirect} from "react-router-dom";

export default class CategoryDetail extends React.Component{
  render() {
    return <Redirect to={{pathname: '/categories'}}/>
  }
}