import React from "react";
import {connect} from "react-redux";
import {toast} from "react-toastify";
import {Button, Input} from "reactstrap";

import {
    apiResourceStateToPropsUtils
} from "../../react-utils/ApiResource";


class MicrositeEntryRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entry: this.props.entry,
            errors: {}
        }
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
        const value = e.target.value;

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
        const category = this.props.category;
        const extra_fields = this.props.extra_fields;

        return <tr key={entry.id}>
            <td>{entry.product.name}</td>
            <td>{category.name}</td>
            <td><Input invalid={this.state.errors['ordering']} value={entry['ordering'] || ''} onChange={e => this.onInputChange(e, 'ordering')} onBlur={e => this.onInputBlur(e, 'ordering')}/></td>
            <td><Input invalid={this.state.errors['home_ordering']} value={entry['home_ordering'] || ''} onChange={e => this.onInputChange(e, 'home_ordering')} onBlur={e => this.onInputBlur(e, 'home_ordering')}/></td>
            {extra_fields.map(field => {
                return <td key={field}>
                    <Input value={entry[field] || ''} onChange={e => this.onInputChange(e, field)} onBlur={e => this.onInputBlur(e, field)}/>
                </td>
            })}
            <td><Button color="danger">X</Button></td>
        </tr>
    }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
  }
}

export default connect(mapStateToProps)(MicrositeEntryRow);