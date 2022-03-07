import React, { Fragment, useMemo, useState } from "react";
import { connect, useSelector } from "react-redux";
import { Container, Col, Row, Fade } from "reactstrap";
import { Route, Switch } from "react-router-dom";

// Main
import Login from "../../main/Login";
import UserPage from "./UserPage";
import CardComplaint from "../../complaint/Card";
import CardResearch from "../../research/Card";
import CardQA from "../../qa/Card";
import CardBudget from "../../budget/Card";

import PropTypes from "prop-types";

// GetServiceActive
import { getServiceForUserPage } from "../../../actions/main/serviceAction";

import { get_deadline } from "../../../actions/research/buttonAction";

// Complaint
import ComplaintPage from "../complaint/MainPage";
// Research
import ResearchPage from "../research/MainPage";
// QA
import QAPage from "../qa/MainPage";

// Budget
import BudgetPage from "../budget/MainPage.js";

// import { faIgloo } from "@fortawesome/free-solid-svg-icons";

const MainPage = (props) => {
  const checkToken = useSelector((state) => state.main.auth.token);
  const user = useSelector((state) => state.main.auth.user);
  const checkService = useSelector((state) => state.main.auth.service);
  const [LoadService, setLoadService] = useState(true);
  const [fadeIn] = useState(true);

  MainPage.propTypes = {
    getServiceForUserPage: PropTypes.func.isRequired,
    get_deadline: PropTypes.func.isRequired,
  };
  const { getServiceForUserPage, get_deadline } = props;

  useMemo(() => {
    if (LoadService) {
      const getDeadLine = async () => {
        const SendToken = await {
          checkToken,
        };
        await get_deadline(SendToken);
      };
      const getUService = async () => {
        if (user) {
          if (user.buasri_id) {
            const sendData = await {
              token: checkToken,
              buasri_id: user.buasri_id,
            };
            await getServiceForUserPage(sendData);
          }
        }
      };
      getUService();
      setLoadService(false);
      getDeadLine();
    }
    // eslint-disable-next-line
  }, [LoadService]);
  return (
    <Fragment>
      {checkToken ? (
        <Switch>
          <Route exact path="/">
            <Container>
              {/* <Row xs="1" sm="2" md="3" > */}
              <Row xs="1" sm="2" md="3">
                <Col className="py-2">
                  <Fade in={fadeIn}>
                    <CardComplaint />
                  </Fade>
                </Col>
                {checkService.e_research ? (
                  checkService.e_research.active === "ACTIVE" ? (
                    <Col className="py-2">
                      <Fade in={fadeIn}>
                        <CardResearch />
                      </Fade>
                    </Col>
                  ) : null
                ) : null}
                {checkService.e_qa ? (
                  checkService.e_qa.active === "ACTIVE" ? (
                    <Col className="py-2">
                      <Fade in={fadeIn}>
                        <CardQA />
                      </Fade>
                    </Col>
                  ) : null
                ) : null}
                {checkService.e_budget ? (
                  checkService.e_budget.active === "ACTIVE" ? (
                    <Col className="py-2">
                      <Fade in={fadeIn}>
                        <CardBudget />
                      </Fade>
                    </Col>
                  ) : null
                ) : null}
              </Row>
            </Container>
          </Route>
          <Route path="/users" component={UserPage} />
          <Route path="/complaint" component={ComplaintPage} />
          <Route path="/research" component={ResearchPage} />
          <Route path="/qa" component={QAPage} />
          <Route path="/budget" component={BudgetPage} />
        </Switch>
      ) : (
        <Login />
      )}
    </Fragment>
  );
};

export default connect(null, { getServiceForUserPage, get_deadline })(MainPage);
