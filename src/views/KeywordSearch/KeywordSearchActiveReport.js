import React from 'react'
import {connect} from "react-redux";
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap'

import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormSubmitButton
} from "../../react-utils/api_forms";
import {filterApiResourceObjectsByType} from "../../react-utils/ApiResource";

class KeywordSearchActiveReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadLink:undefined
    }
  }

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
    return <ApiForm
      endpoints={['keyword_searches/active_positions_report/']}
      fields={['store', 'categories', 'brands', 'submit']}
      onResultsChange={this.setDownloadLink}
      requiresSubmit={true}>
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader>
              <i className="fas fa-search"/> Filtros
            </CardHeader>
            <CardBody>
              <Row className="api-form-filters">
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Tienda</label>
                  <ApiFormChoiceField
                    name="store"
                    required={true}
                    choices={this.props.stores}
                    searchable={true}/>
                </Col>
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Categorías</label>
                  <ApiFormChoiceField
                    name="categories"
                    choices={this.props.categories}
                    multiple={true}
                    placeholder='Todas'
                    searchable={true}/>
                </Col>
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Marcas</label>
                  <ApiFormChoiceField
                    name="brands"
                    choices={this.props.brands}
                    multiple={true}
                    placeholder='Todas'
                    searchable={true}/>
                </Col>
                <Col xs="12" sm="7" md="6" lg="12" xl="12">
                  <label htmlFor="submit">&nbsp;</label>
                  <ApiFormSubmitButton
                    label='Generar'
                    loadingLabel='Generando'/>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </ApiForm>
  }
}

function mapStateToProps(state) {
  const validStoresIds = [60, 18, 5, 11, 30, 88, 43, 9, 67, 87, 260];
  return {
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores').filter(store => store.permissions.includes('create_store_keyword_search') && validStoresIds.includes(store.id)),
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories').filter(category => category.permissions.includes('create_category_keyword_search')),
    brands: filterApiResourceObjectsByType(state.apiResourceObjects, 'brands'),
  }
}

export default connect(mapStateToProps)(KeywordSearchActiveReport);
