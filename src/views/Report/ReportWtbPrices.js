import React from 'react'
import {connect} from "react-redux";
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap'
import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormSubmitButton
} from "../../react-utils/api_forms";
import {
  filterApiResourceObjectsByType,
} from "../../react-utils/ApiResource";
import {pricingStateToPropsUtils} from "../../utils";


class ReportWtbPrices extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
      apiFormFieldChangeHandler: undefined,
      downloadLink: undefined
    }
  }

  setApiFormFieldChangeHandler = apiFormFieldChangeHandler => {
    this.setState({
      apiFormFieldChangeHandler
    })
  };

  handleFormValueChange = formValues => {
    this.setState({formValues})
  };

  setDownloadLink = json => {
    if (json) {
      window.location = json.payload.url;
      this.setState({
        downloadLink: undefined
      })
    } else {
      this.setState({
        downloadLink: null
      })
    }
  };

  render() {
    const price_type_choices = [{
      id: 'offer_price',
      name: 'Precio oferta'
    },{
      id: 'normal_price',
      name: 'Precio normal'
    }]

    return <Row>
      <Col sm="12">
        <Card>
          <CardHeader>
            <i className="fas fa-search"/>Filtros
          </CardHeader>
          <ApiForm
            endpoints={['reports/wtb_prices_report/']}
            fields={['wtb_brand', 'stores', 'price_type', 'submit']}
            onResultsChange={this.setDownloadLink}
            onFormValueChange={this.handleFormValueChange}
            setFieldChangeHandler={this.setApiFormFieldChangeHandler}
            requiresSubmit={true}>
            <CardBody>
              <Row className="api-form-filters">
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Marca</label>
                  <ApiFormChoiceField
                    name="wtb_brand"
                    required={true}
                    choices={this.props.wtb_brands}
                    onChange={this.state.apiFormFieldChangeHandler}
                    value={this.state.formValues.wtb_brand}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Tiendas</label>
                  <ApiFormChoiceField
                    name="stores"
                    choices={this.props.stores}
                    multiple={true}
                    placeholder="Todas"
                    searchable={true}
                    onChange={this.state.apiFormFieldChangeHandler}
                    value={this.state.formValues.stores}/>
                </Col>

                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Tipo precio</label>
                  <ApiFormChoiceField
                    name="price_type"
                    choices={price_type_choices}
                    onChange={this.state.apiFormFieldChangeHandler}
                    value={this.state.formValues.price_type}/>
                </Col>

                <Col xs="12" sm="7" md="6" lg="12" xl="12">
                  <label htmlFor="submit"/>
                  <ApiFormSubmitButton
                    value={this.state.formValues.submit}
                    label="Generar"
                    loadingLabel="Generando"
                    onChange={this.state.apiFormFieldChangeHandler}
                    loading={this.state.downloadLink === null}/>
                </Col>
              </Row>
            </CardBody>
          </ApiForm>
        </Card>
      </Col>
    </Row>
  }
}

function mapStateToProps(state) {
  const stores = filterApiResourceObjectsByType(state.apiResourceObjects, 'stores').filter(store => store.permissions.includes('view_store_reports'));
  const {user} = pricingStateToPropsUtils(state);

  return {
    user,
    stores,
    wtb_brands: filterApiResourceObjectsByType(state.apiResourceObjects, 'wtb_brands')
  }
}

export default connect(mapStateToProps)(ReportWtbPrices);
