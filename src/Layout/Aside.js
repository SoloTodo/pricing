import React from 'react';
import { connect } from 'react-redux';
import { Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, UncontrolledCollapse} from 'reactstrap';
import classNames from 'classnames';
import {
  apiResourceObjectForeignKey,
  apiResourceStateToPropsUtils,
  filterApiResourceObjectsByType
} from "../../src/react-utils/ApiResource";
import {pricingStateToPropsUtils} from "../../src/utils";

class Aside extends React.Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const selectedCurrency = this.props.currency;
    const selectedNumberFormat = this.props.numberFormat;
    const user = this.props.ApiResourceObject(this.props.user);

    return (
      <React.Fragment>
        <Nav tabs>
          <NavItem>
            <NavLink className={classNames({ active: this.state.activeTab === '1' })}
                     onClick={() => {
                       this.toggle('1');
                     }}>
              <i className="icon-settings"/>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1" className="p-1">
            <div className="text-center"><span>Preferencias</span></div>
            <ListGroup flush>
              <ListGroupItem tag="a" id="currency" href="#" action>
                <i className="fa fa-usd"/>&nbsp;Moneda: <strong>{selectedCurrency && selectedCurrency.iso_code}</strong>
              </ListGroupItem>
              <UncontrolledCollapse toggler="#currency">
                  {this.props.currencies.map(currency => (
                    <ListGroupItem key={currency.url}>
                      <a href="/" onClick={(e) => this.props.setUserProperty(e, user, 'preferredCurrency', currency, this.props.authToken)}><i className={currency === selectedCurrency ? 'fa fa-check' : ''}/> { currency.name }</a>
                    </ListGroupItem>
                  ))}
              </UncontrolledCollapse>
              <ListGroupItem tag="a" id="format" href="#" action>
                <i className="fa fa-globe"/>&nbsp;Formato número: <strong>{ selectedNumberFormat && selectedNumberFormat.name }</strong>
              </ListGroupItem>
              <UncontrolledCollapse toggler="#format">
                  {this.props.numberFormats.map(numberFormat => (
                      <ListGroupItem className="nav-item" key={numberFormat.url}>
                        <a className="nav-link" href="/" onClick={(e) => this.props.setUserProperty(e, user, 'preferredNumberFormat', numberFormat, this.props.authToken)}><i className={(numberFormat === selectedNumberFormat && 'fa fa-check') || ''}/> { numberFormat.name }</a>
                      </ListGroupItem>
                  ))}
              </UncontrolledCollapse>
            </ListGroup>
          </TabPane>
        </TabContent>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const {ApiResourceObject, authToken} = apiResourceStateToPropsUtils(state);
  const {user} = pricingStateToPropsUtils(state);

  const apiResourceObjects = state.apiResourceObjects;
  return {
    ApiResourceObject,
    user,
    authToken,
    currencies: filterApiResourceObjectsByType(apiResourceObjects, 'currencies'),
    currency: apiResourceObjectForeignKey(user, 'preferred_currency', state),
    numberFormats: filterApiResourceObjectsByType(apiResourceObjects, 'number_formats'),
    numberFormat: apiResourceObjectForeignKey(user, 'preferred_number_format', state),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUserProperty: (e, user, property, value, authToken) => {
      e.preventDefault();

      user[property] = value;
      user.save(authToken, dispatch);
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Aside);
