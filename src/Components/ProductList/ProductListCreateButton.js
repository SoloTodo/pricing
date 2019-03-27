import React from 'react'
import {Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Button} from "reactstrap";
import Select from "react-select";
import {createOptions} from "../../react-utils/form_utils";
import {apiResourceStateToPropsUtils, filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {pricingStateToPropsUtils} from "../../utils";
import {connect} from "react-redux";


class ProductListCreateButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createListModalOpen: false,
      newListName: '',
      newListCategory: undefined,
    }
  }

  toggleCreateListModal = e => {
    e && e.preventDefault();
    this.setState({
      createListModalOpen: !this.state.createListModalOpen
    })
  };

  cleanField = () => {
    this.setState({
      newListName: '',
      newListCategory: ''
    });

    this.toggleCreateListModal()
  };

  nameChangeHandler = e => {
    this.setState({
      newListName: e.target.value
    })
  };

  categoryChangeHandler = e => {
    this.setState({
      newListCategory: e
    })
  };

  createList = () => {
    const name = this.state.newListName;
    const category = this.state.newListCategory;
    this.props.fetchAuth('product_lists/', {
      method: 'POST',
      body: JSON.stringify({
        name,
        category: category.value
      })
    }).then(json => {
      this.props.callback()
    });

    this.toggleCreateListModal()
  };

  render() {
    return <span>
      <Button color="primary" className="ml-3" onClick={this.toggleCreateListModal}>Crear</Button>
      <Modal isOpen={this.state.createListModalOpen} toggle={this.toggleCreateListModal}>
        <ModalHeader>Crear Lista Nueva</ModalHeader>
        <ModalBody>
          <Label for="listName">Nombre</Label>
          <Input onChange={this.nameChangeHandler} id="listName" type="text"/>
          <Label for="listCategory">Categoría</Label>
          <Select
            id="listCategory"
            name="category"
            options={createOptions(this.props.categories)}
            value={this.state.newListCategory}
            isClearable={true}
            onChange={this.categoryChangeHandler}
          />
        </ModalBody>
        <ModalFooter>
          <Button disabled={!Boolean(this.state.newListName) || !Boolean(this.state.newListCategory)}
                  color="primary" onClick={this.createList}>Crear</Button>
          <Button color="danger" onClick={this.cleanField}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </span>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  const {user} = pricingStateToPropsUtils(state);

  return {
    user,
    fetchAuth,
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories')
  }
}

export default connect(mapStateToProps)(ProductListCreateButton);