import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";
import {toast} from "react-toastify";

class ProductListReorderButton extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      reorderModalOpen: false,
      entries: [...props.productList.entries],
    }
  }

  toggleReorderModal = () => {
    this.setState({
      reorderModalOpen: !this.state.reorderModalOpen,
      entries: [...this.props.productList.entries]
    })
  };

  updateOrdering = () => {
    const products = this.state.entries.map(entry=>entry.product.id);
    this.props.fetchAuth(`product_lists/${this.props.productList.id}/update_entries_ordering/`, {
      method: 'POST',
      body: JSON.stringify({
        products: products
      })
    }).then(json => {
      toast.success('Lista de productos reordenada')
    });
    this.props.onProductsReorder();
    this.toggleReorderModal()
  };

  reorder = (entries, startIndex, endIndex) => {
    const result = Array.from(entries);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result
  };

  onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    const entries = this.reorder(
      this.state.entries,
      result.source.index,
      result.destination.index
    );

    this.setState({
      entries
    });
  };

  render() {
    const productList = this.props.productList;
    const entries = this.state.entries;

    return <React.Fragment>
      <Button color="primary" onClick={this.toggleReorderModal}>Reordenar</Button>
      <Modal centered isOpen={this.state.reorderModalOpen} toggle={this.toggleReorderModal}>
        <ModalHeader>Reordenar {productList.name}</ModalHeader>
        <ModalBody>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <ul className="list-group" {...provided.droppableProps} ref={provided.innerRef}>
                  {entries.map((entry, index) => (
                    <Draggable key={entry.product.id} draggableId={entry.product.id} index={index}>
                      {(provided, snapshot) => (
                        <li className="list-group-item" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          {entry.product.name}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={this.updateOrdering}>Guardar</Button>
          <Button color="danger" onClick={this.toggleReorderModal}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
  }
}

export default connect(mapStateToProps)(ProductListReorderButton);