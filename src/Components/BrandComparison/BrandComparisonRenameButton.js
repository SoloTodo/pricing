import React from 'react'
import {toast} from "react-toastify";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {connect} from "react-redux";
import InputGroup from "reactstrap/es/InputGroup";
import Input from "reactstrap/es/Input";
import InputGroupAddon from "reactstrap/es/InputGroupAddon";
import {Button} from "reactstrap";

class BrandComparisonRenameButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newName: ''
    }
  }

  inputNameChangeHandler = e => {
    this.setState({
      newName: e.target.value
    });
  };

  renameComparison = () => {
    const name = this.state.newName;
    this.props.fetchAuth(`brand_comparisons/${this.props.brandComparison.id}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        name
      })
    }).then(json => {
      toast.success('Nombre cambiado');
      this.props.fetchAuth(`brand_comparisons/${this.props.brandComparison.id}/`).then(json => {
        this.props.addBrandComparison(json);
        this.props.callback();
      });
    });
  };

  render() {
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