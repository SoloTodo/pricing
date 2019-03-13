import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

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

    console.log(entries.map(entry=>entry.product.id))
  };

  render() {
    const productList = this.props.productList;
    const entries = this.state.entries;

    return <React.Fragment>
      <Button className="btn-info" onClick={this.toggleReorderModal}>Reordenar</Button>
      <Modal centered isOpen={this.state.reorderModalOpen} toggle={this.toggleReorderModal}>
        <ModalHeader>Reordenar {productList.name}</ModalHeader>
        <ModalBody>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {entries.map((entry, index) => (
                    <Draggable key={entry.product.id} draggableId={entry.product.id} index={index}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          {entry.product.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ModalBody>
        <ModalFooter>
          <Button color="success">Guardar</Button>
          <Button color="danger" onClick={this.toggleReorderModal}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  }
}

export default ProductListReorderButton