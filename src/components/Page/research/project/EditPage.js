import React, { useState, useEffect, Fragment } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
} from "reactstrap";
import DateTimePicker from "react-datetime-picker";
import { withRouter } from "react-router-dom";
import { useForm } from "react-hook-form";
import LoadingOverlay from "react-loading-overlay";
import styled, { css } from "styled-components";
import UploadFilePDF from "../../../research/UploadFileModal";
// Page
import BackResearchPage from "../../../research/BackResearchPage";
// Action
import { project_uploadfile } from "../../../../actions/research/projectformAction";
import {
  newlist as sendList,
  loadingoverlay,
} from "../../../../actions/research/projecteditAction";
// Env
import { config } from "../../../../utilis/config";

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

const ProjectEditPage = (props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.main.auth.token);
  const detail = useSelector((state) => state.research.projectlist.detail);
  const { register, handleSubmit } = useForm();

  const [FullName, setFullName] = useState(null);
  // config
  const conResearch = config.connectResearchAPI;

  // Upload File
  // เก่า
  const [OldUpload, setOldUpload] = useState(null);
  const [OldUploadName, setOldUploadName] = useState(null);
  const [OldUploadPath, setOldUploadPath] = useState(null);
  // ใหม่
  const [LabelFile] = useState("Choose File");
  const [CheckFile, setCheckFile] = useState(false);
  // const [CheckFileCorrect, setCheckFileCorrect] = useState(false);
  const [, setCheckFileCorrect] = useState(false);
  const [mergeName, setMergeName] = useState(null);
  const [filePath, setfilePath] = useState(null);
  const [PDF, setPDF] = useState({
    preview: "",
    raw: "",
  });

  // หากมีข้อมูล ให้ใส่ข้อมูลลง redux
  useEffect(() => {
    if (detail) {
      if (detail[0].firstname && detail[0].lastname) {
        setFullName(detail[0].firstname + " " + detail[0].lastname);
      }
      if (detail[0].file_name) {
        setOldUpload(conResearch + "/" + detail[0].file_path);
        setOldUploadName(detail[0].file_name);
        setOldUploadPath(detail[0].file_path);
      }
    }
    // eslint-disable-next-line
  }, [detail]);

  // Button Open Old PDF
  const toggleOldPDF = () => {
    window.open(OldUpload);
  };

  const onChange = (e) => {};

  const onSubmit = async (e) => {};

  return (
    <Fragment>
      {detail ? (
        <Fragment>
          <Container>
            <BackResearchPage />
            <h4>หน้าฟอร์มแก้ไขโครงการวิจัย</h4>
            <br />
          </Container>
          <Container>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <p className="text-danger">
                  แก้ไขรายละเอียด ส่วนที่ต้องการแก้ไข หากส่วนไหนไม่ต้องการแก้ไข
                  ให้ปล่อยไว้ ระบบจะใช้ข้อมูลเดิม
                </p>
              </FormGroup>
              {detail[0].note ? (
                <Fragment>
                  <FormGroup>
                    <Label for="note">comment:</Label>
                    <Input
                      name="note"
                      defaultValue={detail[0].note}
                      readOnly
                    ></Input>
                  </FormGroup>
                </Fragment>
              ) : null}
              <FormGroup>
                <Label for="fullname">ผู้ส่ง:</Label>
                <Input name="fullname" defaultValue={FullName} readOnly></Input>
              </FormGroup>
              <FormGroup>
                <Label for="project_name">ชื่อโครงการ:</Label>
                <Input
                  name="project_name"
                  onChange={onChange}
                  innerRef={register}
                  defaultValue={detail[0].project_name}
                  required
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label for="project_type">ปรเภทของโครงการ:</Label>
                <Input
                  name="project_type"
                  onChange={onChange}
                  innerRef={register}
                  defaultValue={detail[0].project_type}
                  required
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label for="datetime">ระยะเวลาดำเนินโครงการ:</Label>
                <FormGroup>
                  <DateTimePicker
                    name="datetime"
                    onChange={onChange}
                    innerRef={register}
                    value={detail[0].datetime}
                    required
                  />
                </FormGroup>
              </FormGroup>
              <FormGroup tag="fieldset">
                <Label for="funds_type">แหล่งทุนวิจัย:</Label>
              </FormGroup>
              <FormGroup>
                <Label for="funds">จำนวนเงินทุน:</Label>
                <Input
                  type="number"
                  name="funds"
                  innerRef={onChange}
                  defaultValue={detail[0].funds}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="fileupload">ไฟล์รายละเอียดสัญญาทุน (PDF):</Label>{" "}
                {OldUpload ? (
                  <Fragment>
                    {" "}
                    <Button color="link" size="sm" onClick={toggleOldPDF}>
                      (ตรวจไฟล์ PDF เก่า)
                    </Button>
                  </Fragment>
                ) : null}
                <CustomInput
                  type="file"
                  id="fileupload"
                  name="fileupload"
                  label={LabelFile}
                  onChange={onChange}
                  accept="application/pdf"
                />
              </FormGroup>
            </Form>
          </Container>
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default withRouter(connect(null, null)(ProjectEditPage));
