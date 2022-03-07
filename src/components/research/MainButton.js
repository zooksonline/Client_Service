import React, { Fragment, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { connect, useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router";
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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import "react-calendar/dist/Calendar.css";
import {
  add_deadline,
  add_deadline_check,
} from "../../actions/research/buttonAction.js";

import DateTimePicker from "react-datetime-picker";
import Moment from "react-moment";
import "moment-timezone";
import "moment/locale/th";
import moment from "moment-timezone";

import { CSVLink } from "react-csv";

const MainButton = (props) => {
  const {
    handleSubmit,
    register,
    // watch
  } = useForm();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formProjectOpen, setFormProjectOpen] = useState(false);

  const [AllowDeadline, setAllowDeadline] = useState(false);
  const [AllowDeadlineCheck, setAllowDeadlineCheck] = useState(false);

  const token = useSelector((state) => state.main.auth.token);
  const user = useSelector((state) => state.main.auth.user);
  const service = useSelector((state) => state.main.auth.service);

  const list = useSelector((state) => state.research.list);
  const date = useSelector((state) => state.research.button.date);
  const date_check = useSelector((state) => state.research.button.date_check);

  const currentDate = moment()._d;
  const currentDateUnix = Date.parse(currentDate);
  const [datetime, TimeChange] = useState(new Date());

  //   Deadline
  const [deadlineOpen, setDeadlineOpen] = useState(false);
  const [dateST, setDateST] = useState(false);
  const [deadlineUnix, setDeadlineUnix] = useState(null);
  const [ButtonDeadline, setButtonDeadline] = useState(false);

  // Deadline Check
  const [deadlinecheckOpen, setDeadlinecheckOpen] = useState(false);
  const [dateCheckST, setDateCheckST] = useState(false);
  const [deadlineChackUnix, setDeadlineChackUnix] = useState(null);
  //   Report
  const report = useSelector((state) => state.research.button.report);
  const [dataReport, setDataReport] = useState([
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

  const dispatch = useDispatch();

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const toggleForm = () => setFormOpen((prevState) => !prevState);
  const toggleFormProject = () => setFormProjectOpen((prevState) => !prevState);
  const toggleDeadline = () => setDeadlineOpen((prevState) => !prevState);
  const toggleDeadlineCheck = () =>
    setDeadlinecheckOpen((prevState) => !prevState);

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

  MainButton.propTypes = {
    add_deadline: PropTypes.func.isRequired,
    add_deadline_check: PropTypes.func.isRequired,
  };
  const { add_deadline, add_deadline_check } = props;

  //   get date
  useEffect(() => {
    date
      ? date[0]
        ? date[0].status === "open"
          ? setDateST(true)
          : setDateST(false)
        : setDateST(false)
      : setDateST(false);

    date
      ? date[0]
        ? date[0].datetime
          ? setDeadlineUnix(Date.parse(date[0].datetime))
          : setDeadlineUnix(null)
        : setDeadlineUnix(null)
      : setDeadlineUnix(null);

    deadlineUnix
      ? deadlineUnix >= currentDateUnix || date[0].status === "close"
        ? setButtonDeadline(true)
        : setButtonDeadline(false)
      : setButtonDeadline(false);
  }, [date]);

  // get date_check
  useEffect(() => {
    date_check
      ? date_check[0]
        ? date_check[0].status === "open"
          ? setDateCheckST(true)
          : setDateCheckST(false)
        : setDateCheckST(false)
      : setDateCheckST(false);

    date_check
      ? date_check[0]
        ? date_check[0].datetime
          ? setDeadlineChackUnix(Date.parse(date_check[0].datetime))
          : setDeadlineChackUnix(null)
        : setDeadlineChackUnix(null)
      : setDeadlineChackUnix(null);
  }, [date_check]);

  //   set Report
  useEffect(() => {
    if (report) {
      setDataReport(report);
    }
    // eslint-disable-next-line
  }, [report]);

  //   deadlline submit
  const SubmitDeadline = async (e) => {
    async function submit() {
      console.log("submit success");
      if (e.datestatus === "open") {
        const newList = await {
          token,
          name: "time",
          buasri_id: user.buasri_id,
          datetime: datetime,
          status: e.datestatus,
        };
        await add_deadline(newList);
        // await console.log("ส่งเวลา: " + JSON.stringify(newList));
        await alert("ตั้งการจำกัดเวลาการส่งบทความสำเร็จ");
        dispatch({ type: "PAGE_LOADING" });
        props.history.push("/research");
        setDeadlineOpen(false);
      } else if (e.datestatus === "close") {
        const newList = await {
          token,
          name: "time",
          buasri_id: user.buasri_id,
          datetime: null,
          status: e.datestatus,
        };

        await add_deadline(newList);
        // await console.log("ส่งเวลา: " + JSON.stringify(newList));
        await alert("ปิดการจำกัดเวลาการส่งบทความสำเร็จ");
        dispatch({ type: "PAGE_LOADING" });
        props.history.push("/research");
        // console.log(newList);
        setDeadlineOpen(false);
      }
    }
    submit();
  };

  //   deadline dropdown
  const DeadlineDropdown = (e) => {
    const { name, value } = e.target;

    if (name === "datestatus") {
      if (value === "open") {
        setAllowDeadline(true);
      } else if (value === "close") {
        setAllowDeadline(false);
      }
    }
  };

  //   deadllinecheck submit
  const SubmitDeadlineCheck = async (e) => {
    async function submit() {
      // console.log("submit success");
      if (e.datecheckstatus === "open") {
        const newCheckList = await {
          token,
          name: "timecheck",
          buasri_id: user.buasri_id,
          datetime: datetime,
          status: e.datecheckstatus,
        };
        await add_deadline_check(newCheckList);
        await alert("ตั้งการจำกัดเวลาการตรวจบทความสำเร็จ");
        dispatch({ type: "PAGE_LOADING" });
        props.history.push("/research");
        setDeadlinecheckOpen(false);
      } else if (e.datecheckstatus === "close") {
        const newCheckList = await {
          token,
          name: "timecheck",
          buasri_id: user.buasri_id,
          datetime: null,
          status: e.datecheckstatus,
        };
        await add_deadline_check(newCheckList);
        await alert("ปิดการจำกัดเวลาการตรวจบทความสำเร็จ");
        dispatch({ type: "PAGE_LOADING" });
        props.history.push("/research");
        setDeadlinecheckOpen(false);
      }
    }
    submit();
  };

  // deadllinecheck dropdown
  const DeadlineDropdownCheck = async (e) => {
    const { name, value } = e.target;

    if (name === "datecheckstatus") {
      if (value === "open") {
        setAllowDeadlineCheck(true);
      } else if (value === "close") {
        setAllowDeadlineCheck(false);
      }
    }
  };

  return (
    <Fragment>
      {/* Modal Form */}
      <Modal isOpen={formOpen} toggle={toggleForm}>
        <ModalHeader toggle={toggleForm}>
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
            ***กรณีที่ท่านมีการส่งข้อมูลผิดพลาด ให้เพิ่มแบบฟอร์มใหม่อีกครั้ง***
          </p>
        </ModalBody>
        <ModalFooter>
          <Button name="button" color="dark" onClick={GoFormPage}>
            ยอมรับ
          </Button>
          <Button name="button" color="warning" onClick={toggleForm}>
            ไม่ยอมรับ
          </Button>
        </ModalFooter>
      </Modal>
      {/* Modal DeadLine */}
      <Modal isOpen={deadlineOpen} toggle={toggleDeadline}>
        <Form onSubmit={handleSubmit(SubmitDeadline)}>
          <ModalHeader toggle={toggleDeadline}>
            <FormGroup>
              <Label for="datestatus">ต้องการเปิดการจำกัดเวลาหรือไม่</Label>
              <Input
                type="select"
                name="datestatus"
                innerRef={register}
                onChange={DeadlineDropdown}
                required
              >
                <option value="">---โปรดเลือก---</option>
                <option value="open">เปิด</option>
                <option value="close">ปิด</option>
              </Input>
            </FormGroup>
          </ModalHeader>
          <ModalBody>
            {AllowDeadline ? (
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
      {/* Modal DeadLine Check */}
      <Modal isOpen={deadlinecheckOpen} toggle={toggleDeadlineCheck}>
        <Form onSubmit={handleSubmit(SubmitDeadlineCheck)}>
          <ModalHeader toggle={toggleDeadlineCheck}>
            <FormGroup>
              <Label for="datecheckstatus">
                ต้องการเปิดการจำกัดเวลาการตรวจสอบบทความวิจัยหรือไม่ ?
              </Label>
              <Input
                type="select"
                name="datecheckstatus"
                innerRef={register}
                onChange={DeadlineDropdownCheck}
                required
              >
                <option value="">---โปรดเลือก---</option>
                <option value="open">เปิด</option>
                <option value="close">ปิด</option>
              </Input>
            </FormGroup>
          </ModalHeader>
          <ModalBody>
            {AllowDeadlineCheck ? (
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
      {/* Modal Project Form */}
      <Fragment>
        <Modal isOpen={formProjectOpen} toggle={toggleFormProject}>
          <ModalHeader toggle={toggleFormProject}>
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
            <Button name="button" color="warning" onClick={toggleFormProject}>
              ไม่ยอมรับ
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
      <Fragment>
        <CSVLink
          data={dataReport}
          filename="report.csv"
          className="hidden"
          ref={csvLink}
          target="_blank"
        />
      </Fragment>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret>โปรดเลือกรายการที่ต้องการ </DropdownToggle>
        <DropdownMenu>
          {ButtonDeadline || dateST === false ? (
            <DropdownItem onClick={toggleForm}>
              แบบฟอร์มเพิ่มผลงานวิจัย
            </DropdownItem>
          ) : (
            <></>
          )}
          {/* <DropdownItem onClick={toggleFormProject}>
            แบบฟอร์มเพิ่มโครงการวิจัย
          </DropdownItem> */}
          <DropdownItem onClick={getTransactionData}>
            ดาวน์โหลดรายงาน
          </DropdownItem>
          {service.e_research.position === "ADMIN" ? (
            <Fragment>
              <DropdownItem onClick={toggleDeadline}>
                กำหนดเวลาส่งบทความวิจัย
              </DropdownItem>
              <DropdownItem onClick={toggleDeadlineCheck}>
                กำหนดเวลาตรวจบทความวิจัย
              </DropdownItem>
            </Fragment>
          ) : null}
        </DropdownMenu>
      </Dropdown>
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
          {dateST === true ? (
            <Fragment>
              สิ้นสุดการเพิ่มแบบฟอร์มบทความวิจัยในวันที่{" "}
              <Moment format="DD MMMM YYYY">{date[0].datetime}</Moment> เวลา{" "}
              <Moment format="HH:mm:ss">{date[0].datetime}</Moment>
              <br />
            </Fragment>
          ) : null}{" "}
          {dateCheckST === true &&
          (service.e_research.position === "ADMIN" ||
            service.e_research.position === "COMMITTEE") ? (
            <>
              สิ้นสุดการตรวจบทความวิจัยในวันที่{" "}
              <Moment format="DD MMMM YYYY">{date_check[0].datetime}</Moment>{" "}
              เวลา <Moment format="HH:mm:ss">{date_check[0].datetime}</Moment>
            </>
          ) : null}
        </Fragment>
      </p>
    </Fragment>
  );
};

export default withRouter(
  connect(null, { add_deadline, add_deadline_check })(MainButton)
);
