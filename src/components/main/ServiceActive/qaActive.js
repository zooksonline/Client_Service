import React, { useState, Fragment } from "react";
import { connect, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Row,
  Col,
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// Send Service
import { sendQAActive } from "../../../actions/main/serviceAction";

const QAActive = (props) => {
  QAActive.propTypes = {
    sendQAActive: PropTypes.func.isRequired,
  };
  const { sendQAActive } = props;

  const { handleSubmit, register } = useForm();

  const token = useSelector((state) => state.main.auth.token);
  const user = useSelector((state) => state.main.auth.user);
  const servicelist = useSelector((state) => state.main.service);

  const [levelvalue] = useState(
    servicelist.E_QA
      ? servicelist.E_QA.position
        ? servicelist.E_QA.position
        : "USER"
      : "USER"
  );
  const [activevalue] = useState(
    servicelist.E_QA
      ? servicelist.E_QA.active
        ? servicelist.E_QA.active
        : "INACTIVE"
      : "INACTIVE"
  );

  // สิทธิ์
  const [actives] = useState([
    {
      label: "เปิดสิทธิ์",
      value: "ACTIVE",
    },
    {
      label: "ปิดสิทธิ์",
      value: "INACTIVE",
    },
  ]);
  const [levels] = useState([
    {
      label: "ผู้ใช้งาน",
      value: "USER",
    },
    {
      label: "กรรมการตรวจสอบ",
      value: "COMMITTEE",
    },
    {
      label: "ผู้ดูแลระบบ",
      value: "ADMIN",
    },
  ]);

  const onSubmit = async (e) => {
    const newSet = await {
      token: token,
      user_order: user.buasri_id,
      buasri_id: servicelist.buasri_id,
      position: e.levelinput,
      active: e.activeinput,
    };
    await sendQAActive(newSet);
  };

  return (
    <Fragment>
      <br />
      <Label className="font-weight-bolder">ข้อมูลสิทธิ์การใช้งาน</Label>
      <br />
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup row>
            <Label for="activeinput" sm={3}>
              การเปิดสิทธิ์:
            </Label>
            <Col sm={8}>
              <Fragment>
                <Input
                  type="select"
                  name="activeinput"
                  id="activeinput"
                  innerRef={register}
                  defaultValue={activevalue}
                >
                  {actives.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Input>
              </Fragment>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="levelinput" sm={3}>
              ระดับการเข้าใช้งาน:
            </Label>
            <Col sm={8}>
              <Fragment>
                <Input
                  type="select"
                  name="levelinput"
                  id="levelinput"
                  innerRef={register}
                  defaultValue={levelvalue}
                >
                  {levels.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Input>
              </Fragment>
            </Col>
          </FormGroup>
          <br />
          <FormGroup row>
            <Col sm={3}></Col>
            <Col sm={8}>
              <Button>ยืนยันการเปลี่ยนแปลง</Button>
            </Col>
          </FormGroup>
        </Form>
      </Container>
    </Fragment>
  );
};

export default withRouter(connect(null, { sendQAActive })(QAActive));
