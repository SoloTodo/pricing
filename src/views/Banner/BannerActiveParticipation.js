import React from 'react'
import {ApiForm, ApiFormChoiceField, ApiFormResultsTable} from "../../react-utils/api_forms";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import Card from "reactstrap/es/Card";
import CardHeader from "reactstrap/es/CardHeader";
import CardBody from "reactstrap/es/CardBody";
import {filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {connect} from "react-redux";

class BannerActiveParticipation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      apiFormFieldChangeHandler: undefined,
      participation: undefined
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

  setParticipation = json => {
    this.setState({
      participation: json ? json.payload : null
    });
  };

  render() {
    const groupingFieldLabel = 'Marca';

    const groupingFields = [
      {id: 'brand', name: 'Marca'},
      {id: 'category', name: 'Categoría'},
      {id: 'store', name: 'Tienda'},
      {id: 'section', name: 'Section'},
      {id: 'subsection_type', name: 'Tipo subsección'}
    ];

    const columns = [
      {
        label: groupingFieldLabel,
        renderer: result => result.groupingLabel
      },
      {
        label: 'Participación (puntaje)',
        renderer: result => result.participationScore
      },
      {
        label: 'Participación (%)',
        renderer: result => result.participationPercentage
      },
      {
        label: 'Posición promedio',
        renderer: result => result.positionAvg
      }
    ];

    return <div>
      <ApiForm
        endpoints={["banners/active_participation/"]}
        fields={['grouping_field', 'stores']}
        onResultsChange={this.setParticipation}
        onFormValueChange={this.handleFormValueChange}
        setFieldChangeHandler={this.setApiFormFieldChangeHandler}>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader><i className="fas fa-search">&nbsp;</i>Filtros</CardHeader>
              <CardBody>
                <Row className="api-form-filters">
                  <Col xs="12" sm="6" md="6" lg="6" xl="6">
                    <label>Agrupar por</label>
                    <ApiFormChoiceField
                      name="grouping_field"
                      choices={groupingFields}
                      required={true}
                      placeholder='Todas'
                      onChange={this.state.apiFormFieldChangeHandler}
                      value={this.state.formValues.stores}
                    />
                  </Col>
                  <Col xs="12" sm="6" md="6" lg="6" xl="6">
                    <label>Tiendas</label>
                    <ApiFormChoiceField
                      name="stores"
                      multiple={true}
                      choices={this.props.stores}
                      placeholder='Todas'
                      onChange={this.state.apiFormFieldChangeHandler}
                      value={this.state.formValues.stores}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ApiForm>
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader>Participación</CardHeader>
            <CardBody>
              <ApiFormResultsTable
                results={this.state.participation}
                columns={columns}
                onChange={this.state.apiFormFieldChangeHandler}/>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  }
}

function mapStateToProps(state) {
  return {
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores'),
  }
}

export default connect(mapStateToProps)(BannerActiveParticipation);