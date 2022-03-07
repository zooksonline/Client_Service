import React, { Fragment, useState, useEffect } from "react";
import {
  Container,
  Form,
  FormGroup,
  CustomInput,
  Label,
  Input,
  Button,
} from "reactstrap";
import DateTimePicker from "react-datetime-picker";
import { connect, useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import LoadingOverlay from "react-loading-overlay";
import { withRouter } from "react-router-dom";
import moment from "moment-timezone";
//CSS
import styled, { css } from "styled-components";
import "../../../../utilis/research/style_formpage.css";

// Upload Action & Send Form Action
import {
  newlist as sendList,
  project_uploadfile,
  loadingoverlay,
} from "../../../../actions/research/projectformAction";

// log
import { newlog as sendLog } from "../../../../actions/research/projectlogAction";

// Get Admin E-Mail
import { getemail_admin } from "../../../../actions/research/projectemailAction";

// Page
import BackResearchPage from "../../../research/BackResearchPage";

// JSON
import fundJson from "../../../../utilis/research/project/type_fund.json";
import projectJson from "../../../../utilis/research/project/type_project.json";

// Loading BG
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

const ResearchProjectFormPage = (props) => {
  // Start Form
  const [start, setStart] = useState(true);

  const user = useSelector((state) => state.main.auth.user);
  const token = useSelector((state) => state.main.auth.token);
  const e_research = useSelector((state) => state.main.auth.service.e_research);
  const CheckLoadingOverlay = useSelector(
    (state) => state.research.projectform.loading_overlay
  );
  const [datetime, setdatetime] = useState(new Date());
  const { handleSubmit, register, watch } = useForm();

  // Trigger
  const emailSuccess = useSelector(
    (state) => state.research.projectform.email_success
  );
  const uploadSuccess = useSelector(
    (state) => state.research.projectform.upload_success
  );
  const log = useSelector((state) => state.research.projectform.log);

  const email_admin = useSelector(
    (state) => state.research.projectemail.email_admin
  );
  const [countEmail, setcountEmail] = useState(0);

  // Upload File
  const [LabelFile] = useState("Choose File");
  const [CheckFile, setCheckFile] = useState(false);
  const [, setCheckFileCorrect] = useState(false);
  const [mergeName, setMergeName] = useState(null);
  const [filePath, setfilePath] = useState(null);
  const [PDF, setPDF] = useState({
    preview: "",
    raw: "",
  });

  const dispatch = useDispatch();

  // propTypes
  ResearchProjectFormPage.propTypes = {
    loadingoverlay: PropTypes.func.isRequired,
    sendList: PropTypes.func.isRequired,
    sendLog: PropTypes.func.isRequired,
    project_uploadfile: PropTypes.func.isRequired,
    getemail_admin: PropTypes.func,
  };

  const {
    sendList,
    sendLog,
    project_uploadfile,
    getemail_admin,
    loadingoverlay,
  } = props;

  // Start FormPage /////////////////////
  useEffect(() => {
    if (start) {
      // Load E-mail
      if (e_research) {
        const get_email_admin = async () => {
          const Data = await {
            buasri_id: user.buasri_id,
            token,
          };
          // console.log(Data);
          await getemail_admin(Data);
        };
        get_email_admin();
      }
      setStart(false);
    }
    // eslint-disable-next-line
  }, [start]);

  // IF GET EMAIL COMMITTEE THEN COUNT EMAIL
  useEffect(() => {
    if (email_admin) {
      setcountEmail(email_admin.length);
    }
  }, [email_admin]);
  // useEffect(() => {
  //   if (start) {
  //     // dispatch({ type: "CLEAR_TAG" });
  //     // Load E-mail
  //     if (e_research) {
  //       const get_email_committee = async () => {
  //         const Department = await {
  //           token,
  //           dep: user.dep,
  //         };
  //         // console.log(Department);
  //         await getemail_committee(Department);
  //       };
  //       get_email_committee();
  //     }
  //     setStart(false);
  //   }
  //   // eslint-disable-next-line
  // }, [start]);

  // When Send Form Success
  // // From Research Form
  // useEffect(() => {
  //   if (emailSuccess && uploadSuccess && log) {
  //     const goMainResearchPage = async () => {
  //       await alert("ส่งงานวิจัยสำเร็จ");
  //       dispatch({ type: "PAGE_LOADING" });
  //       props.history.push("/research");
  //     };
  //     // alert("ส่งเมล์สำเร็จกลับไปหน้าหลัก");
  //     goMainResearchPage();
  //   }
  //   // eslint-disable-next-line
  // }, [emailSuccess, uploadSuccess, log]);

  useEffect(() => {
    if (emailSuccess && uploadSuccess && log) {
      const goMainResearchPage = async () => {
        await alert("ส่งโครงการสำเร็จ");
        dispatch({ type: "PAGE_LOADING" });
        props.history.push("/research");
      };
      // alert("ส่งเมล์สำเร็จกลับไปหน้าหลัก");
      goMainResearchPage();
    }
    // eslint-disable-next-line
  }, [emailSuccess]);
  ////////////////////////////////////////

  // Upload File ////////////////////////
  // MergeName
  useEffect(() => {
    const timenow = Date.now();
    const setPDFName = async () => {
      if ((await PDF.raw.type) === "application/pdf") {
        await setMergeName(timenow + ".pdf");
        await setCheckFileCorrect(true);
      } else {
        await setCheckFileCorrect(false);
      }
    };
    setPDFName();
    // eslint-disable-next-line
  }, [PDF]);

  // create name upload
  useEffect(() => {
    const setPDFPath = async () => {
      if (await mergeName) {
        await setfilePath(
          "uploads/0_project/" + user.buasri_id + "/" + mergeName
        );
      }
    };
    setPDFPath();
    // eslint-disable-next-line
  }, [mergeName]);

  ////////////////////////////////////////

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "fileupload") {
      if (e.target.files.length) {
        setCheckFile(true);
        setPDF({
          preview: URL.createObjectURL(e.target.files[0]),
          raw: e.target.files[0],
        });
      } else {
        setPDF({
          preview: "",
          raw: "",
        });
      }
    }
  };

  // Button ส่ง Form
  const onSubmit = async (e) => {
    async function upload() {
      if (CheckFile) {
        if (PDF) {
          if (PDF.raw.type === "application/pdf") {
            const NewUploadFile = new FormData();
            await NewUploadFile.append("file", PDF.raw, mergeName);
            await NewUploadFile.append("buasri_id", user.buasri_id);
            await NewUploadFile.append("filePath", filePath);

            const newList = await {
              token,
              data_email_admin: email_admin ? email_admin : undefined,
              count_email: countEmail ? countEmail : undefined,
              buasri_id: user.buasri_id,
              title_name: user.title,
              firstname: user.firstname,
              lastname: user.lastname,
              position: e_research ? e_research.position : undefined,
              email: user.email,
              project_name: e.project_name,
              funds_type: e.funds_type,
              funds: e.funds,
              project_type: e.project_type,
              datetime: datetime,
              file_name: mergeName && filePath ? mergeName : undefined,
              file_path: mergeName && filePath ? filePath : undefined,
              project_status: "WAITING",
            };
            // console.log(newList);

            const newLog = await {
              token,
              buasri_id: user.buasri_id,
              title_name: user.title,
              firstname: user.firstname,
              lastname: user.lastname,
              position: e_research ? e_research.position : undefined,
              email: user.email,
              project_name: e.project_name,
              funds_type: e.funds_type,
              funds: e.funds,
              project_type: e.project_type,
              datetime: datetime,
              file_name: mergeName && filePath ? mergeName : undefined,
              file_path: mergeName && filePath ? filePath : undefined,
              project_status: "WAITING",
            };

            await loadingoverlay();
            await sendList(newList);
            await sendLog(newLog);
            // console.log("upload: " + NewUploadFile);
            project_uploadfile(NewUploadFile, token);
          }
        }
      }
    }
    await upload();
  };
  return (
    <Fragment>
      {}
      <Container>
        <BackResearchPage />
        <h4>หน้าฟอร์มโครงการวิจัย</h4>
        <br />
      </Container>
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <p className="text-danger">
              โปรดกรอกข้อมูล และทบทวนข้อมูลให้ครบถ้วน ก่อนกดส่ง (ส่งได้เพียง 1
              ครั้ง/1 หัวเรื่องผลงานวิจัย) <br />
              หากสงสัยรายละเอียดในการกรอกข้อมูล ขอให้แจ้ง mail มาที่
              puenisara@g.swu.ac.th เพื่อรอคำแนะนำการดำเนินการต่อไป
              <br />
              ***กรณีที่ท่านมีการส่งข้อมูลผิดพลาด
              ให้เพิ่มแบบฟอร์มใหม่อีกครั้ง***
            </p>
          </FormGroup>
          <FormGroup>
            <Label for="project_name">ชื่อโครงการ:</Label>
            <Input
              type="text"
              name="project_name"
              innerRef={register}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="datetime">ระยะเวลาดำเนินโครงการ:</Label>
            <FormGroup>
              <DateTimePicker
                name="datetime"
                onChange={setdatetime}
                innerRef={register}
                value={datetime}
                required
              />
            </FormGroup>
          </FormGroup>
          <FormGroup tag="fieldset">
            <Label for="funds_type">แหล่งทุนวิจัย:</Label>
            {fundJson.map((fund) => (
              <FormGroup check key={fund.fundKey}>
                <Label check>
                  <Input
                    type="radio"
                    name="funds_type"
                    innerRef={register}
                    value={fund.fundKey}
                  ></Input>
                  {" " + fund.fundName}
                </Label>
              </FormGroup>
            ))}
          </FormGroup>
          <FormGroup>
            <Label for="funds">จำนวนเงินทุน:</Label>
            <Input type="number" name="funds" innerRef={register} required />
          </FormGroup>
          <FormGroup tag="fieldset">
            <Label for="project_type">ประเภทโครงการวิจัย:</Label>
            {projectJson.map((project) => (
              <FormGroup check key={project.projectKey}>
                <Label check>
                  <Input
                    type="radio"
                    name="project_type"
                    innerRef={register}
                    value={project.projectKey}
                  ></Input>
                  {" " + project.projectName}
                </Label>
              </FormGroup>
            ))}
          </FormGroup>

          <FormGroup>
            <Label for="fileupload">ไฟล์รายละเอียดสัญญาทุน (PDF):</Label>
            <CustomInput
              type="file"
              id="fileupload"
              name="fileupload"
              label={LabelFile}
              onChange={onChange}
              accept="application/pdf"
              required
            />
          </FormGroup>

          <FormGroup>
            <Button className="btn btn-dark" name="button">
              Submit
            </Button>
            <DarkBackground disappear={CheckLoadingOverlay === true}>
              <LoadingOverlay
                active={true}
                // spinner={<BounceLoader />}
                spinner={true}
                text="กำลังอัพโหลดไปยังฐานข้อมูล โปรดรอสักครู่..."
              ></LoadingOverlay>
            </DarkBackground>
          </FormGroup>
        </Form>
      </Container>
    </Fragment>
  );
};

export default withRouter(
  connect(null, {
    sendList,
    sendLog,
    project_uploadfile,
    getemail_admin,
    loadingoverlay,
  })(ResearchProjectFormPage)
);
