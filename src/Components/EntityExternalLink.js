import React, {Component} from 'react'
import {Link} from "react-router-dom";

export default class EntityExternalLink extends Component {
  render() {
    const entity = this.props.entity;

    return <div>
      <Link to={'/skus/' + entity.id}>
        {this.props.label}
      </Link>
      <a href={entity.external_url} target="_blank" rel="noopener noreferrer" className="ml-2">
        <span className="fas fa-link">&nbsp;</span>
      </a>
    </div>
  }
}