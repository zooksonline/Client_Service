import React, { Fragment, useState, useEffect } from "react";
import {
  Alert,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Media,
  Fade,
  Container,
} from "reactstrap";
import logo from "../../images/SWU_Science_TH_Black.png";
import { connect, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { login } from "../../actions/main/authAction";
import { clearErrors } from "../../actions/main/errorAction";
import { withRouter } from "react-router-dom";
import delay from "../../utilis/delay";

// // Env
// import { config } from "../../utilis/config";

// CSS
import "../../utilis/main/style_login.css";

const Login = (props) => {
  const imgStyle = {
    maxWidth: 350,
    maxHeight: 150,
  };

  const [buasri_id, setbuasri_id] = useState("");
  const [password, setpassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fadeIn] = useState(true);
  const [ToLogin, setToLogin] = useState(false);
  const error = useSelector((state) => state.main.error);
  const auth = useSelector((state) => state.main.auth.isAuthenticated);

  Login.propTypes = {
    login: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  const { login, clearErrors } = props;

  useEffect(() => {
    // Check for register error
    if (error.id === "LOGIN_FAIL") {
      setErrorMsg(error.msg.msg);
    } else {
      setErrorMsg(null);
    }
    // eslint-disable-next-line
  }, [error]);

  useEffect(() => {
    if (ToLogin) {
      const newLogin = {
        buasri_id: buasri_id,
        password: password,
      };
      const getID = () => {
        clearErrors();
        // await alert("yes!!!");
        login(newLogin);
        delay(1000);
        setToLogin(false);
        props.history.push("/");
      };
      getID();
    }
    // eslint-disable-next-line
  }, [ToLogin]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "buasri_id") {
      setbuasri_id(value);
    }
    if (name === "password") {
      setpassword(value);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setToLogin(true);
  };

  return (
    <Fragment>
      {auth ? (
        <Fragment></Fragment>
      ) : (
        <Fade in={fadeIn}>
          <Container>
            <Row>
              <Media
                object
                src={logo}
                style={imgStyle}
                alt={logo}
                className="mx-auto"
              />
            </Row>
          </Container>
          <Container>
            <Row>
              <Col xs="1"></Col>
              <Col xs="10">
                <p style={{ whiteSpace: "pre-wrap" }}>{"\n"}</p>
                <Card>
                  <CardHeader>ลงชื่อเข้าใช้</CardHeader>
                  <CardBody>
                    {errorMsg ? <Alert color="danger">{errorMsg}</Alert> : null}
                    <Form onSubmit={onSubmit}>
                      <FormGroup row>
                        <Col sm={1}></Col>
                        <Label for="buasri_id" sm={2}>
                          Buasri ID:{" "}
                        </Label>
                        <Col sm={8}>
                          <Input
                            type="text"
                            name="buasri_id"
                            placeholder="บัวศรีไอดี"
                            onChange={onChange}
                          />
                        </Col>
                        <Col sm={1}></Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col sm={1}></Col>
                        <Label for="password" sm={2}>
                          Password:{" "}
                        </Label>
                        <Col sm={8}>
                          <Input
                            type="password"
                            name="password"
                            autoComplete="on"
                            placeholder="รหัสเข้าใช้งาน"
                            onChange={onChange}
                          />
                        </Col>
                        <Col sm={1}></Col>
                      </FormGroup>
                      <Col sm={{ size: 8, offset: 2 }}>
                        <Button
                          color="dark"
                          style={{ marginTop: "2rem" }}
                          block
                        >
                          เข้าใช้งาน
                        </Button>
                      </Col>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="1"></Col>
            </Row>
          </Container>
        </Fade>
      )}
    </Fragment>
  );
};

export default withRouter(connect(null, { login, clearErrors })(Login));
