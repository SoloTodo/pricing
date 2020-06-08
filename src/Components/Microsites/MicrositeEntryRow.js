import React from "react";
import {connect} from "react-redux";
import {NavLink} from "react-router-dom";
import {toast} from "react-toastify";
import {Button, Input, Modal, ModalHeader, ModalFooter} from "reactstrap";

import {
    apiResourceStateToPropsUtils, filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";


class MicrositeEntryRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteModalOpen: false,
            entry: this.props.entry,
            errors: {}
        }
    }

    toggleDeleteModalOpen = () => {
        this.setState({
            deleteModalOpen: !this.state.deleteModalOpen
        })
    }

    onDeleteClick = () => {
        this.props.fetchAuth(this.state.entry.url, {
            method: 'DELETE'
        }).then(json => {
            toast.success("Producto eliminado exitosamente");
            this.props.handleMicrositeChange();
        })
    }

    onInputChange = (e, field) => {
        const newEntry = this.state.entry;
        newEntry[field] = e.target.value;
        this.setState({
            entry: newEntry
        })
    }

    onInputBlur = (e, field) => {
        const url = this.state.entry.url;
        let value = e.target.value || null;

        this.props.fetchAuth(`${url}`, {
            method: 'PATCH',
            body: JSON.stringify({
                [`${field}`]: value
            })
        }).then(json => {
            const newErrors = this.state.errors;
            newErrors[field] = false;
            this.setState({
                errors:newErrors
            });

        }).catch(async error => {
            const jsonError = await error.json();
            const newErrors = this.state.errors;
            newErrors[field] = true;
            this.setState({
                errors:newErrors
            });
            toast.error(jsonError[field][0])
        })
    }

    render() {
        const entry = this.state.entry;
        const category = this.props.categories.filter(category => category.url === entry.product.category)[0];
        const extraFields = this.props.extraFields;
        const extraFieldTypes = {
            'description': 'textarea'
        }

        return <tr key={entry.id}>
            <td><NavLink to={'/products/' + entry.product.id}>{entry.product.name}</NavLink></td>
            <td>{category.name}</td>
            <td><Input invalid={this.state.errors['ordering']} value={entry['ordering'] || ''} onChange={e => this.onInputChange(e, 'ordering')} onBlur={e => this.onInputBlur(e, 'ordering')}/></td>
            <td><Input invalid={this.state.errors['home_ordering']} value={entry['home_ordering'] || ''} onChange={e => this.onInputChange(e, 'home_ordering')} onBlur={e => this.onInputBlur(e, 'home_ordering')}/></td>
            {extraFields.map(field => {
                return <td key={field}>
                    <Input
                        type={extraFieldTypes[field]}
                        value={entry[field] || ''}
                        onChange={e => this.onInputChange(e, field)}
                        onBlur={e => this.onInputBlur(e, field)}/>
                </td>
            })}
            <td><Button color="danger" onClick={this.toggleDeleteModalOpen}>X</Button></td>
            <Modal centered isOpen={this.state.deleteModalOpen} toggle={this.toggleDeleteModalOpen}>
                <ModalHeader>¿Desea eliminar el producto {entry.product.name}?</ModalHeader>
                <ModalFooter>
                    <Button color="danger" onClick={this.onDeleteClick}>Eliminar</Button>
                </ModalFooter>
            </Modal>
        </tr>
    }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
      fetchAuth,
      categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories')
  }
}

export default connect(mapStateToProps)(MicrositeEntryRow);