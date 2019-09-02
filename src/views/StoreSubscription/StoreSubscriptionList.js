import React from 'react'
import {connect} from "react-redux"
import moment from "moment";
import {Row, Col} from "reactstrap";

import {filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {formatDateStr} from "../../react-utils/utils";
import {
  ApiForm,
  ApiFormResultTableWithPagination,
} from "../../react-utils/api_forms";

import StoreSubscriptionCreateButton from "../../Components/StoreSubscription/StoreSubscriptionCreateButton";
import StoreSubscriptionDeleteButton from "../../Components/StoreSubscription/StoreSubscriptionDeleteButton";


class StoreSubscriptionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      storeSubscriptions: undefined,
      endpoint: 'store_subscriptions/'
    }
  }

  handleFormValueChange = formValues => {
    this.setState({
      formValues
    })
  };

  setStoreSubscriptions = json => {
    this.setState({
      storeSubscriptions: json? json.payload: null
    })
  };

  updateEndpoint = () => {
    this.setState({
      endpoint: 'store_subscriptions/?_='+moment().format()
    })
  };

  render() {
    const columns = [
      {
        label: 'Tienda',
        renderer: storeSubscription => this.props.stores.filter(store => store.url === storeSubscription.store.url)[0].name
      },
      {
        label: 'Categorías',
        renderer: storeSubscription => <div>
          {storeSubscription.categories.map(categoryUrl => {
            const category = this.props.categories.filter(category => category.url === categoryUrl)[0];
            return <li className="list-without-decoration" key={category.id}>
              {category.name}
            </li>})
          }
        </div>
      },
      {
        label: 'Fecha creación',
        renderer: storeSubscription => formatDateStr(storeSubscription.creationDate)
      },
      {
        label: 'Eliminar',
        renderer: storeSubscription => <StoreSubscriptionDeleteButton
          subscription={storeSubscription}
          onSubscriptionDelete={this.updateEndpoint}/>
      }
    ];

    return <div>
      <ApiForm
        endpoints={[this.state.endpoint]}
        fields={['page', 'page_size']}
        onResultsChange={this.setStoreSubscriptions}
        onFormValueChange={this.handleFormValueChange}>
        <Row>
          <Col sm="12">
            <ApiFormResultTableWithPagination
              icon="fas fa-list"
              label="Suscripciones a Tiendas"
              cardClass="card-body"
              headerButton={<StoreSubscriptionCreateButton callback={this.updateEndpoint}/>}
              page_size_choices={[10, 20, 50]}
              page={this.state.formValues.page}
              page_size={this.state.formValues.page_size}
              data={this.state.storeSubscriptions}
              columns={columns}/>
          </Col>
        </Row>
      </ApiForm>
    </div>
  }
}

function mapStateToProps(state) {
  return {
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores'),
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories')
  }
}

export default connect(mapStateToProps)(StoreSubscriptionList)