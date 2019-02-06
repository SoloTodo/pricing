import React from 'react';
import {connect} from "react-redux";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormResultsTable,
  createOrderingOptionChoices
} from "../../react-utils/api_forms";
import moment from "moment";
import {settings} from "../../settings";
import NavLink from "react-router-dom/es/NavLink";

class StoreList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      formValues: {},
      apiFormFieldChangeHandler: undefined,
      stores: undefined,
      latestStoreUpdateLogs:undefined
    }
  }

  componentDidMount() {
    this.props.fetchAuth('store_update_logs/latest/')
      .then(latestStoreUpdateLogs => {
        this.setState({
          latestStoreUpdateLogs
        });
      })
  }

  setApiFormFieldChangeHandler = apiFormFieldChangeHandler => {
    this.setState({
      apiFormFieldChangeHandler
    })
  };

  setStores = json => {
    this.setState({
      stores: json ? json.payload : null
    })
  };

  handleFormValueChange = formValues => {
    this.setState({formValues})
  };

  render() {
    const columns = [
      {
        label: 'Nombre' ,
        ordering: 'name',
        renderer: entry => <NavLink to={'/stores/' + entry.id}>{entry.name}</NavLink>
      },
      {
        label: 'País',
        ordering: 'country',
        renderer: entry => entry.country.name
      },
      {
        label: 'Tipo',
        ordering: 'type',
        renderer: entry => entry.type.name
      },
      {
        label: "Última actualización",
        renderer: entry => {
          if (!this.state.latestStoreUpdateLogs) {
            return 'Cargando...'
          }
          const storeLog = this.state.latestStoreUpdateLogs[entry.url];
          return storeLog ? moment(storeLog.last_updated).format('lll') : 'N/A'
        },
        cssClasses: 'hidden-xs-down'
      },
      {
        label: "Estado",
        renderer: entry => {
          if (!this.state.latestStoreUpdateLogs) {
            return 'Cargando...'
          }
          const storeLog = this.state.latestStoreUpdateLogs[entry.url];

          if (!storeLog) {
            return 'N/A'
          }
          
          return settings.statusDict[storeLog.status];
        },
        cssClasses: 'hidden-xs-down'
      },
      {
        label: "Resultado",
        renderer: entry => {
          if (!this.state.latestStoreUpdateLogs) {
            return 'Cargando...'
          }
          const storeLog = this.state.latestStoreUpdateLogs[entry.url];

          if (!storeLog) {
            return 'N/A'
          }

          return storeLog.status === 3 ? `${storeLog.available_products_count} / ${storeLog.unavailable_products_count} / ${storeLog.discovery_urls_without_products_count}` : 'N/A'
        },
        cssClasses: 'hidden-xs-down'
      }
    ];

    return <div className="animated fadeIn">
      <ApiForm
          endpoints={["stores/"]}
          fields={['ordering']}
          onResultsChange={this.setStores}
          onFormValueChange={this.handleFormValueChange}
          setFieldChangeHandler={this.setApiFormFieldChangeHandler}>
        <ApiFormChoiceField
          name="ordering"
          choices={createOrderingOptionChoices(['name', 'country', 'type'])}
          hidden={true}
          initial="name"
          value={this.state.formValues.ordering}
          onChange={this.state.apiFormFieldChangeHandler}
        />
      </ApiForm>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <i className="fa fa-align-justify"/>Tiendas
            </div>
            <div className="card-block">
              <ApiFormResultsTable
                results={this.state.stores}
                columns={columns}
                ordering={this.state.formValues.ordering}
                onChange={this.state.apiFormFieldChangeHandler}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  return {
    fetchAuth
  }
}

export default connect(mapStateToProps)(StoreList);