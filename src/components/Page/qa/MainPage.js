import React, { useMemo, Fragment, useState, useEffect } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Button,
  Container,
} from "reactstrap";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";

const MainPage = (props) => {
  // Check Window Dimensions
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }
  function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
    );

    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
  }
  const { height, width } = useWindowDimensions();

  // Main
  const token = useSelector((state) => state.main.auth.token);
  const user = useSelector((state) => state.main.auth.user);
  const service = useSelector((state) => state.main.auth.service);

  // QA
  const checkQAUser = useSelector((state) => state.qa.auth.user.buasri_id);
  const checkQAActive = useSelector((state) => state.main.auth.service.e_qa);
  // dispatch
  const dispatch = useDispatch();

  //Trigger
  const [Open, setOpen] = useState(true);

  useMemo(() => {
    if (
      Open &&
      user.buasri_id &&
      !checkQAUser &&
      checkQAActive.active === "ACTIVE"
    ) {
      const opening = async () => {
        const newUserQA = await {
          buasri_id: user.buasri_id,
        };
        // await auth_user(newUserQA)
        await setOpen(false);
      };
      opening();
    }
  }, [Open]);

  const RegisterQA = (e) => {
    e.preventDefault();
    const newUser = {
      buasri_id: user.buasri_id,
      email: user.email,
      position: service.e_qa.position,
      dep: user.dep,
    };
    // register(newUser);
  };

  const GoMainPage = (e) => {
    e.preventDefault();
    dispatch({ type: "PAGE_LOADING" });
    props.history.push("/");
  };

  return (
    <Fragment>
      {checkQAUser ? (
        <Container>มีข้อมูล user QA</Container>
      ) : (
        <Container>
          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <h2>สมัครใช้งานระบบประเมินผลงาน</h2>
                </FormGroup>
                <FormGroup>
                  <Label for="Detail">
                    เพื่อติดต่อการทำงานและตรวจสอบสถานะการประเมินผลงาน
                    ผู้ใช้งานจำเป็นต้องสมัครใช้งานระบบประเมินผลงาน <br />
                    กรุณาคลิก <b>ตกลง</b> เพื่อสมัครเข้าใช้งาน หรือคลิก{" "}
                    <b>ยกเลิก</b> เพื่อกลับหน้าหลัก
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Button onClick={RegisterQA} color="warning">
                    ตกลง
                  </Button>{" "}
                  <Button onClick={GoMainPage}>ยกเลิก</Button>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      )}
    </Fragment>
  );
};

export default connect(null, null)(MainPage);
