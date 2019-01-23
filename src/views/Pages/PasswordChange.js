import React, { Component } from 'react';
import {connect} from "react-redux";

import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap';
import {ErrorMessage, Formik} from "formik";
import {toast} from "react-toastify";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {Redirect} from "react-router-dom";

class PasswordChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false
    }
  }

  validate = values => {
    const errors = {};
    if (values.new_password1 !== values.new_password2) {
      errors.new_password2 = 'Las contraseñas no coinciden'
    } else if (!values.new_password1 || !values.new_password2 || !values.old_password) {
      errors.new_password2 = 'Los campos no pueden estar en blanco'
    }

    if (!values.old_password){
      errors.old_password = true
    }
    return errors;
  };

  onSubmit = (values, {setSubmitting}) => {
    const formData = JSON.stringify(values);
    this.props.fetchAuth('rest-auth/password/change/', {
      method: 'POST',
      body: formData
    }).then(() => {
      toast.info('Contraseña cambidada exitosamente', {autoClose: false});
      this.setState({success: true});
      setSubmitting(false);
    }).catch(async err => {
      const jsonError = await err.json();
      if(jsonError.old_password) toast.error(jsonError.old_password[0], {autoClose: false});
      if(jsonError.new_password2) toast.error(jsonError.new_password2[0], {autoClose: false});
    })
  };

  render() {
    if (this.state.success){
      return <Redirect to="/"/>
    }
    return (
      <Row>
        <Col xs="12" sm="10" md="9" lg="7" xl="5">
          <Card>
            <CardBody className="p-4">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={{old_password: '', new_password1: '', new_password2: ''}}
                validate={this.validate}
                onSubmit={this.onSubmit}>
                {({values, errors, touched, handleChange, handleBlur, handleSubmit}) =>(
                  <Form onSubmit={handleSubmit}>
                    <h1>Cambiar Contraseña</h1>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"/>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input invalid={errors.old_password}
                             name="old_password"
                             type="password"
                             placeholder="Contraseña antigua"
                             autoComplete="old-password"
                             onChange={handleChange}
                             onBlur={handleBlur}
                             value={values.old_password}/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"/>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input invalid={!!errors.new_password2}
                             name="new_password1"
                             type="password"
                             placeholder="Contraseña nueva"
                             autoComplete="new-password"
                             onChange={handleChange}
                             onBlur={handleBlur}
                             value={values.new_password1}/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"/>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input invalid={!!errors.new_password2}
                             name="new_password2"
                             type="password"
                             placeholder="Repetir contraseña nueva"
                             autoComplete="new-password"
                             onChange={handleChange}
                             onBlur={handleBlur}
                             value={values.new_password2}/>
                      <FormFeedback>
                        <ErrorMessage name="new_password2" component="div" />
                      </FormFeedback>
                    </InputGroup>
                    <Button color="success" onClick={handleSubmit} block>Cambiar Contraseña</Button>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth
  }
}

export default connect(mapStateToProps, null)(PasswordChange);