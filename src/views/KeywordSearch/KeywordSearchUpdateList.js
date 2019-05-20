import React from 'react'
import {ApiForm, ApiFormResultTableWithPagination} from "../../react-utils/api_forms";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import {formatDateStr} from "../../react-utils/utils";
import {NavLink} from "react-router-dom";

class KeywordSearchUpdateList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      updates: undefined
    }
  }

  handleFormValueChange = formValues => {
    this.setState({
      formValues
    })
  };

  setUpdates = json => {
    this.setState({
      updates: json? json.payload : null
    })
  };

  render() {
    const keyword_search = this.props.apiResourceObject;
    const endpoint = 'keyword_search_updates/?searches=' + keyword_search.id;

    const status_dict={
      1: 'En proceso',
      2: 'Exitosa',
      3: 'Error'
    };

    const columns = [
      {
        label: 'Id',
        renderer: update => <NavLink to={'/keyword_search_updates/' + update.id}>{update.id}</NavLink>
      },
      {
        label: 'Fecha',
        renderer: update => formatDateStr(update.creation_date)
      },
      {
        label: 'Estado',
        renderer: update => status_dict[update.status]
      }
    ];

    return <ApiForm
      endpoints={[endpoint]}
      fields={['page', 'page_size']}
      onResultsChange={this.setUpdates}
      onFormValueChange={this.handleFormValueChange}>
      <Row>
        <Col sm="12">
          <ApiFormResultTableWithPagination
            icon="fas fa-list"
            cardClass="card-body"
            page_size_choices={[10, 20, 50]}
            page={this.state.formValues.page}
            page_size={this.state.formValues.page_size}
            data={this.state.updates}
            columns={columns}
          />
        </Col>
      </Row>

    </ApiForm>
  }
}

export default KeywordSearchUpdateList