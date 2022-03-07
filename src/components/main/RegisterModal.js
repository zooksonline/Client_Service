import React, { useState, useEffect, Fragment } from "react";
import { connect, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { register } from "../../actions/main/registerAction";
import { setDepartment, closeDepartment } from "../../actions/main/depAction";
import { clearErrors } from "../../actions/main/errorAction";

import {
  Alert,
  Button,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const RegisterModal = (props) => {
  const [modal, setmodal] = useState(false);
  const [title, settitle] = useState("นาย");
  const [buasri_id, setbuasri_id] = useState("");
  const [password, setpassword] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setemail] = useState("");
  const [dep, setdep] = useState(null);
  const [departments, setdepartments] = useState("");
  const [type, settype] = useState("STAFF");
  const [position] = useState("USER");
  const [active] = useState("ACTIVE");
  const [errorMsg, setErrorMsg] = useState("");

  const isAuthenticated = useSelector(
    (state) => state.main.auth.isAuthenticated
  );
  const listDepartment = useSelector((state) => state.main.departments.list);
  const error = useSelector((state) => state.main.error);

  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 1,
      }}
    />
  );
  RegisterModal.prototypes = {
    setDepartment: PropTypes.func.isRequired,
    closeDepartment: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };
  const { setDepartment, closeDepartment, register, clearErrors } = props;

  useEffect(() => {
    if (listDepartment) {
      const GetDepList = async () => {
        await setdepartments(listDepartment);
      };
      GetDepList();
    }
  }, [listDepartment]);

  useEffect(() => {
    // Check for register error
    if (error.id === "REGISTER_FAIL") {
      setErrorMsg(error.msg.msg);
    } else {
      setErrorMsg(null);
    }
    // eslint-disable-next-line
  }, [error]);

  useEffect(() => {
    // If authenticated, close modal
    if (modal) {
      if (isAuthenticated) {
        const ActionUser = async () => {
          await toggle();
        };
        ActionUser();
      }
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const toggle = () => {
    setmodal(!modal);
    if (modal) {
      closeDepartment();
      clearErrors();
    } else {
      setDepartment();
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "buasri_id") {
      setbuasri_id(value);
    } else if (name === "password") {
      setpassword(value);
    } else if (name === "title") {
      settitle(value);
    } else if (name === "firstname") {
      setfirstname(value);
    } else if (name === "lastname") {
      setlastname(value);
    } else if (name === "email") {
      setemail(value);
    } else if (name === "type") {
      settype(value);
    } else if (name === "dep") {
      setdep(value);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      buasri_id: buasri_id,
      password: password,
      title: title,
      firstname: firstname,
      lastname: lastname,
      email: email,
      dep: dep,
      position: position,
      type: type,
      active: active,
    };

    register(newUser);
  };
  return (
    <Fragment>
      <span onClick={toggle}>
        ลงทะเบียนเข้าใช้งาน <br />
        (สำหรับบุคลากรและนิสิต)
      </span>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>โปรดใส่รายละเอียดผู้ใช้งาน</ModalHeader>
        <ModalBody>
          {errorMsg ? <Alert color="danger">{errorMsg}</Alert> : null}
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label for="buasri_id">Buasri ID</Label>
              <Input
                type="text"
                name="buasri_id"
                placeholder="บัวศรีไอดี"
                onChange={onChange}
                required
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="รหัสผ่าน"
                onChange={onChange}
                required
              ></Input>
            </FormGroup>
            <ColoredLine color="grey" />
            <Row form>
              <Col md={12}>
                <Label for="name">ชื่อ - นามสกุล</Label>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Input type="select" name="title" onChange={onChange}>
                    <option>นาย</option>
                    <option>นางสาว</option>
                    <option>นาง</option>
                    <option>ดร.</option>
                    <option>ผศ.ดร.</option>
                    <option>รศ.ดร.</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Input
                    type="text"
                    name="firstname"
                    placeholder="ชื่อ"
                    onChange={onChange}
                    required
                  ></Input>
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <Input
                    type="text"
                    name="lastname"
                    placeholder="นามสกุล"
                    onChange={onChange}
                    required
                  ></Input>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="email">E-mail</Label>
              <Input
                type="text"
                name="email"
                placeholder="อีเมลที่ใช้ติดต่อ"
                onChange={onChange}
                required
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="dep">หน่วยงานที่สังกัด</Label>
              <Input type="select" name="dep" onChange={onChange} required>
                <option value="">โปรดเลือก</option>
                {departments &&
                  departments.map(({ _id, currentNameTH, currentNameEN }) => (
                    <option key={_id} value={currentNameEN}>
                      {currentNameTH}
                    </option>
                  ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="type">ประเภทผู้ใช้งาน</Label>
              <Input type="select" name="type" onChange={onChange}>
                <option value="STAFF">เจ้าหน้าที่</option>
                <option value="STUDENT">นิสิต</option>
                <option value="PROFESSOR">อาจารย์</option>
              </Input>
            </FormGroup>
            <Button color="dark" style={{ marginTop: "2rem" }} block>
              เพิ่มผู้ใช้งาน
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default connect(null, {
  setDepartment,
  closeDepartment,
  register,
  clearErrors,
})(RegisterModal);
