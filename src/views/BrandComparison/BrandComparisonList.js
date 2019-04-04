import React from 'react'
import {Col, Row} from 'reactstrap';

import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormResultTableWithPagination,
  createOrderingOptionChoices,
} from '../../react-utils/api_forms';

import BrandComparisonCreateButton
  from '../../Components/BrandComparison/BrandComparisonCreateButton'
import moment from 'moment';
import {NavLink} from "react-router-dom";



class BrandComparisonList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      brandComparisons: undefined,
      endpoint:'brand_comparisons'
    };
  }

  handleFormValueChange = formValues => {
    this.setState({formValues})
  };

  setBrandComparisons = json => {
    this.setState({
      brandComparisons: json? json.payload : null
    });
  };

  updateEndpoint = () => {
    this.setState({
      endpoint: 'brand_comparisons/?_='+moment().format()
    })
  };

  render() {
    const columns = [
      {
        label: 'Nombre',
        ordering: 'name',
        renderer: brandComparison => <NavLink to={`/brand_comparisons/${brandComparison.id}`}>{brandComparison.name}</NavLink>
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
      endpoints={[this.state.endpoint]}
      fields={['ordering', 'page', 'page_size']}
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
          <ApiFormResultTableWithPagination
            icon="fas fa-list"
            label="Comparaciones de Marcas"
            cardClass="card-body"
            headerButton={<BrandComparisonCreateButton callback={this.updateEndpoint}/>}
            page_size_choices={[15, 25, 50]}
            page={this.state.formValues.page}
            page_size={this.state.formValues.page_size}
            data={this.state.brandComparisons}
            columns={columns}
            ordering={this.state.formValues.ordering}
          />
        </Col>
      </Row>
    </ApiForm>
  }
}

export default BrandComparisonList;