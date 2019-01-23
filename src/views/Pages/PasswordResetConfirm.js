import React from 'react';
import {ErrorMessage, Formik} from "formik";
import {toast} from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap';
import {fetchJson} from "../../react-utils/utils";
import {Redirect} from "react-router-dom";

class PasswordResetConfirm extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      success: false,
      invalidUrl:false,
      uid: undefined,
      token: undefined
    }
  }

  componentDidMount() {
    const url = window.location.pathname;
    const parsedUrl = url.match('reset/(.+)/(.+)/$');

    if (!parsedUrl) {
      toast.error('URL inválida', {autoClose: false});
      this.setState({
        invalidUrl:true
      });
      return
    }

    const uid =  parsedUrl[1];
    const token = parsedUrl[2];

    this.setState({uid, token});
  }

  validate = values => {
    const errors = {};
    if (values.password1 !== values.password2){
      errors.password2 = 'Las contraseñas no coinciden'
    } else if (!values.password1 || !values.password2) {
      errors.password2 = 'Los campos no pueden estar en blanco'
    }
    return errors;
  };

  onSubmit = (values, {setSubmitting}) => {
    const formData = JSON.stringify({
      uid: this.state.uid,
      token: this.state.token,
      new_password1: values.password1,
      new_password2: values.password2
    });

    fetchJson('rest-auth/password/reset/confirm/', {
      method: 'POST',
      body: formData
    }).then((json) => {
      toast.info('Cambio exitoso. Ahora puedes iniciar sesión con tu nueva contraseña', {autoClose: false});
      this.setState({success: true});
      setSubmitting(false);
    }).catch(async err => {
      const jsonError =  await err.json();
      toast.error(jsonError.new_password2[0], {autoClose: false});
    })
  };

  render(){
    if (this.state.success || this.state.invalidUrl){
      return <Redirect to="/login" />
    }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Formik
                    validateOnChange={false}
                    validateOnBlur={false}
                    initialValues={{password1:'', password2:''}}
                    validate={this.validate}
                    onSubmit={this.onSubmit}>
                    {({values, errors, touched, handleChange, handleBlur, handleSubmit}) =>(
                      <Form onSubmit={handleSubmit}>
                        <h1>Cambio de Contraseña</h1>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"/>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input invalid = {!!errors.password2}
                            name="password1"
                            type="password"
                            placeholder="Nueva contraseña"
                            autoComplete="new-password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password1}/>
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"/>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input invalid = {!!errors.password2}
                            name="password2"
                            type="password"
                            placeholder="Repetir contraseña"
                            autoComplete="new-password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password2}/>
                          <FormFeedback>
                            <ErrorMessage name="password2" component="div" />
                          </FormFeedback>
                        </InputGroup>
                        <Button color="success" onClick={handleSubmit} block>
                          Cambiar contraseña
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default PasswordResetConfirm;