import React, { useState, useMemo, useEffect, Fragment } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  TabContent,
  TabPane,
  Container,
  Table,
  Button,
} from "reactstrap";
import classnames from "classnames";
import { connect, useSelector, useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";

import PropTypes from "prop-types";

import {
  getAllServiceUserForAdmin,
  getServiceForUserPage,
} from "../../../actions/main/serviceAction";

import { PAGE_LOADING } from "../../../type/main/type";

import DepJson from "../../../utilis/typedep";
import UserJson from "../../../utilis/typeuser";
import BackMainPage from "../../main/BackMainPage";
import AdminTable from "../../main/UserPage/AdminTable";
import AdminActive from "../../main/UserPage/AdminActive";

const UserPage = (props) => {
  const [activeTab, setActiveTab] = useState("userDetail");
  const [LoadService, setLoadService] = useState(true);
  const [Subtab, setSubtab] = useState(false);
  const user = useSelector((state) => state.main.auth.user);
  const service = useSelector((state) => state.main.auth.service);
  const token = useSelector((state) => state.main.auth.token);

  const dispatch = useDispatch();

  // trigger สำหรับแจ้งการเปลี่ยนแปลง
  const trigger = useSelector((state) => state.main.trigger);
  const [triggerOnlyOne, settriggerOnlyOne] = useState(true);

  useMemo(() => {
    const goMainPage = async () => {
      if (trigger.active) {
        if (triggerOnlyOne) {
          await settriggerOnlyOne(false);
          await alert("อัพเดตรายการสำเร็จ");
          await dispatch({ type: PAGE_LOADING });
          await props.history.push("/");
        }
      }
    };
    goMainPage();
    // eslint-disable-next-line
  }, [trigger]);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  UserPage.propTypes = {
    getAllServiceUserForAdmin: PropTypes.func.isRequired,
    getServiceForUserPage: PropTypes.func.isRequired,
  };

  const { getAllServiceUserForAdmin, getServiceForUserPage } = props;

  useMemo(() => {
    if (LoadService) {
      if (user.position === "ADMIN") {
        const getService = async () => {
          const sendToken = await {
            token,
          };
          await getAllServiceUserForAdmin(sendToken);
        };
        getService();
      } else {
        const getUService = async () => {
          const sendData = await {
            token,
            buasri_id: user.buasri_id,
          };
          await getServiceForUserPage(sendData);
        };
        getUService();
      }
      setLoadService(false);
    }

    // eslint-disable-next-line
  }, [LoadService]);

  useEffect(() => {
    service.e_research
      ? service.e_research.position === "ADMIN" &&
        service.e_research.active === "ACTIVE"
        ? setSubtab(true)
        : setSubtab(false)
      : setSubtab(false);

    service.e_qa
      ? service.e_qa.position === "ADMIN" && service.e_qa.active === "ACTIVE"
        ? setSubtab(true)
        : setSubtab(false)
      : setSubtab(false);

    service.e_scihuris
      ? service.e_scihuris.position === "ADMIN" &&
        service.e_scihuris.active === "ACTIVE"
        ? setSubtab(true)
        : setSubtab(false)
      : setSubtab(false);

    service.e_budget
      ? (service.e_budget.position === "ADMIN" ||
          service.e_budget.position === "PLANNER") &&
        service.e_budget.active === "ACTIVE"
        ? setSubtab(true)
        : setSubtab(false)
      : setSubtab(false);
  }, [service]);

  useEffect(() => {
    if (Subtab) {
      const getService = async () => {
        const sendToken = await {
          token,
        };
        await getAllServiceUserForAdmin(sendToken);
      };
      getService();
    }
    // eslint-disable-next-line
  }, [Subtab]);

  const depFilter = DepJson.filter((data) => {
    if (data.currentNameEN === user.dep) {
      return data.currentNameTH;
    } else {
      return null;
    }
  }).map((data) => {
    if (data.currentNameEN === user.dep) {
      return <Fragment key={data.currentNameEN}>{data.currentNameTH}</Fragment>;
    } else {
      return null;
    }
  });

  const userFilter = UserJson.filter((data) => {
    if (data.type === user.type) {
      return data.name;
    } else {
      return null;
    }
  }).map((data) => {
    if (data.type === user.type) {
      return <Fragment key={data.type}>{data.name}</Fragment>;
    } else {
      return null;
    }
  });

  return (
    <Fragment>
      <Container>
        <Switch>
          <Route exact path="/users">
            <br />
            {user.buasri_id ? (
              <Fragment>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "userDetail",
                      })}
                      onClick={() => {
                        toggle("userDetail");
                      }}
                    >
                      ข้อมูลส่วนตัว
                    </NavLink>
                  </NavItem>
                  {user.position === "ADMIN" ? (
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: activeTab === "userList",
                        })}
                        onClick={() => {
                          toggle("userList");
                        }}
                      >
                        รายชื่อผู้ใช้งาน
                      </NavLink>
                    </NavItem>
                  ) : Subtab ? (
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: activeTab === "userList",
                        })}
                        onClick={() => {
                          toggle("userList");
                        }}
                      >
                        รายชื่อผู้ใช้งาน
                      </NavLink>
                    </NavItem>
                  ) : null}
                </Nav>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="userDetail">
                    <Container>
                      <Row>
                        <Col sm="12">
                          <Container>
                            <br />
                            <h4>รายละเอียด</h4>
                            <Table hover responsive>
                              <tbody>
                                <tr>
                                  <th scope="row">ชื่อ-นามสกุล</th>
                                  <td>
                                    {user.title}
                                    {user.firstname} {user.lastname}
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">บัวศรีไอดี</th>
                                  <td>{user.buasri_id}</td>
                                </tr>
                                <tr>
                                  <th scope="row">อีเมล</th>
                                  <td>{user.email}</td>
                                </tr>
                                <tr>
                                  <th scope="row">หน่วยงาน</th>
                                  <td>{depFilter}</td>
                                </tr>
                                <tr>
                                  <th scope="row">ประเภทผู้ใช้งาน</th>
                                  <td>{userFilter}</td>
                                </tr>
                              </tbody>
                            </Table>
                            <Button color="warning" disabled>
                              แก้ไข
                            </Button>
                            <BackMainPage />
                          </Container>
                        </Col>
                      </Row>
                    </Container>
                  </TabPane>
                  <TabPane tabId="userList">
                    <AdminTable />
                  </TabPane>
                </TabContent>
              </Fragment>
            ) : null}
          </Route>
          <Route path="/users/active" component={AdminActive} />
        </Switch>
      </Container>
    </Fragment>
  );
};

export default connect(null, {
  getAllServiceUserForAdmin,
  getServiceForUserPage,
})(UserPage);
