import React, { useState, useEffect, Fragment } from "react";
import { connect, useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  // CustomInput,
} from "reactstrap";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  status_committee,
  status_admin,
  loadingoverlay,
} from "../../actions/research/listAction";

import { newlog as sendLog } from "../../actions/research/logAction";

// Get E-mail Action
import { getemail_admin } from "../../actions/research/emailAction";
// Get QA Action
import { add_qa } from "../../actions/research/qaAction";

import LoadingOverlay from "react-loading-overlay";
import styled, { css } from "styled-components";
import "../../utilis/research/style_updatestatusmodal.css";

const UpdateStatusModal = (props) => {
  const { handleSubmit, register } = useForm();

  const user = useSelector((state) => state.main.auth.user);
  const e_research = useSelector((state) => state.main.auth.service.e_research);
  const detail = useSelector((state) => state.research.list.detail);
  const token = useSelector((state) => state.main.auth.token);
  const CheckLoadingOverlay = useSelector(
    (state) => state.research.trigger.loading_overlay
  );

  // ค่า status ที่ต้องการเปลี่ยน
  const initialValue = [
    { id: 0, value: "A", name: "1" },
    { id: 1, value: "B", name: "2" },
  ];
  // const [StatusCurrent, setStatusCurrent] = useState(null);
  const [StatusName, setStatusName] = useState(null);
  const [StatusChange, setStatusChange] = useState(initialValue);
  const [modal, setmodal] = useState(false);
  const [disButton] = useState(false);
  const [OpenComment, setOpenComment] = useState(false);

  // Email Reducer
  const email_admin = useSelector((state) => state.research.email.email_admin);
  const [countEmail, setcountEmail] = useState(0);

  const DarkBackground = styled.div`
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 999; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */

    ${(props) =>
      props.disappear &&
      css`
        display: block; /* show */
      `}
  `;

  // ////////////////////////////////////////////////////////////////////

  UpdateStatusModal.propTypes = {
    status_committee: PropTypes.func.isRequired,
    status_admin: PropTypes.func.isRequired,
    getemail_committee: PropTypes.func,
    getemail_admin: PropTypes.func,
    sendLog: PropTypes.func.isRequired,
    add_qa: PropTypes.func,
    loadingoverlay: PropTypes.func,
  };
  const {
    status_committee,
    status_admin,
    getemail_admin,
    sendLog,
    add_qa,
    loadingoverlay,
  } = props;

  // status ก่อนเปลี่ยน
  useEffect(() => {
    if (detail) {
      if (detail[0].status === "WAITING") {
        setStatusName("รอกรรมการตรวจสอบ");
      }
      if (detail[0].status === "WAITINGADMIN") {
        setStatusName("รอฝ่ายวิจัยตรวจสอบ");
      }
      if (detail[0].status === "REJECT") {
        setStatusName("ยกเลิก");
      }
      if (detail[0].status === "EDIT") {
        setStatusName("แก้ไข");
      }
      if (detail[0].status === "APPROVED") {
        setStatusName("ผ่านการตรวจสอบ");
      }
    }
    // eslint-disable-next-line
  }, [detail]);

  // status สำหรับเปลี่ยน
  useEffect(() => {
    const WaitingStatus = [
      {
        id: 0,
        value: "WAITINGADMIN",
        name: "ผ่านการตรวจสอบ ส่งให้ฝ่ายวิจัยตรวจสอบ",
      },
      { id: 1, value: "EDIT", name: "แก้ไข" },
      { id: 2, value: "REJECT", name: "ยกเลิก" },
    ];
    const WaitingAdminStatus = [
      { id: 0, value: "APPROVED", name: "ผ่านการตรวจสอบ" },
      { id: 1, value: "EDIT", name: "แก้ไข" },
      { id: 2, value: "REJECT", name: "ยกเลิก" },
    ];
    const EditStatus = [
      { id: 0, value: "WAITING", name: "ส่งกลับไปที่ผู้ส่งงานวิจัย" },
    ];

    if (StatusName) {
      if (detail[0].status === "WAITING") {
        setStatusChange(WaitingStatus);
      }
      if (detail[0].status === "WAITINGADMIN") {
        setStatusChange(WaitingAdminStatus);
      }
      if (detail[0].status === "EDIT") {
        setStatusChange(EditStatus);
      }
    }
    // eslint-disable-next-line
  }, [StatusName]);

  // Check หากมี modal ให้ดึง E-mail
  useEffect(() => {
    if (modal) {
      // Check Status
      if (detail) {
        if (detail[0].status === "WAITING") {
          const get_email_admin = async () => {
            const SendToken = await {
              token,
            };
            await getemail_admin(SendToken);
          };
          get_email_admin();
        }
      }
    }
    // eslint-disable-next-line
  }, [modal]);

  // IF GET EMAIL ADMIN THEN COUNT EMAIL
  useEffect(() => {
    if (email_admin) {
      setcountEmail(email_admin.length);
    }
  }, [email_admin]);

  const toggle = async () => {
    await setmodal(!modal);
  };

  const onChange = async (e) => {
    const { name, value } = e.target;
    if (name === "status_change") {
      if (value === "EDIT" || value === "REJECT") {
        setOpenComment(true);
      } else {
        setOpenComment(false);
      }
    }
  };

  const onSubmit = async (e) => {
    if (e_research) {
      if (e_research.position) {
        const Update = await {
          token,
          id: e.no_id,
          buasri_id: detail[0].buasri_id,
          firstname: detail[0].firstname,
          lastname: detail[0].lastname,
          committee:
            e_research.position === "COMMITTEE" ? user.buasri_id : undefined,
          admin: e_research.position === "ADMIN" ? user.buasri_id : undefined,
          email: detail[0].email,
          research_name: detail[0].research_name,
          research_name_th: detail[0].research_name_th,
          status: e.status_change,
          note: e.note,
          count_email:
            e.status_change === "WAITINGADMIN" ? countEmail : undefined,
          data_email:
            e.status_change === "WAITINGADMIN" ? email_admin : detail[0].email,
          user_email: user.email,
        };

        const newlog = await {
          token,
          year: detail[0].year,
          research_id: e.no_id,
          buasri_id: detail[0].buasri_id,
          firstname: detail[0].firstname,
          lastname: detail[0].lastname,
          position: detail[0].position,
          committee:
            e_research.position === "COMMITTEE" ? user.buasri_id : undefined,
          admin: e_research.position === "ADMIN" ? user.buasri_id : undefined,
          email: detail[0].email,
          author: detail[0].author_type,
          name: detail[0].research_name,
          name_th: detail[0].research_name_th,
          article: detail[0].article_type,
          research_year: detail[0].research_year,
          conference_name:
            detail[0].article_type === "CONFERENCE"
              ? detail[0].conf[0].conf_name
              : undefined,
          conference_month:
            detail[0].article_type === "CONFERENCE"
              ? detail[0].conf[0].research_month
              : undefined,
          conference_country:
            detail[0].article_type === "CONFERENCE"
              ? detail[0].conf[0].country
              : undefined,
          conference_local:
            detail[0].article_type === "CONFERENCE"
              ? detail[0].conf[0].local_name
              : undefined,
          journal_name: detail[0].article_type_name[0].journal_name,
          level: detail[0].level,
          level_sub1: detail[0].level_sub1,
          level_sub2: detail[0].level_sub2,
          type_name:
            detail[0].article_type === "PETTY-PATENT" || "PATENT" || "COPYRIGHT"
              ? detail[0].article_type_name[0].type_name
              : undefined,
          request_number:
            detail[0].article_type === "PETTY-PATENT" || "PATENT" || "COPYRIGHT"
              ? detail[0].article_type_name[0].request_number
              : undefined,
          register_number:
            detail[0].article_type === "PETTY-PATENT" || "PATENT" || "COPYRIGHT"
              ? detail[0].article_type_name[0].register_number
                ? detail[0].article_type_name[0].register_number
                : undefined
              : undefined,
          status: e.status_change,
          note: e.note,
          count_email:
            e.status_change === "WAITINGADMIN" ? countEmail : undefined,
          data_email:
            e.status_change === "WAITINGADMIN" ? email_admin : detail[0].email,
        };

        // console.log(Update);
        if (e_research.position === "ADMIN") {
          await loadingoverlay();
          await status_admin(Update);
          await sendLog(newlog);
          if (e.status_change === "APPROVED") {
            // ส่งค่าไปยัง QA
            const new_researchQA = await {
              token,
              buasri_id: detail[0].buasri_id,
              firstname: detail[0].firstname,
              lastname: detail[0].lastname,
              dep: detail[0].dep,
              email: detail[0].email,
              research_id: detail[0]._id,
              research_name: detail[0].research_name,
              research_name_th: detail[0].research_name_th,
              research_year: detail[0].research_year,
              year_at: detail[0].year,
              article: detail[0].article_type,
              level: detail[0].level,
              sub_level_1: detail[0].level_sub1,
              sub_level_2: detail[0].level_sub2,
              quartile: detail[0].quartile,
              type_name: detail[0].article_type_name[0]
                ? detail[0].article_type_name[0].type_name
                  ? detail[0].article_type_name[0].type_name
                  : undefined
                : undefined,
              request_number: detail[0].article_type_name[0]
                ? detail[0].article_type_name[0].request_number
                  ? detail[0].article_type_name[0].request_number
                  : undefined
                : undefined,
              register_number: detail[0].article_type_name[0]
                ? detail[0].article_type_name[0].register_number
                  ? detail[0].article_type_name[0].register_number
                  : undefined
                : undefined,
              journal_name: detail[0].article_type_name[0]
                ? detail[0].article_type_name[0].journal_name
                  ? detail[0].article_type_name[0].journal_name
                  : undefined
                : undefined,
              research_month: detail[0].conf[0]
                ? detail[0].conf[0].research_month
                  ? detail[0].conf[0].research_month
                  : undefined
                : undefined,
              conf_name: detail[0].conf[0]
                ? detail[0].conf[0].conf_name
                  ? detail[0].conf[0].conf_name
                  : undefined
                : undefined,
              country: detail[0].conf[0]
                ? detail[0].conf[0].country
                  ? detail[0].conf[0].country
                  : undefined
                : undefined,
              local: detail[0].conf[0]
                ? detail[0].conf[0].local_name
                  ? detail[0].conf[0].local_name
                  : undefined
                : undefined,
              author: detail[0].author_type,
              tags: detail[0].tags ? detail[0].tags : [],
              file_name: detail[0].file_name ? detail[0].file_name : undefined,
              file_path: detail[0].file_path ? detail[0].file_path : undefined,
            };
            add_qa(new_researchQA);
          }
        } else if (e_research.position === "COMMITTEE") {
          await loadingoverlay();
          await status_committee(Update);
          await sendLog(newlog);
        }
      }
    }
  };

  return (
    <Fragment>
      {detail[0].status !== "APPROVED" || detail[0].status !== "REJECT" ? (
        <Button onClick={toggle} disabled={disButton}>
          อัพเดตสถานะ
        </Button>
      ) : null}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>สถานะที่ต้องการอัพเดต</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label for="no_id">หมายเลขงานวิจัย</Label>
              <Input
                type="text"
                name="no_id"
                placeholder={detail[0]._id}
                value={detail[0]._id}
                innerRef={register}
                readOnly
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="current_status">สถานะปัจจุบัน</Label>
              <Input
                type="text"
                name="current_status"
                value={StatusName}
                innerRef={register}
                readOnly
              ></Input>
            </FormGroup>
            {OpenComment ? (
              <FormGroup>
                <Label for="note">*รายละเอียด</Label>
                <Input
                  type="textarea"
                  name="note"
                  innerRef={register}
                  required
                ></Input>
              </FormGroup>
            ) : null}

            <FormGroup>
              <Label for="status_change">สถานะที่ต้องการเปลี่ยน</Label>
              <Input
                type="select"
                name="status_change"
                onChange={onChange}
                innerRef={register}
              >
                {StatusChange.map((currentStatus, index) => (
                  <option
                    key={currentStatus.id}
                    name={currentStatus.name}
                    value={currentStatus.value}
                  >
                    {currentStatus.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <Button
              name="updateButton"
              disabled={disButton}
              color="dark"
              style={{ marginTop: "2rem" }}
              block
            >
              อัพเดตสถานะ
            </Button>
            <DarkBackground disappear={CheckLoadingOverlay === true}>
              <LoadingOverlay
                active={true}
                // spinner={<BounceLoader />}
                spinner={true}
                text="กำลังแก้ไขสถานะ โปรดรอสักครู่..."
              ></LoadingOverlay>
            </DarkBackground>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default withRouter(
  connect(null, {
    status_committee,
    status_admin,
    getemail_admin,
    sendLog,
    add_qa,
    loadingoverlay,
  })(UpdateStatusModal)
);
