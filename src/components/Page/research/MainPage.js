import React, { useMemo, Fragment, useState, useEffect } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Form,
  FormGroup,
  Label,
  Button,
  Container,
} from "reactstrap";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";

import { register } from "../../../actions/research/registerAction";
import { auth_user } from "../../../actions/research/authAction";
import {
  getlist_user,
  getlist_committee,
  getlist_admin,
} from "../../../actions/research/listAction";

import {
  get_report_admin,
  get_report_committee,
  get_report_user,
  get_deadline,
  get_deadline_check,
} from "../../../actions/research/buttonAction";

// Project
import { getproject_admin } from "../../../actions/research/projectAction";

// Button
import MainButton from "../../research/MainButton";

import FormPage from "../research/FormPage";
import BackMainPage from "../../main/BackMainPage";
import DetailPage from "../research/DetailPage";
import EditPage from "../research/EditPage";
import ProjectFormPage from "../research/project/FormPage";
import ProjectDetailPage from "../research/project/DetailPage";
import ProjectEditPage from "../research/project/EditPage";

// PC
import MainTableAdmin from "../../research/MainTableAdmin";
import MainTableCommittee from "../../research/MainTableCommittee";
import MainTableUser from "../../research/MainTableUser";
import ProjectTableAdmin from "../../research/project/ProjectTableAdmin";

// Mobile
import MainTableCommitteeMobile from "../../research/MainTableCommittee_Mobile";
import MainTableAdminMobile from "../../research/MainTableAdmin_Mobile";
import MainTableUserMobile from "../../research/MainTableUser_Mobile";

