import React from 'react'
import {connect} from 'react-redux';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input} from 'reactstrap'
import Select from 'react-select';

import {
  apiResourceStateToPropsUtils,
  filterApiResourceObjectsByType
} from '../../react-utils/ApiResource';

import {createOptions} from '../../react-utils/form_utils';


class BrandComparisonCreateButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createComparisonModalOpen: false,
      newComparisonName: '',
      newComparisonCategory: undefined,
      newComparisonBrand1: undefined,
      newComparisonBrand2: undefined
    };
  }

  toggleCreateComparisonModal = e => {
    e && e.preventDefault();
    this.setState({
      createComparisonModalOpen: !this.state.createComparisonModalOpen
    })
  };

  cleanField = () => {
    this.setState({
      newComparisonName: '',
      newComparisonCategory: undefined,
      newComparisonBrand1: undefined,
      newComparisonBrand2: undefined
    });
    this.toggleCreateComparisonModal()
  };

  fieldChangeHandler = (fieldName, value) => {
    this.setState({
      [fieldName]: value
    });
  };

  createComparison = () => {
    const name = this.state.newComparisonName;
    const category = this.state.newComparisonCategory.value;
    const brand1 = this.state.newComparisonBrand1.value;
    const brand2 = this.state.newComparisonBrand2.value;
    this.props.fetchAuth('brand_comparisons/', {
      method: 'POST',
      body: JSON.stringify({
        name,
        category,
        brand1,
        brand2
      })
    }).then(json => {
      this.props.callback()
    });

    this.cleanField()
  };

  render() {
    const categories = this.props.categories.filter(category => category.permissions.includes('create_category_brand_comparison'))

    return <React.Fragment>
      <Button color="primary" className="ml-3" onClick={this.toggleCreateComparisonModal}>Crear</Button>
      <Modal isOpen={this.state.createComparisonModalOpen} toggle={this.toggleCreateComparisonModal}>
        <ModalHeader>Crear Nueva Comparación</ModalHeader>
        <ModalBody>
          <Label for="comparisonName">Nombre</Label>
          <Input
            id="comparisonName"
            type="text"
            onChange={e =>
              this.fieldChangeHandler('newComparisonName', e.target.value)}
          />
          <Label className="mt-2" for="comparisonCategory">Categoría</Label>
          <Select
            id="comparisonCategory"
            name="category"
            options={createOptions(categories)}
            value={this.state.newComparisonCategory}
            isClearable={true}
            onChange={e =>
              this.fieldChangeHandler('newComparisonCategory', e)}
          />
          <Label className="mt-2" for="comparisonBrand1">Marca 1</Label>
          <Select
            id="comparisonBrand1"
            name="brand1"
            options={createOptions(this.props.brands)}
            value={this.state.newComparisonBrand1}
            isClearable={true}
            onChange={e =>
              this.fieldChangeHandler('newComparisonBrand1', e)}
          />
          <Label className="mt-2" for="comparisonBrand2">Marca 2</Label>
          <Select
            id="comparisonBrand2"
            name="brand2"
            options={createOptions(this.props.brands)}
            value={this.state.newComparisonBrand2}
            isClearable={true}
            onChange={e =>
              this.fieldChangeHandler('newComparisonBrand2', e)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={
              !Boolean(this.state.newComparisonName) ||
              !Boolean(this.state.newComparisonCategory) ||
              !Boolean(this.state.newComparisonBrand1) ||
              !Boolean(this.state.newComparisonBrand2)}
            color="primary"
            onClick={this.createComparison}>Crear</Button>
          <Button color="danger" onClick={this.cleanField}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories'),
    brands: filterApiResourceObjectsByType(state.apiResourceObjects, 'brands')

  }
}

export default connect(mapStateToProps)(BrandComparisonCreateButton);