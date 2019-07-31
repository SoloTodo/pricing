import React from 'react'
import {connect} from 'react-redux'
import {Button, Modal, ModalHeader, ModalBody, Label, Input, ModalFooter} from "reactstrap";
import Select from "react-select";

import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {createOptions} from "../../react-utils/form_utils";


class KeywordSearchCreateButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createSearchModalOpen: false,
      newSearchStore:undefined,
      newSearchCategory:undefined,
      newSearchKeyword:undefined,
      newSearchThreshold:undefined
    }
  }

  toggleCreateSearchModal = e => {
    e && e.preventDefault();
    this.setState({
      createSearchModalOpen: !this.state.createSearchModalOpen
    })
  };

  cleanField = () => {
    this.setState({
      newSearchStore:undefined,
      newSearchCategory: undefined,
      newSearchKeyword: undefined,
      newSearchThreshold: undefined
    });
    this.toggleCreateSearchModal()
  };

  fieldChangeHandler = (fieldName, value) => {
    this.setState({
      [fieldName]: value
    })
  };

  createKeywordSearch = () => {
    const store = this.state.newSearchStore.value;
    const category = this.state.newSearchCategory.value;
    const keyword = this.state.newSearchKeyword;
    const threshold = this.state.newSearchThreshold;
    this.props.fetchAuth('keyword_searches/', {
      method: 'POST',
      body: JSON.stringify({
        store,
        category,
        keyword,
        threshold,
      })
    }).then(json => {
      this.props.callback()
    });
    this.cleanField()
  };

  render() {
    const validStoresIds = [60, 18, 5, 11, 30, 88, 43, 9, 67, 87];
    const stores = this.props.stores.filter(store => store.permissions.includes('create_store_keyword_search') && validStoresIds.includes(store.id));
    const categories = this.props.categories.filter(category => category.permissions.includes('create_category_keyword_search'));

    return <React.Fragment>
      <Button color="primary" className="ml-3" onClick={this.toggleCreateSearchModal}>Crear</Button>
      <Modal isOpen={this.state.createSearchModalOpen} toggle={this.toggleCreateSearchModal}>
        <ModalHeader>Crear nuevo Keyword Search</ModalHeader>
        <ModalBody>
          <Label for="searchStore">Tienda</Label>
          <Select
            id="searchStore"
            name="store"
            options={createOptions(stores)}
            value={this.state.newSearchStore}
            isClearable={true}
            onChange={e => this.fieldChangeHandler('newSearchStore', e)}
          />
          <Label className="mt-2" for="searchCategory">Categoría</Label>
          <Select
            id="searchCategory"
            name="category"
            options={createOptions(categories)}
            value={this.state.newSearchCategory}
            isClearable={true}
            onChange={e => this.fieldChangeHandler('newSearchCategory', e)}
          />
          <Label className="mt-2" for="searchKeyword">Keyword</Label>
          <Input
            id="searchKeyword"
            name="keyword"
            type="text"
            value={this.state.newSearchKeyword}
            onChange={e =>
              this.fieldChangeHandler('newSearchKeyword', e.target.value)}
          />
          <Label className="mt-2" for="searchThreshold">Umbral</Label>
          <Input
            id="searchThreshold"
            name="threshold"
            type="text"
            value={this.state.newSearchThreshold}
            onChange={e =>
              this.fieldChangeHandler('newSearchThreshold', e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={
              !Boolean(this.state.newSearchStore) ||
              !Boolean(this.state.newSearchCategory) ||
              !Boolean(this.state.newSearchKeyword) ||
              !Boolean(this.state.newSearchThreshold)}
            color="primary"
            onClick={this.createKeywordSearch}>Crear</Button>
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
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores'),
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories')
  }
}

export default connect(mapStateToProps)(KeywordSearchCreateButton);