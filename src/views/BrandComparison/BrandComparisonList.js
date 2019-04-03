import React from 'react'
import {connect} from "react-redux";
import {Card, CardBody, CardHeader, Col, Row} from "reactstrap";

import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormResultsTable, createOrderingOptionChoices,
} from "../../react-utils/api_forms";

import {
  apiResourceStateToPropsUtils,
  filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";



class BrandComparisonList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      brandComparisons: undefined
    }
  }

  handleFormValueChange = formValues => {
    this.setState({formValues})
  };

  setBrandComparisons = json => {
    this.setState({
      brandComparisons: json? json.payload : null
    });
  };

  render() {
    const columns = [
      {
        label: 'Nombre',
        ordering: 'name',
        renderer: brandComparison => brandComparison.name
      },
      {
        label: 'Categoría',
        ordering: 'category',
        renderer: brandComparison => brandComparison.category.name
      },
      {
        label: 'Marca 1',
        renderer: brandComparison => brandComparison.brand_1.name
      },
      {
        label: 'Marca 2',
        renderer: brandComparison => brandComparison.brand_2.name
      }
    ];

    return <ApiForm
      endpoints={['brand_comparisons/']}
      fields={['ordering']}
      onResultsChange={this.setBrandComparisons}
      onFormValueChange={this.handleFormValueChange}>
      <ApiFormChoiceField
        name="ordering"
        choices={createOrderingOptionChoices(['name', 'category'])}
        initial='name'
        hidden={true}
        value={this.state.formValues.ordering}/>
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader>Lista</CardHeader>
            <CardBody>
              <ApiFormResultsTable
                results={this.state.brandComparisons}
                columns={columns}
                ordering={this.state.formValues.ordering}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </ApiForm>
  }
}

function mapStateToProps(state) {
  const {ApiResourceObject} = apiResourceStateToPropsUtils(state);

  return {
    ApiResourceObject,
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories')
  }
}

export default connect(mapStateToProps)(BrandComparisonList);