// classnames
import classnames from "classnames";

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
  const { width } = useWindowDimensions();

  // Main
  const [activeTab, setActiveTab] = useState("ResearchTable");
  const token = useSelector((state) => state.main.auth.token);
  const user = useSelector((state) => state.main.auth.user);
  const service = useSelector((state) => state.main.auth.service);
  const list = useSelector((state) => state.research.list);

  //Trigger
  const [Open, setOpen] = useState(true);
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // Research
  // const researchUser = useSelector((state) => state.research.auth.user);
  const checkResearchActive = useSelector(
    (state) => state.main.auth.service.e_research
  );
  const checkResearchUser = useSelector(
    (state) => state.research.auth.user.buasri_id
  );

  const dispatch = useDispatch();

  MainPage.propTypes = {
    register: PropTypes.func.isRequired,
    auth_user: PropTypes.func.isRequired,
    getlist_user: PropTypes.func.isRequired,
    getlist_committee: PropTypes.func.isRequired,
    getlist_admin: PropTypes.func.isRequired,
    get_report_admin: PropTypes.func.isRequired,
    get_report_committee: PropTypes.func.isRequired,
    get_report_user: PropTypes.func.isRequired,
    get_deadline: PropTypes.func.isRequired,
    get_deadline_check: PropTypes.func.isRequired,
    getproject_admin: PropTypes.func.isRequired,
  };

  const {
    register,
    auth_user,
    getlist_user,
    getlist_committee,
    getlist_admin,
    get_report_admin,
    get_report_committee,
    get_report_user,
    get_deadline,
    get_deadline_check,
    getproject_admin,
  } = props;

  const GoMainPage = (e) => {
    e.preventDefault();
    dispatch({ type: "PAGE_LOADING" });
    props.history.push("/");
  };

  // Fetch Data
  useMemo(() => {
    if (
      Open && checkResearchActive
        ? checkResearchActive.active === "ACTIVE"
        : null && !checkResearchUser
    ) {
      const opening = async () => {
        if (user.buasri_id) {
          const newUserResearch = await {
            buasri_id: user.buasri_id,
          };
          await auth_user(newUserResearch);
          await setOpen(false);
        }
      };
      opening();
    } else if (
      !checkResearchActive ||
      checkResearchActive.active === "INACTIVE"
    ) {
      dispatch({ type: "PAGE_LOADING" });
      props.history.push("/");
    }
    // eslint-disable-next-line
  }, [Open]);

  useMemo(() => {
    if (service.e_research) {
      if (service.e_research.position) {
        const getReportAdmin = async () => {
          const SendToken = await {
            token,
          };
          await get_report_admin(SendToken);
        };
        const getReportCommittee = async () => {
          const SendToken = await {
            token,
            dep: user.dep,
          };
          await get_report_committee(SendToken);
        };
        const getReportUser = async () => {
          const SendToken = await {
            token,
            buasri_id: user.buasri_id,
          };
          await get_report_user(SendToken);
        };
        const getDeadLine = async () => {
          const SendToken = await {
            token,
          };
          await get_deadline(SendToken);
        };
        const getDeadLineCheck = async () => {
          const SendToken = await {
            token,
          };
          await get_deadline_check(SendToken);
        };
        const getListData = async () => {
          if (service.e_research.position === "USER") {
            const newList = {
              token,
              buasri_id: user.buasri_id,
              dep: user.dep,
            };
            getlist_user(newList);
            getReportUser();
            getDeadLine();
            getDeadLineCheck();
          } else if (service.e_research.position === "COMMITTEE") {
            const newList = {
              token,
              buasri_id: user.buasri_id,
              dep: user.dep,
            };
            getlist_committee(newList);
            getReportCommittee();
            getDeadLine();
            getDeadLineCheck();
            // console.log(newList);
          } else if (service.e_research.position === "ADMIN") {
            const newList = {
              token,
              buasri_id: user.buasri_id,
            };
            getlist_admin(newList);
            getproject_admin(newList);
            getReportAdmin();
            getDeadLine();
            getDeadLineCheck();
          }
        };
        getListData();
      }
    }

    // eslint-disable-next-line
  }, [service.e_research]);

  const RegisterResearch = (e) => {
    e.preventDefault();
    const newUser = {
      buasri_id: user.buasri_id,
      email: user.email,
      position: service.e_research.position,
      dep: user.dep,
    };
    register(newUser);
  };

  return (
    <Fragment>
      {checkResearchUser ? (
        <Container>
          <Switch>
            <Route exact path="/research">
              {width >= 768 ? (
                <Fragment>
                  <Row>
                    <Col xs="10">
                      <MainButton />
                    </Col>
                    <Col xs="2">
                      <BackMainPage />
                    </Col>
                  </Row>
                  <Fragment>
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "ResearchTable",
                          })}
                          onClick={() => {
                            toggle("ResearchTable");
                          }}
                        >
                          บทความวิจัย
                        </NavLink>
                      </NavItem>
                      {/* <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "ProjectTable",
                          })}
                          onClick={() => {
                            toggle("ProjectTable");
                          }}
                        >
                          โครงการวิจัย
                        </NavLink>
                      </NavItem> */}
                    </Nav>
                  </Fragment>
                </Fragment>
              ) : width < 768 ? (
                <Fragment>
                  <Row>
                    <Col xs="10">
                      <MainButton />
                    </Col>
                    <Col xs="2">
                      <BackMainPage />
                    </Col>
                  </Row>
                  <Fragment>
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "ResearchTable",
                          })}
                          onClick={() => {
                            toggle("ResearchTable");
                          }}
                        >
                          บทความวิจัย
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Fragment>
                </Fragment>
              ) : null}

              {service.e_research ? (
                list.list ? (
                  list.list.length !== 0 ? (
                    service.e_research.position === "USER" && width >= 768 ? (
                      // USER PC ///////////////////////////////////////////////////
                      <Fragment>
                        <TabContent activeTab={activeTab}>
                          <TabPane tabId="ResearchTable">
                            <br />
                            <MainTableUser />
                          </TabPane>
                        </TabContent>
                      </Fragment>
                    ) : service.e_research.position === "USER" &&
                      width < 768 ? (
                      // USER Mobile ///////////////////////////////////////////////////
                      <Fragment>
                        <TabContent activeTab={activeTab}>
                          <TabPane tabId="ResearchTable">
                            <br />
                            <MainTableUserMobile />
                          </TabPane>
                        </TabContent>
                      </Fragment>
                    ) : service.e_research.position === "ADMIN" &&
                      width >= 768 ? (
                      // ADMIN PC ///////////////////////////////////////////////////
                      <Fragment>
                        <TabContent activeTab={activeTab}>
                          <TabPane tabId="ResearchTable">
                            <br />
                            <MainTableAdmin />
                          </TabPane>
                          <TabPane tabId="ProjectTable">
                            <br />
                            <ProjectTableAdmin />
                          </TabPane>
                        </TabContent>
                      </Fragment>
                    ) : service.e_research.position === "ADMIN" &&
                      width < 768 ? (
                      // ADMIN Moblie ///////////////////////////////////////////////////
                      <Fragment>
                        <MainTableAdminMobile />
                      </Fragment>
                    ) : service.e_research.position === "COMMITTEE" &&
                      width >= 768 ? (
                      // COMMITTEE PC ///////////////////////////////////////////////////
                      <Fragment>
                        <b>หน่วยงาน: {user.dep}</b>
                        <MainTableCommittee />
                      </Fragment>
                    ) : service.e_research.position === "COMMITTEE" &&
                      width < 768 ? (
                      // COMMITTEE Moblie ///////////////////////////////////////////////////
                      <Fragment>
                        <b>หน่วยงาน: {user.dep}</b>
                        <MainTableCommitteeMobile />
                      </Fragment>
                    ) : null
                  ) : (
                    <Fragment>
                      <TabContent activeTab={activeTab}>
                        <TabPane tabId="ResearchTable">
                          <br />
                          ยังไม่มีข้อมูลผลงานวิจัย สามารถเพิ่มผลงานวิจัยได้
                          โดยการคลิกที่ปุ่ม <b>แบบฟอร์มเพิ่มผลงานวิจัย</b>
                        </TabPane>
                      </TabContent>
                    </Fragment>
                  )
                ) : null
              ) : null}
            </Route>
            <Route path="/research/form" component={FormPage} />
            <Route path="/research/detail" component={DetailPage} />
            <Route path="/research/edit" component={EditPage} />
            <Route path="/research/project/form" component={ProjectFormPage} />
            <Route
              path="/research/project/detail"
              component={ProjectDetailPage}
            />
            <Route path="/research/project/edit" component={ProjectEditPage} />
          </Switch>
        </Container>
      ) : (
        <Container>
          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <h2>สมัครใช้งานระบบวิจัย</h2>
                </FormGroup>
                <FormGroup>
                  <Label for="Detail">
                    เพื่อติดต่อการทำงานและตรวจสอบสถานะการอนุมัติงานวิจัย
                    ผู้ใช้งานจำเป็นต้องสมัครใช้งานระบบวิจัย <br />
                    กรุณาคลิก <b>ตกลง</b> เพื่อสมัครเข้าใช้งาน หรือคลิก{" "}
                    <b>ยกเลิก</b> เพื่อกลับหน้าหลัก
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Button onClick={RegisterResearch} color="warning">
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
  getlist_user,
  getlist_committee,
  getlist_admin,
  get_report_admin,
  get_report_committee,
  get_report_user,
  get_deadline,
  get_deadline_check,
  getproject_admin,
})(MainPage);
