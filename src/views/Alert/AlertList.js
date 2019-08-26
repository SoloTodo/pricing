import React from 'react'
import {Row, Col} from "reactstrap";
import {connect} from "react-redux";
import {
  apiResourceStateToPropsUtils,
  filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";
import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormResultTableWithPagination,
  createOrderingOptionChoices
} from "../../react-utils/api_forms";
import {formatDateStr} from "../../react-utils/utils";
import {NavLink} from "react-router-dom";


class AlertList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      alerts: undefined,
    }
  }

  setAlerts = json => {
    this.setState({
      alerts: json ? json.payload : null
    })
  };

  handleFormValueChange = formValues => {
    this.setState({formValues})
  };


  render() {
    const columns = [
      {
        label: 'Id',
        ordering: 'id',
        renderer: result => <NavLink to={'/alerts/' + result.id}>{result.id}</NavLink>
      },
      {
        label: 'Producto / SKU',
        renderer: result => result.entity?
          <span>
            <NavLink to={'/products/' + result.product.id}>{result.product.name}</NavLink>&nbsp;
            (<NavLink to={'/skus/' + result.entity.id}>{result.entity.sku}</NavLink>)
          </span> :
          <NavLink to={'/products/' + result.product.id}>{result.product.name}</NavLink>
      },
      {
        label: 'Tiendas',
        renderer: result => result.entity?
          this.props.stores.filter(store => store.url === result.entity.store)[0].name :
          <div>
            {result.stores.map(store_url => <li key={store_url} className="list-without-decoration">
              {this.props.stores.filter(store => store.url === store_url)[0].name}
            </li>)}
          </div>
      },
      {
        label: 'Fecha creación',
        ordering: 'creation_date',
        renderer: result => formatDateStr(result.creationDate)
      }
    ];

    return <div>
      <ApiForm
        endpoints={['alerts/']}
        fields={['ordering', 'page', 'page_size']}
        onResultsChange={this.setAlerts}
        onFormValueChange={this.handleFormValueChange}>
        <ApiFormChoiceField
          name="ordering"
          choices={createOrderingOptionChoices(['id', 'creation_date'])}
          hidden={true}
          initial='id' />
        <Row>
          <Col sm="12">
            <ApiFormResultTableWithPagination
              icon="fas fa-list"
              label="Alertas"
              cardClass="card-body"
              page_size_choices={[10, 25, 50]}
              page={this.state.formValues.page}
              page_size={this.state.formValues.page_size}
              data={this.state.alerts}
              columns={columns}
              ordering={this.state.formValues.ordering}/>
          </Col>
        </Row>
      </ApiForm>
    </div>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores')
  }
}

export default connect(mapStateToProps)(AlertList);