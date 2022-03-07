import React, { useMemo, Fragment, useState } from "react";
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
import { register } from "../../../actions/complaint/registerAction";
import { auth_user } from "../../../actions/complaint/authAction";
import {
  getlist_all,
  getlist_user,
} from "../../../actions/complaint/listAction";
import FormButton from "../../complaint/FormButton";
import FormPage from "./FormPage";
import MainTableUser from "../../complaint/MainTableUser";
import MainTableAdmin from "../../complaint/MainTableAdmin.js";
import DetailPage from "./DetailPage";
import BackMainPage from "../../main/BackMainPage";

const MainPage = (props) => {
  // Main
  const user = useSelector((state) => state.main.auth.user);
  const [Open, setOpen] = useState(true);
  // Complaint
  const complaintUser = useSelector((state) => state.complaint.auth.user);
  const listdata = useSelector((state) => state.complaint.list.list);
  const Token = useSelector((state) => state.main.auth.token);

  const dispatch = useDispatch();

  MainPage.propTypes = {
    register: PropTypes.func.isRequired,
    auth_user: PropTypes.func.isRequired,
    getlist_all: PropTypes.func.isRequired,
    getlist_user: PropTypes.func.isRequired,
  };
  const { register, auth_user, getlist_all, getlist_user } = props;

  const RegisterComplaint = (e) => {
    e.preventDefault();
    const newUser = {
      buasri_id: user.buasri_id,
      email: user.email,
      position: "USER",
      active: "ACTIVE",
    };
    register(newUser);
    dispatch({ type: "PAGE_LOADING" });
  };

  const GoMainPage = (e) => {
    e.preventDefault();
    dispatch({ type: "PAGE_LOADING" });
    props.history.push("/");
  };

  useMemo(() => {
    if (Open) {
      const opening = async () => {
        if (user.buasri_id) {
          const newUserComplaint = await {
            buasri_id: user.buasri_id,
          };
          await auth_user(newUserComplaint);
          await setOpen(false);
        }
      };
      opening();
    }
    // eslint-disable-next-line
  }, [Open]);

  // Fetch Data Table
  useMemo(() => {
    if (complaintUser.position) {
      const getListData = async () => {
        const sendBuasriID = await {
          token: Token,
          buasri_id: complaintUser.buasri_id,
        };
        if (complaintUser.position === "ADMIN") {
          getlist_all(sendBuasriID);
        }

        if (complaintUser.position === "USER") {
          getlist_user(sendBuasriID);
        }
      };

      getListData();
    }
    // eslint-disable-next-line
  }, [complaintUser.position]);

  return (
    <Fragment>
      {complaintUser.buasri_id ? (
        <Container>
          <Switch>
            <Route exact path="/complaint">
              <FormButton />
              <BackMainPage />
              {complaintUser.position === "USER" && listdata ? (
                <MainTableUser />
              ) : null}
              {complaintUser.position === "ADMIN" && listdata ? (
                <MainTableAdmin />
              ) : null}
            </Route>
            <Route path="/complaint/form" component={FormPage} />
            <Route path="/complaint/detail" component={DetailPage} />
          </Switch>
        </Container>
      ) : (
        <Container>
          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <h2>สมัครใช้งานระบบร้องเรียน</h2>
                </FormGroup>
                <FormGroup>
                  <Label for="Detail">
                    เพื่อติดต่อการทำงานและตรวจสอบสถานะการร้องเรียน
                    ผู้ใช้งานจำเป็นต้องสมัครใช้งานระบบร้องเรียน <br />
                    กรุณาคลิก <b>ตกลง</b> เพื่อสมัครเข้าใช้งาน หรือคลิก{" "}
                    <b>ยกเลิก</b> เพื่อกลับหน้าหลัก
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Button onClick={RegisterComplaint} color="warning">
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

export default connect(null, {
  register,
  auth_user,
  getlist_all,
  getlist_user,
})(MainPage);
