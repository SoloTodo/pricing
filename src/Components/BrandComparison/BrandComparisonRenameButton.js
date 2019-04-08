import React from 'react'
import {connect} from "react-redux";
import {Button, Input, InputGroup,InputGroupAddon} from "reactstrap";

import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";

class BrandComparisonRenameButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingName:false,
      newName: this.props.brandComparison.name
    }
  }

  toggleEditingName = () => {
    this.setState({
      editingName: !this.state.editingName,
    });
  };

  inputNameChangeHandler = e => {
    this.setState({
      newName: e.target.value
    });
  };

  renameComparison = () => {
    const name = this.state.newName;

    if (this.props.brandComparison.name === name) {
      this.toggleEditingName();
      return
    }

    this.props.fetchAuth(`brand_comparisons/${this.props.brandComparison.id}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        name
      })
    }).then(json => {
      this.props.addBrandComparison(json);
      this.toggleEditingName();
    });
  };

  render() {
    if (!this.state.editingName) {
      return <span className="align-self-center">
        {this.props.brandComparison.name}
        <Button color="link" className="pl-1">
          <i className="fa fa-pencil" onClick={this.toggleEditingName}/>
        </Button>
      </span>
    }

    return <div>
      <InputGroup>
        <Input defaultValue={this.props.brandComparison.name} onChange={this.inputNameChangeHandler}/>
        <InputGroupAddon addonType='append'><Button color='success' onClick={this.renameComparison}><i className="fa fa-check"/></Button></InputGroupAddon>
      </InputGroup>
    </div>
  }

}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  return {
    fetchAuth,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addBrandComparison: brandComparison => {
      return dispatch({
        type: 'addApiResourceObject',
        apiResource: brandComparison
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandComparisonRenameButton);