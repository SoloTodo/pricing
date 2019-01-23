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

class PasswordReset extends React.Component {

  validate = (values) => {
    const errors = {};
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Correo inválido';
    }
    return errors;
  };

  onSubmit = (values, {setSubmitting}) => {
    const formData = JSON.stringify({
      email: values.email,
    });

    fetchJson('rest-auth/password/reset/', {
      method: 'POST',
      body: formData
    }).then(() => {
      toast.success("Te hemos enviado un correo con las instrucciones para reestablecer tu contraseña", {autoClose: false})
      setSubmitting(false);
    }).catch(err => {
      toast.error("Ocurrió un error desconocido");
    })
  };

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Formik
                    initialValues={{ email: '' }}
                    validate={this.validate}
                    onSubmit={this.onSubmit}>
                    {({values, errors, touched, handleChange, handleBlur, handleSubmit}) =>(
                      <Form onSubmit={handleSubmit}>
                        <h1>Reestablecer Contraseña</h1>
                        <p className="text-muted">Ingresa la dirección de correo con la que estás registrado</p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>@</InputGroupText>
                          </InputGroupAddon>
                          <Input invalid = {errors.email && touched.email}
                                 name="email"
                                 placeholder="E-mail"
                                 autoComplete="email"
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 value={values.email}/>
                          <FormFeedback>
                            <ErrorMessage name="email" component="div" />
                          </FormFeedback>
                        </InputGroup>
                        <Button color="success" onClick={handleSubmit} block>Reestablecer Contraseña</Button>
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

export default PasswordReset;
