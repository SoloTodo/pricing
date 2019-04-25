import React from 'react'
import {connect} from "react-redux";
import {Row, Col, Card, CardHeader, CardBody} from "reactstrap";

import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormSubmitButton,
  ApiFormTextField
} from "../../react-utils/api_forms";

import {filterApiResourceObjectsByType} from "../../react-utils/ApiResource";

class StoreCurrentSkuPositionsReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      downloadLink: undefined
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
      endpoints={[`stores/${this.props.apiResourceObject.id}/current_entity_positions_report/`]}
      fields={['categories', 'brands', 'position_threshold', 'submit']}
      onResultsChange={this.setDownloadLink}
      requiresSubmit={true}>
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader>
              <i className="fas fa-search">&nbsp;</i>Filtros
            </CardHeader>
            <CardBody>
              <Row className="api-form-filters">
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Categorías</label>
                  <ApiFormChoiceField
                    name="categories"
                    multiple={true}
                    choices={this.props.categories}
                    searchable={true}
                    placeholder="Todas"/>
                </Col>
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Marcas</label>
                  <ApiFormChoiceField
                    name="brands"
                    multiple={true}
                    choices={this.props.brands}
                    searchable={true}
                    placeholder="Todas"/>
                </Col>
                <Col xs="12" sm="6" md="6" lg="6" xl="6">
                  <label>Threshold</label>
                  <ApiFormTextField
                    name="position_threshold"
                    debounceTimeout={1}/>
                </Col>
                <Col xs="12" sm="7" md="6" lg="12" xl="12">
                  <label htmlFor="submit">&nbsp;</label>
                  <ApiFormSubmitButton
                    label="Generar"
                    loadingLabel="Generando"
                    loading={this.state.downloadLink === null}/>
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
  return {
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories').filter(category => category.permissions.includes('view_category_entity_positions')),
    brands: filterApiResourceObjectsByType(state.apiResourceObjects, 'brands'),
  }
}

export default connect(mapStateToProps)(StoreCurrentSkuPositionsReport);
