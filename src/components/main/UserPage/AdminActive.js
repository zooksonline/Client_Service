import React, { useState, useEffect, Fragment } from "react";
import { connect, useSelector } from "react-redux";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  Container,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import classnames from "classnames";
import ResearchActive from "../ServiceActive/researchActive";
import QAActive from "../ServiceActive/qaActive";
import BudgetActive from "../ServiceActive/budgetActive";

const AdminPageActive = (props) => {
  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 1,
      }}
    />
  );

  const servicelist = useSelector((state) => state.main.service);
  const user = useSelector((state) => state.main.auth.user);
  const subservice = useSelector((state) => state.main.auth.service);
  const [Name, setName] = useState(null);
  const [Dep] = useState(
    servicelist ? (servicelist.dep ? servicelist.dep : false) : false
  );

  const [activeTab, setActiveTab] = useState("ResearchActive");
  const [Subtab, setSubtab] = useState(false);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    if (servicelist) {
      setName(servicelist.firstname + " " + servicelist.lastname);
    }
  }, [servicelist]);

  return (
    <Fragment>
      <Container>
        <Row>
          <Col sm="12">
            <br />
            <h4>ชื่อผู้ใช้</h4>
            <Container>
              <Label sm={3}>ชื่อ-นามสกุล:</Label>
              <Label sm={9}>{Name}</Label>
              <Label sm={3}>หน่วยงานที่สังกัด</Label>
              <Label sm={9}>{Dep}</Label>
            </Container>
            <br />

            <Label>
              <h4>สิทธิ์การใช้งาน</h4>
            </Label>
            <Nav tabs>
              {user.position === "ADMIN" ||
              (subservice.e_research.position === "ADMIN" &&
                subservice.e_research.active === "ACTIVE") ? (
                <>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "ResearchActive",
                      })}
                      onClick={() => {
                        toggle("ResearchActive");
                      }}
                    >
                      E-Research
                    </NavLink>
                  </NavItem>
                </>
              ) : null}
              {user.position === "ADMIN" ||
              (subservice.e_qa.position === "ADMIN" &&
                subservice.e_qa.active === "ACTIVE") ? (
                <>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "QAActive",
                      })}
                      onClick={() => {
                        toggle("QAActive");
                      }}
                    >
                      E-QA
                    </NavLink>
                  </NavItem>
                </>
              ) : null}
              {user.position === "ADMIN" ||
              (subservice.e_budget.position === "ADMIN" &&
                subservice.e_budget.active === "ACTIVE") ? (
                <>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "BudgetActive",
                      })}
                      onClick={() => {
                        toggle("BudgetActive");
                      }}
                    >
                      E-Budget
                    </NavLink>
                  </NavItem>
                </>
              ) : null}
            </Nav>
            {/* Tab Detail */}
            <Container>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="ResearchActive">
                  <ResearchActive />
                </TabPane>
                <TabPane tabId="QAActive">
                  <QAActive />
                </TabPane>
                <TabPane tabId="BudgetActive">
                  <BudgetActive />
                </TabPane>
              </TabContent>
            </Container>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default connect(null, null)(AdminPageActive);
