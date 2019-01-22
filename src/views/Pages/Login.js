import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { Formik, ErrorMessage } from 'formik';

class Login extends Component {

  render() {
    return (
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <Formik
                          initialValues={{ email: '', password: '' }}
                          validate={values => {
                            let errors = {};
                            if (!values.email) {
                              errors.email = 'Required';
                            } else if (
                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                            ) {
                              errors.email = 'Invalid email address';
                            }

                            if(!values.password){
                                errors.password = 'Required';
                            }
                            console.log(errors);
                            return errors;
                          }}
                          onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                              alert(JSON.stringify(values, null, 2));
                              setSubmitting(false);
                            }, 400);
                          }}
                      >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            /* and other goodies */
                          }) => (
                            <Form>
                              <h1>Login</h1>
                              <p className="text-muted">Acceder con su cuenta</p>
                              <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i className="icon-user">&nbsp;</i>
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    invalid={!!errors.email && touched.email}
                                    type="email"
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
                              <InputGroup className="mb-4">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i className="icon-lock">&nbsp;</i>
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    invalid={!!errors.password && touched.password}
                                    type="password"
                                    name="password"
                                    placeholder="Contraseña"
                                    autoComplete="current-password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                />

                                <FormFeedback>
                                    <ErrorMessage name="password" component="div" />
                                </FormFeedback>
                              </InputGroup>
                              <Row>
                                <Col xs="4">
                                  <Button color="primary" className="px-4" onClick={handleSubmit}>Acceder</Button>
                                </Col>
                                <Col xs="8" className="text-right">
                                  <Button color="link" className="px-0">¿Olvidaste tu contraseña?</Button>
                                </Col>
                              </Row>
                            </Form>
                        )}
                      </Formik>
                    </CardBody>
                  </Card>
                  <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                    <CardBody className="text-center">
                      <div>
                        <h2>SoloTodo Pricing</h2>
                        <p>Herramienta de monitoreo y seguimiento del mercado de tecnología y electrónica</p>
                      </div>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
    );
  }
}

export default Login;
