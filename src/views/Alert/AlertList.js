import React from 'react'
import {Row, Col, Card, CardHeader, CardBody} from "reactstrap";
import {connect} from "react-redux";
import {
  apiResourceStateToPropsUtils,
  filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";
import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormResultsTable,
  createOrderingOptionChoices
} from "../../react-utils/api_forms";
import {formatDateStr} from "../../react-utils/utils";
import {NavLink} from "react-router-dom";


class AlertList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      apiFormFieldChangeHandler: undefined,
      alerts: undefined,
    }
  }

  setApiFormFieldChangeHandler = apiFormFieldChangeHandler => {
    this.setState({
      apiFormFieldChangeHandler
    })
  };

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
        label: 'Tipo',
        renderer: result => result.entity? 'SKU' : 'Producto'
      },
      {
        label: 'Producto / SKU',
        renderer: result => result.entity?
          <span>
            <NavLink to={'/products/' + result.entity.product.id}>{result.entity.product.name}</NavLink>&nbsp;
            (<NavLink to={'/skus/' + result.entity.id}>{result.entity.sku}</NavLink>)
          </span> :
          <NavLink to={'/products/' + result.alert.product.id}>{result.alert.product.name}</NavLink>
      },
      {
        label: 'Tiendas',
        renderer: result => result.entity?
          this.props.stores.filter(store => store.url === result.entity.store)[0].name :
          <div>
            {result.alert.stores.map(store_url => <li key={store_url} className="list-without-decoration">
              {this.props.stores.filter(store => store.url === store_url)[0].name}
            </li>)}
          </div>
      },
      {
        label: 'Fecha creación',
        ordering: 'alert__creation_date',
        renderer: result => formatDateStr(result.alert.creation_date)
      }
    ];

    return <div>
      <ApiForm
        endpoints={['user_alerts/']}
        fields={['ordering']}
        onResultsChange={this.setAlerts}
        onFormValueChange={this.handleFormValueChange}
        setFieldChangeHandler={this.setApiFormFieldChangeHandler}>
        <ApiFormChoiceField
          name="ordering"
          choices={createOrderingOptionChoices(['id', 'alert__creation_date'])}
          hidden={true}
          initial='id'
          value={this.state.formValues.ordering}
          onChange={this.state.apiFormFieldChangeHandler}/>
      </ApiForm>
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader>Alertas</CardHeader>
            <CardBody>
              <ApiFormResultsTable
                results={this.state.alerts}
                columns={columns}
                ordering={this.state.formValues.ordering}
                onChange={this.state.apiFormFieldChangeHandler}/>
            </CardBody>
          </Card>

        </Col>
      </Row>
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