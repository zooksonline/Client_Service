import React, { Fragment, useState, useEffect, useRef } from "react";
import { CSVLink } from "react-csv";
import DateTimePicker from "react-datetime-picker";
import { connect, useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";

import PropTypes from "prop-types";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
  Input,
  Form,
} from "reactstrap";
import { useForm } from "react-hook-form";
// import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { add_deadline } from "../../actions/research/buttonAction.js";

import Moment from "react-moment";
import "moment-timezone";
import "moment/locale/th";
import moment from "moment-timezone";

const FormButton = (props) => {
  // research
  const [datetime, TimeChange] = useState(new Date());
  const [modal, setmodal] = useState(false);
  const [modaldate, setModalDate] = useState(false);

  const [modaldatecheck, setModaldatecheck] = useState(false);

  // project
  const [projectmodal, setprojectmodal] = useState(false);

  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    // watch
  } = useForm();

  FormButton.propTypes = {
    add_deadline: PropTypes.func.isRequired,
  };
  const token = useSelector((state) => state.main.auth.token);
  const user = useSelector((state) => state.main.auth.user);
  const service = useSelector((state) => state.main.auth.service);

  const list = useSelector((state) => state.research.list);
  const date = useSelector((state) => state.research.button.date);
  // const status = useSelector((state) => state.research.button.date[0].status);
  // const deadline = useSelector(
  //   (state) => state.research.button.date[0].datetime
  // );

  // const [count, setCount] = React.useState(0);
  const [OpenButton, setOpenButton] = useState(false);
  const [OpenDeadline, setOpenDeadline] = useState(false);
  const [Status, setStatus] = useState(false);

  const report = useSelector((state) => state.research.button.report);
  const [data, setdata] = useState([
    { _id: 0 },
    { buasri_id: null },
    { department: null },
    { firstname: null },
    { lastname: null },
    { position: null },
    { article: null },
    { type_article: null },
    { level: null },
    { sub_level_1: null },
    { sub_level_2: null },
    { year: null },
    { research_year: null },
    { author: null },
    { name: null },
    { conference: null },
    { quartile: null },
    { tags: null },
    { status: null },
    {},
  ]);
  const csvLink = useRef();
  const getTransactionData = async () => {
    await csvLink.current.link.click();
  };

  useEffect(() => {
    if (date) {
      if (date[0]) {
        if (date[0].status === "open") {
          setStatus(true);
        } else {
          setStatus(false);
        }
        if (date[0].datetime) {
          const currentDate = moment()._d;
          const currentDateUnix = Date.parse(currentDate);
          const deadlineUnix = Date.parse(date[0].datetime);
          if (deadlineUnix >= currentDateUnix) {
            setOpenButton(true);
          } else {
            setOpenButton(false);
          }
        }
      }
    }
  }, [date]);

  useEffect(() => {
    if (report) {
      setdata(report);
    }
    // eslint-disable-next-line
  }, [report]);

  const { add_deadline } = props;

  // const tick = () => {
  //   //let newCount = count < 60 ? count + 1 : 0
  //   setCount((prevState) => (prevState < 1 ? prevState + 1 : 0));
  // };

  // useEffect(() => {
  //   const timer = setInterval(() => tick(), 1000);
  //   return () => clearInterval(timer);
  // });

  // research
  const toggle = () => {
    setmodal(!modal);
  };
  const press = () => {
    setModalDate(!modaldate);
  };
  const pressCheck = () => {
    setModaldatecheck(!modaldatecheck);
  };

  // project
  const projecttoggle = () => {
    setprojectmodal(!projectmodal);
  };

  // const onChangeDate = (datePicker) => {
  //   setDatePicker(datePicker);
  // };
  const GoFormPage = (e) => {
    e.preventDefault();
    dispatch({ type: "PAGE_LOADING" });
    props.history.push("/research/form");
  };

  const GoProjectFormPage = (e) => {
    e.preventDefault();
    dispatch({ type: "PAGE_LOADING" });
    props.history.push("/research/project/form");
  };

  // const date = useSelector((state) => state.research.button.date);
  const onSubmit = async (e) => {
    async function submit() {
      if (OpenDeadline === true) {
        const newList = await {
          token,
          name: "time",
          buasri_id: user.buasri_id,
          datetime: datetime,
          status: e.status,
        };

        await add_deadline(newList);
        await alert("ตั้งการจำกัดเวลาสำเร็จ");
        dispatch({ type: "PAGE_LOADING" });
        props.history.push("/research");
        // console.log(newList);
        setModalDate(false);
      } else if (OpenDeadline === false) {
        const newList = await {
          token,
          name: "time",
          buasri_id: user.buasri_id,
          datetime: null,
          status: e.status,
        };

        await add_deadline(newList);
        await alert("ปิดการตั้งเวลาสำเร็จ");
        dispatch({ type: "PAGE_LOADING" });
        props.history.push("/research");
        // console.log(newList);
        setModalDate(false);
      }
    }
    submit();
  };
  const onChangeButton = (e) => {
    const { name, value } = e.target;

    if (name === "status") {
      if (value === "open") {
        setOpenDeadline(true);
      } else if (value === "close") {
        setOpenDeadline(false);
      }
    }
  };

  return (
    <Fragment>
      {Status ? (
        <Fragment>
          {OpenButton ? (
            <Fragment>
              <Button name="button" color="dark" onClick={toggle}>
                แบบฟอร์มเพิ่มผลงานวิจัย
              </Button>
              <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                  <p>หลักเกณฑ์ในการกรอกแบบฟอร์มผลงานวิจัย</p>
                </ModalHeader>
                <ModalBody>
                  <p>
                    โปรดกรอกข้อมูล และทบทวนข้อมูลให้ครบถ้วน ก่อนกดส่ง
                    (ส่งได้เพียง 1 ครั้ง/1 หัวเรื่องผลงานวิจัย)
                  </p>
                  <p>
                    หากสงสัยรายละเอียดในการกรอกข้อมูล ขอให้แจ้ง mail มาที่
                    puenisara@g.swu.ac.th เพื่อรอคำแนะนำการดำเนินการต่อไป
                  </p>
                  <p>
                    ***กรณีที่ท่านมีการส่งข้อมูลผิดพลาด
                    ให้เพิ่มแบบฟอร์มใหม่อีกครั้ง***
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button name="button" color="dark" onClick={GoFormPage}>
                    ยอมรับ
                  </Button>
                  <Button name="button" color="warning" onClick={toggle}>
                    ไม่ยอมรับ
                  </Button>
                </ModalFooter>
              </Modal>
            </Fragment>
          ) : OpenButton ? null : (
            <Fragment>
              <Button name="button" color="dark" onClick={toggle} disabled>
                แบบฟอร์มเพิ่มผลงานวิจัย
              </Button>
              <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                  <p>หลักเกณฑ์ในการกรอกแบบฟอร์มผลงานวิจัย</p>
                </ModalHeader>
                <ModalBody>
                  <p>
                    โปรดกรอกข้อมูล และทบทวนข้อมูลให้ครบถ้วน ก่อนกดส่ง
                    (ส่งได้เพียง 1 ครั้ง/1 หัวเรื่องผลงานวิจัย)
                  </p>
                  <p>
                    หากสงสัยรายละเอียดในการกรอกข้อมูล ขอให้แจ้ง mail มาที่
                    puenisara@g.swu.ac.th เพื่อรอคำแนะนำการดำเนินการต่อไป
                  </p>
                  <p>
                    ***กรณีที่ท่านมีการส่งข้อมูลผิดพลาด
                    ให้เพิ่มแบบฟอร์มใหม่อีกครั้ง***
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button name="button" color="dark" onClick={GoFormPage}>
                    ยอมรับ
                  </Button>
                  <Button name="button" color="warning" onClick={toggle}>
                    ไม่ยอมรับ
                  </Button>
                </ModalFooter>
              </Modal>
            </Fragment>
          )}
        </Fragment>
      ) : null}
      {Status ? null : (
        <Fragment>
          <Button name="button" color="dark" onClick={toggle}>
            แบบฟอร์มเพิ่มผลงานวิจัย
          </Button>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>
              <p>หลักเกณฑ์ในการกรอกแบบฟอร์มผลงานวิจัย</p>
            </ModalHeader>
            <ModalBody>
              <p>
                โปรดกรอกข้อมูล และทบทวนข้อมูลให้ครบถ้วน ก่อนกดส่ง (ส่งได้เพียง 1
                ครั้ง/1 หัวเรื่องผลงานวิจัย)
              </p>
              <p>
                หากสงสัยรายละเอียดในการกรอกข้อมูล ขอให้แจ้ง mail มาที่
                puenisara@g.swu.ac.th เพื่อรอคำแนะนำการดำเนินการต่อไป
              </p>
              <p>
                ***กรณีที่ท่านมีการส่งข้อมูลผิดพลาด
                ให้เพิ่มแบบฟอร์มใหม่อีกครั้ง***
              </p>
            </ModalBody>
            <ModalFooter>
              <Button name="button" color="dark" onClick={GoFormPage}>
                ยอมรับ
              </Button>
              <Button name="button" color="warning" onClick={toggle}>
                ไม่ยอมรับ
              </Button>
            </ModalFooter>
          </Modal>
        </Fragment>
      )}
      {/* 2 button */} {/* <Fragment> */}
      {/* <Button color="dark" onClick={projecttoggle}>
          แบบฟอร์มเพิ่มโครงการวิจัย
        </Button> */}
      {/* <Modal isOpen={projectmodal} toggle={projecttoggle}>
          <ModalHeader toggle={projecttoggle}>
            <p>หลักเกณฑ์ในการกรอกแบบฟอร์มโครงการวิจัย</p>
          </ModalHeader>
          <ModalBody>
            <p>
              โปรดกรอกข้อมูล และทบทวนข้อมูลให้ครบถ้วน ก่อนกดส่ง (ส่งได้เพียง 1
              ครั้ง/1 หัวเรื่องผลงานวิจัย)
            </p>
            <p>
              หากสงสัยรายละเอียดในการกรอกข้อมูล ขอให้แจ้ง mail มาที่
              puenisara@g.swu.ac.th เพื่อรอคำแนะนำการดำเนินการต่อไป
            </p>
            <p>
              ***กรณีที่ท่านมีการส่งข้อมูลผิดพลาด
              ให้เพิ่มแบบฟอร์มใหม่อีกครั้ง***
            </p>
          </ModalBody>
          <ModalFooter>
            <Button name="button" color="dark" onClick={GoProjectFormPage}>
              ยอมรับ
            </Button>
            <Button name="button" color="warning" onClick={projecttoggle}>
              ไม่ยอมรับ
            </Button>
          </ModalFooter>
        </Modal> */}
      {/* </Fragment> */}
      {/* เว้นบรรทัดสำหรับเพิ่มปุ่ม */}
      {/* <br />
      <br /> */}
      {/* 3 button */}{" "}
      {list.list.length !== 0 ? (
        <Fragment>
          <Button color="dark" onClick={getTransactionData}>
            ดาวน์โหลดรายงาน
          </Button>
          <CSVLink
            data={data}
            filename="report.csv"
            className="hidden"
            ref={csvLink}
            target="_blank"
          />
        </Fragment>
      ) : null}
      {/* 4 button */}
      {""}
      {service.e_research.position === "ADMIN" ? (
        <Fragment>
          <Button
            name="button"
            color="dark"
            onClick={press}
            style={{ marginLeft: "5px" }}
          >
            กำหนดเวลาส่งบทความวิจัย
          </Button>
          <Modal isOpen={modaldate} toggle={press}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader toggle={press}>
                <FormGroup>
                  <Label for="status">ต้องการเปิดการจำกัดเวลาหรือไม่</Label>
                  <Input
                    type="select"
                    name="status"
                    innerRef={register}
                    onChange={onChangeButton}
                    required
                  >
                    <option value="">---โปรดเลือก---</option>
                    <option value="open">เปิด</option>
                    <option value="close">ปิด</option>
                  </Input>
                </FormGroup>
              </ModalHeader>
              <ModalBody>
                {OpenDeadline ? (
                  <Fragment>
                    <p>กรุณาเลือกวันที่</p>
                    <div>
                      <DateTimePicker
                        name="date"
                        onChange={TimeChange}
                        value={datetime}
                        required
                      />
                      <p style={{ fontSize: "20px", marginTop: "13px" }}>
                        {datetime ? (
                          <Fragment>{datetime.toDateString()}</Fragment>
                        ) : null}
                      </p>
                    </div>
                  </Fragment>
                ) : null}
                <Button color="dark">ยืนยัน</Button>
              </ModalBody>
            </Form>
          </Modal>
          {/* กำหนดการตรวจบทความ */}
          <Button
            name="button"
            color="dark"
            onClick={pressCheck}
            style={{ marginLeft: "5px" }}
          >
            กำหนดเวลาการตรวจบทความวิจัย
          </Button>
          <Modal isOpen={modaldatecheck} toggle={pressCheck}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader toggle={pressCheck}>
                <FormGroup>
                  <Label for="status">ต้องการเปิดการจำกัดเวลาหรือไม่</Label>
                  <Input
                    type="select"
                    name="status"
                    innerRef={register}
                    onChange={onChangeButton}
                    required
                  >
                    <option value="">---โปรดเลือก---</option>
                    <option value="open">เปิด</option>
                    <option value="close">ปิด</option>
                  </Input>
                </FormGroup>
              </ModalHeader>
              <ModalBody>
                {OpenDeadline ? (
                  <Fragment>
                    <p>กรุณาเลือกวันที่</p>
                    <div>
                      <DateTimePicker
                        name="date"
                        onChange={TimeChange}
                        value={datetime}
                        required
                      />
                      <p style={{ fontSize: "20px", marginTop: "13px" }}>
                        {datetime ? (
                          <Fragment>{datetime.toDateString()}</Fragment>
                        ) : null}
                      </p>
                    </div>
                  </Fragment>
                ) : null}
                <Button color="dark">ยืนยัน</Button>
              </ModalBody>
            </Form>
          </Modal>
        </Fragment>
      ) : null}
      <br />
      {/* {/* use inline-block to same line with ปุ่มกลับหน้าหลัก */}
      <br />
      <p style={{ display: "inline-block", fontSize: "17px" }}>
        เวลาปัจจุบัน{" "}
        <Moment
          format="HH:mm:ss"
          // onChange={(val) => {
          //   console.log(val);
          // }}
          tz="Asia/Bangkok"
        ></Moment>
        <br />
        วันที่ปัจจุบัน{" "}
        <Moment
          name="currentDate"
          format="DD MMMM YYYY"
          tz="Asia/Bangkok"
        ></Moment>
        <br />
        <Fragment>
          {Status === true ? (
            <Fragment>
              สิ้นสุดการเพิ่มแบบฟอร์มผลงานวิจัยเมื่อวันที่{" "}
              <Moment format="DD MMMM YYYY">{date[0].datetime}</Moment> เวลา{" "}
              <Moment format="HH:mm:ss">{date[0].datetime}</Moment>
            </Fragment>
          ) : null}
        </Fragment>
      </p>
    </Fragment>
  );
};

export default withRouter(connect(null, { add_deadline })(FormButton));
