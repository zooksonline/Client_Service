import React, {
  Fragment,
  useState,
  // useMemo,
  useEffect,
  // createRef,
} from "react";
import {
  Container,
  Form,
  FormGroup,
  CustomInput,
  Label,
  Input,
  Button,
} from "reactstrap";
import { connect, useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import LoadingOverlay from "react-loading-overlay";

import UploadFilePDF from "../../research/UploadFileModal";
import Tags from "../../research/Tags";
import Student from "../../research/TagStudent";

import BackResearchPage from "../../research/BackResearchPage";
import { withRouter } from "react-router-dom";

//CSS
import styled, { css } from "styled-components";
import "../../../utilis/research/style_formpage.css";

// Upload Action & Send Form Action
import {
  loadingoverlay,
  uploadfile,
  newlist as sendList,
} from "../../../actions/research/formAction";

import { newlog as sendLog } from "../../../actions/research/logAction";

// Get E-mail Action
import { getemail_committee } from "../../../actions/research/emailAction";

// JSON
import articleJson from "../../../utilis/research/typearticle.json";
import levelJson from "../../../utilis/research/typelevel.json";
import patentJson from "../../../utilis/research/typepatent.json";
import pettypatentJson from "../../../utilis/research/typepettypatent.json";
import copyrightJson from "../../../utilis/research/typecopyright.json";
import countryLocJson from "../../../utilis/research/typecountry_loc.json";
import countryLocTHJson from "../../../utilis/research/typecountry_locTH.json";
import monthJson from "../../../utilis/research/typemonth.json";

import moment from "moment-timezone";

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

const ResearchFormPage = (props) => {
  const {
    handleSubmit,
    register,
    // watch
  } = useForm();
  const dispatch = useDispatch();

  // Start Form
  const [start, setStart] = useState(true);

  // Trigger
  const emailSuccess = useSelector(
    (state) => state.research.form.email_success
  );
  const uploadSuccess = useSelector(
    (state) => state.research.form.upload_success
  );

  // From Main
  const token = useSelector((state) => state.main.auth.token);
  const user = useSelector((state) => state.main.auth.user);
  const e_research = useSelector((state) => state.main.auth.service.e_research);
  const tagstate = useSelector((state) => state.research.form.tags);
  const studentstate = useSelector((state) => state.research.form.student);
  const CheckLoadingOverlay = useSelector(
    (state) => state.research.form.loading_overlay
  );
  const log = useSelector((state) => state.research.form.log);

  // From Email Reducer
  // get email
  const email_committee = useSelector(
    (state) => state.research.email.email_committee
  );
  const [countEmail, setcountEmail] = useState(0);
  // Value Level
  const [Level0, setLevel0] = useState([
    {
      sublevel_0_Key: "INTERNATIONAL",
      sublevel_0: "ระดับนานาชาติ",
    },
    {
      sublevel_0_Key: "COUNTRY",
      sublevel_0: "ระดับชาติ",
    },
  ]);
  const [Level1, setLevel1] = useState([
    {
      sublevel_1_Key: "",
      sublevel_1: "---โปรดเลือก---",
    },
    {
      sublevel_1_Key: "OCSC",
      sublevel_1: "อยู่ในเกณฑ์",
    },
    {
      sublevel_1_Key: "NON-OCSC",
      sublevel_1: "ไม่อยู่ในเกณฑ์",
    },
  ]);
  const [Level2, setLevel2] = useState([
    {
      sublevel_2_Key: "",
      sublevel_2: "---โปรดเลือก---",
    },
  ]);

  const [OpenSublv2, setOpenSublv2] = useState(false);
  const [OpenSubQuartile, setOpenSubQuartile] = useState(true);

  const [ConfName, setConfName] = useState(false);
  const [PatentName, setPatentName] = useState(false);
  const [PettyPatentName, setPettyPatentName] = useState(false);
  const [JournalName, setJournalName] = useState(false);
  const [CopyrightName, setCopyrightName] = useState(false);
  const fullyear = new Date().getFullYear();

  // Upload File
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

  // propTypes
  ResearchFormPage.propTypes = {
    loadingoverlay: PropTypes.func.isRequired,
    uploadfile: PropTypes.func.isRequired,
    sendList: PropTypes.func.isRequired,
    getemail_committee: PropTypes.func.isRequired,
    sendLog: PropTypes.func.isRequired,
  };

  const { loadingoverlay, uploadfile, sendList, getemail_committee, sendLog } =
    props;

  /* ******************************************************** */
  // สำหรับ Country and Local เท่านั้น
  const [{ conf_country, conf_local }, setDataCountryLoc] = React.useState({
    country: "",
    state: "",
  });

  const DataCountryLoc = { conf_country, conf_local };

  //สร้างตัวแปร map กับ JSONFILE ของตัว country
  const countries = countryLocJson.map((item) => (
    <option key={item.name} value={item.name}>
      {item.name}
    </option>
  ));
  const countriesTH = countryLocTHJson.map((item) => (
    <option key={item.name} value={item.name}>
      {item.name}
    </option>
  ));
  //สร้างตัวแปร map กับ JSONFILE ของตัว state
  const states = countryLocJson
    .find((item) => item.name === conf_country)
    ?.states.map((state) => (
      <option key={state} value={state}>
        {state}
      </option>
    ));

  const statesTH = countryLocJson
    .find((item) => item.name === "Thailand")
    ?.states.map((state) => (
      <option key={state} value={state}>
        {state}
      </option>
    ));

  //รับ event ไปแสดงผลในvalue ของตัวแปร conf_country
  function handleCountryChange(event) {
    //setData(({ state: '', conf_country: event.target.value }));
    setDataCountryLoc({ ...DataCountryLoc, conf_country: event.target.value });
  }
  //รับ event ไปแสดงผลในvalue ของตัวแปร conf_state
  function handleStateChange(event) {
    setDataCountryLoc({ ...DataCountryLoc, conf_local: event.target.value });
  }
  /* ******************************************************** */

  // Start FormPage
  useEffect(() => {
    if (start) {
      // dispatch({ type: "CLEAR_TAG" });
      // Load E-mail
      if (e_research) {
        const get_email_committee = async () => {
          const Department = await {
            token,
            dep: user.dep,
          };
          // console.log(Department);
          await getemail_committee(Department);
        };
        get_email_committee();
      }
      setStart(false);
    }
    // eslint-disable-next-line
  }, [start]);

  // When Send Form Success
  useEffect(() => {
    if (emailSuccess && uploadSuccess && log) {
      const goMainResearchPage = async () => {
        await alert("ส่งงานวิจัยสำเร็จ");
        dispatch({ type: "PAGE_LOADING" });
        props.history.push("/research");
      };
      // alert("ส่งเมล์สำเร็จกลับไปหน้าหลัก");
      goMainResearchPage();
    }
    // eslint-disable-next-line
  }, [emailSuccess, uploadSuccess, log]);

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
        await setfilePath("/uploads/" + user.buasri_id + "/" + mergeName);
      }
    };
    setPDFPath();
    // eslint-disable-next-line
  }, [mergeName]);

  // IF GET EMAIL COMMITTEE THEN COUNT EMAIL
  useEffect(() => {
    if (email_committee) {
      setcountEmail(email_committee.length);
    }
  }, [email_committee]);

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
    // check radio
    if (name === "article") {
      if (value === "CONFERENCE") {
        setConfName(true);
        setPatentName(false);
        setPettyPatentName(false);
        setJournalName(false);
        setCopyrightName(false);
      } else if (value === "PATENT") {
        setConfName(false);
        setPatentName(true);
        setPettyPatentName(false);
        setJournalName(false);
        setCopyrightName(false);
      } else if (value === "PETTY-PATENT") {
        setConfName(false);
        setPatentName(false);
        setPettyPatentName(true);
        setJournalName(false);
        setCopyrightName(false);
      } else if (value === "COPYRIGHT") {
        setConfName(false);
        setPatentName(false);
        setPettyPatentName(false);
        setJournalName(false);
        setCopyrightName(true);
      } else {
        setConfName(false);
        setPatentName(false);
        setPettyPatentName(false);
        setJournalName(true);
        setCopyrightName(false);
      }
    }

    // check ระดับงานวิจัย
    if (name === "level") {
      setLevel0(value);
      if (value === "INTERNATIONAL" && Level1) {
        setLevel2([
          { sublevel_2_Key: "", sublevel_2: "---โปรดเลือก---" },
          { sublevel_2_Key: "SCOPUS", sublevel_2: "Scopus" },
          { sublevel_2_Key: "WEB-OF-SCIENCE", sublevel_2: "lsi" },
          { sublevel_2_Key: "Eric", sublevel_2: "ERIC" },
          { sublevel_2_Key: "MathSciNet", sublevel_2: "MathSciNet" },
          { sublevel_2_Key: "Pubmed", sublevel_2: "Pubmed" },
          { sublevel_2_Key: "JSTOR", sublevel_2: "JSTOR" },
          { sublevel_2_Key: "Project Muse", sublevel_2: "Project Muse" },
        ]);
        setOpenSublv2(true);
        setOpenSubQuartile(true);
      } else if (value === "COUNTRY" && Level1) {
        setLevel2([
          { sublevel_2_Key: "", sublevel_2: "---โปรดเลือก---" },
          { sublevel_2_Key: "TCI-TYPE-1", sublevel_2: "TCI กลุ่ม 1" },
          { sublevel_2_Key: "TCI-TYPE-2", sublevel_2: "TCI กลุ่ม 2" },
          {
            sublevel_2_Key: "TCI-TYPE-3",
            sublevel_2: "TCI อื่น ๆ หรือระบุไม่ได้",
          },
        ]);
        setOpenSublv2(true);
        setOpenSubQuartile(true);
      } else {
        setLevel2([
          {
            sublevel_2_Key: "",
            sublevel_2: "---โปรดเลือก---",
          },
        ]);
        setOpenSublv2(false);
      }
    }
    if (name === "sub_level_1") {
      setLevel1(value);
      if (value === "NON-OCSC") {
        setLevel2([
          { sublevel_2_Key: "NON-DB", sublevel_2: "ไม่อยู่ในฐานข้อมูล" },
        ]);
      } else {
        if (Level0 === "INTERNATIONAL") {
          setLevel2([
            { sublevel_2_Key: "", sublevel_2: "---โปรดเลือก---" },
            { sublevel_2_Key: "SCOPUS", sublevel_2: "Scopus" },
            { sublevel_2_Key: "WEB-OF-SCIENCE", sublevel_2: "lsi" },
            { sublevel_2_Key: "Eric", sublevel_2: "ERIC" },
            { sublevel_2_Key: "MathSciNet", sublevel_2: "MathSciNet" },
            { sublevel_2_Key: "Pubmed", sublevel_2: "Pubmed" },
            { sublevel_2_Key: "JSTOR", sublevel_2: "JSTOR" },
            { sublevel_2_Key: "Project Muse", sublevel_2: "Project Muse" },
          ]);
        } else if (Level0 === "COUNTRY") {
          setLevel2([
            { sublevel_2_Key: "", sublevel_2: "---โปรดเลือก---" },
            { sublevel_2_Key: "TCI-TYPE-1", sublevel_2: "TCI กลุ่ม 1" },
            { sublevel_2_Key: "TCI-TYPE-2", sublevel_2: "TCI กลุ่ม 2" },
            {
              sublevel_2_Key: "TCI-TYPE-3",
              sublevel_2: "TCI อื่น ๆ หรือระบุไม่ได้",
            },
          ]);
        }
      }
    }
  };

  const date = useSelector((state) => state.research.button.date);
  // const [count, setCount] = React.useState(0);

  useEffect(() => {
    if (date) {
      if (date[0].datetime) {
        const currentDate = moment()._d;
        const currentDateUnix = Date.parse(currentDate);
        const deadlineUnix = Date.parse(date[0].datetime);
        if (deadlineUnix < currentDateUnix) {
          alert("หมดเวลาการเพิ่มแบบฟอร์ม");
          dispatch({ type: "PAGE_LOADING" });
          props.history.push("/research");
        }
      }
    }
    // eslint-disable-next-line
  }, [date]);

  // const tick = () => {
  //   //let newCount = count < 60 ? count + 1 : 0
  //   setCount((prevState) => (prevState < 1 ? prevState + 1 : 0));
  // };

  // useEffect(() => {
  //   const timer = setInterval(() => tick(), 1000);
  //   return () => clearInterval(timer);
  // });

  const onSubmit = async (e) => {
    // console.log("Level0: " + e.level);
    // console.log("Level1: " + e.sub_level_1);
    // console.log("Level2: " + e.sub_level_2);

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
              data_email: email_committee,
              count_email: countEmail,
              year: fullyear,
              buasri_id: user.buasri_id,
              title_name: user.title,
              firstname: user.firstname,
              lastname: user.lastname,
              position: e_research ? e_research.position : undefined,
              email: user.email,
              article: e.article,
              type_name: PatentName
                ? e.type_name
                : PettyPatentName
                ? e.type_name
                : CopyrightName
                ? e.type_name
                : undefined,
              request_number: PatentName
                ? e.request_number
                : PettyPatentName
                ? e.request_number
                : CopyrightName
                ? e.request_number
                : undefined,
              register_number: PatentName
                ? e.register_number
                : PettyPatentName
                ? e.register_number
                : CopyrightName
                ? e.register_number
                : undefined,
              journal_name: JournalName ? e.journal_name : undefined,
              level: e.level,
              sub_level_1: e.sub_level_1,
              sub_level_2: e.sub_level_2,
              conf_year: e.year,
              conf_month: e.month,
              quartile: e.quartile,
              conference_name: ConfName ? e.conf_name : undefined,
              conference_name_th: ConfName ? e.conf_name_th : undefined,
              conf_country: ConfName ? e.conf_country : undefined,
              conf_local: ConfName ? e.conf_local : undefined,
              author: e.author,
              name: e.name,
              name_th: e.name_th ? e.name_th : undefined,
              tags: tagstate ? tagstate : undefined,
              student: studentstate ? studentstate : undefined,
              status: "WAITING",
              file_name: mergeName && filePath ? mergeName : undefined,
              file_path: mergeName && filePath ? filePath : undefined,
            };

            const newLog = await {
              token,
              year: fullyear,
              buasri_id: user.buasri_id,
              firstname: user.firstname,
              lastname: user.lastname,
              article: e.article,
              type_name: PatentName
                ? e.type_name
                : PettyPatentName
                ? e.type_name
                : CopyrightName
                ? e.type_name
                : undefined,
              request_number: PatentName
                ? e.request_number
                : PettyPatentName
                ? e.request_number
                : CopyrightName
                ? e.request_number
                : undefined,
              register_number: PatentName
                ? e.register_number
                : PettyPatentName
                ? e.register_number
                : CopyrightName
                ? e.register_number
                : undefined,
              journal_name: JournalName ? e.journal_name : undefined,
              level: e.level,
              sub_level_1: e.sub_level_1,
              sub_level_2: e.sub_level_2,
              research_year: e.year,
              quartile: e.quartile,
              conference_month: e.month,
              conference_name: e.conf_name,
              conference_name_th: e.conf_name_th,
              conference_country: e.conf_country,
              conference_local: e.conf_local,
              author: e.author,
              name: e.name,
              name_th: e.name_th ? e.name_th : undefined,
              tags: tagstate ? tagstate : undefined,
              student: studentstate ? studentstate : undefined,
              status: "WAITING",
              file_name: mergeName && filePath ? mergeName : undefined,
              file_path: mergeName && filePath ? filePath : undefined,
            };

            await loadingoverlay();
            // await console.log(...NewUploadFile);
            // ส่งไฟล์ Upload
            console.log("test " + JSON.stringify(newList));
            await uploadfile(NewUploadFile, token);
            await sendList(newList);
            await sendLog(newLog);
          } else {
            await alert("ประเภทไฟล์ของคุณไม่ถูกต้อง");
            await dispatch({ type: "CLOSE_OVERLAY" });
          }
        }
      }
    }
    await upload();
    // console.log(newList);
  };

  return (
    <Fragment>
      {}
      <Container>
        <BackResearchPage />
        <h4>
          <b>แบบฟอร์มเพิ่มงานวิจัย</b>
        </h4>
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
          <FormGroup tag="fieldset">
            <Label for="article">*ประเภทการเผยแพร่บทความวิจัย:</Label>
            {articleJson.map((article) => (
              <FormGroup check key={article.articleKey}>
                <Label check>
                  <Input
                    type="radio"
                    name="article"
                    innerRef={register}
                    value={article.articleKey}
                    onChange={onChange}
                    required
                  />
                  {" " + article.article}
                </Label>
              </FormGroup>
            ))}
          </FormGroup>
          {PatentName ? (
            <Fragment>
              <FormGroup>
                <Label for="type_name">*กลุ่มงานของสิทธิบัตร:</Label>
                <Input
                  type="select"
                  name="type_name"
                  innerRef={register}
                  onChange={onChange}
                  required
                >
                  <option value="">---โปรดเลือก---</option>
                  {patentJson.map((patent) => (
                    <option key={patent.No} value={patent.Value}>
                      {patent.Name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="request_number">*เลขคำขอสิทธิบัตร</Label>
                <Input
                  type="text"
                  name="request_number"
                  innerRef={register}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="register_number">เลขที่ประกาศ/เลขที่ทะเบียน</Label>
                <Input type="text" name="register_number" innerRef={register} />
              </FormGroup>
            </Fragment>
          ) : PettyPatentName ? (
            <Fragment>
              <FormGroup>
                <Label for="type_name">*กลุ่มงานของอนุสิทธิบัตร:</Label>
                <Input
                  type="select"
                  name="type_name"
                  innerRef={register}
                  onChange={onChange}
                  required
                >
                  <option value="">---โปรดเลือก---</option>
                  {pettypatentJson.map((petty) => (
                    <option key={petty.No} value={petty.Value}>
                      {petty.Name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="request_number">*เลขคำขอสิทธิบัตร</Label>
                <Input
                  type="text"
                  name="request_number"
                  innerRef={register}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="register_number">เลขที่ประกาศ/เลขที่ทะเบียน</Label>
                <Input type="text" name="register_number" innerRef={register} />
              </FormGroup>
            </Fragment>
          ) : JournalName ? (
            <Fragment>
              <FormGroup>
                <Label for="journal_name">*ชื่อวารสาร</Label>
                <Input
                  type="text"
                  name="journal_name"
                  innerRef={register}
                  required
                />
              </FormGroup>
            </Fragment>
          ) : CopyrightName ? (
            <Fragment>
              <FormGroup>
                <Label for="type_name">*กลุ่มงานของลิขสิทธิ์:</Label>
                <Input
                  type="select"
                  name="type_name"
                  innerRef={register}
                  onChange={onChange}
                  required
                >
                  <option value="">---โปรดเลือก---</option>
                  {copyrightJson.map((copyright) => (
                    <option key={copyright.No} value={copyright.Value}>
                      {copyright.Name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="request_number">*เลขคำขอลิขสิทธิ์</Label>
                <Input
                  type="text"
                  name="request_number"
                  innerRef={register}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="register_number">เลขที่ประกาศ/เลขที่ทะเบียน</Label>
                <Input type="text" name="register_number" innerRef={register} />
              </FormGroup>
            </Fragment>
          ) : null}
          {ConfName || JournalName ? (
            <FormGroup>
              <Label for="level">*ระดับการนำเสนอบทความวิจัย</Label>
              <Input
                type="select"
                name="level"
                innerRef={register}
                onChange={onChange}
                required
              >
                <option value="">---โปรดเลือก---</option>
                {levelJson.map((level) => (
                  <option value={level.levelKey} key={level.levelKey}>
                    {level.level}
                  </option>
                ))}
              </Input>
            </FormGroup>
          ) : PatentName ? (
            <FormGroup>
              <Label for="level">*ระดับการยื่นขอจดสิทธิบัตร</Label>
              <Input
                type="select"
                name="level"
                innerRef={register}
                onChange={onChange}
                required
              >
                <option value="">---โปรดเลือก---</option>
                {levelJson.map((level) => (
                  <option value={level.levelKey} key={level.levelKey}>
                    {level.level}
                  </option>
                ))}
              </Input>
            </FormGroup>
          ) : PettyPatentName ? (
            <FormGroup>
              <Label for="level">*ระดับการยื่นขอจดอนุสิทธิบัตร</Label>
              <Input
                type="select"
                name="level"
                innerRef={register}
                onChange={onChange}
                required
              >
                <option value="">---โปรดเลือก---</option>
                {levelJson.map((level) => (
                  <option value={level.levelKey} key={level.levelKey}>
                    {level.level}
                  </option>
                ))}
              </Input>
            </FormGroup>
          ) : CopyrightName ? (
            <Fragment>
              <FormGroup>
                <Label for="level">*ระดับการยื่นขอจดลิขสิทธิ์</Label>
                <Input
                  type="select"
                  name="level"
                  innerRef={register}
                  onChange={onChange}
                  required
                >
                  <option value="">---โปรดเลือก---</option>
                  {levelJson.map((level) => (
                    <option value={level.levelKey} key={level.levelKey}>
                      {level.level}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Fragment>
          ) : null}

          {OpenSublv2 ? (
            <Fragment>
              {ConfName || JournalName ? (
                <FormGroup>
                  <Label for="sub_level_1">
                    *ระดับคุณภาพบทความวิจัยวิชาการ
                  </Label>
                  <Input
                    type="select"
                    name="sub_level_1"
                    innerRef={register}
                    onChange={onChange}
                    required
                  >
                    <option value="">---โปรดเลือก---</option>
                    <option value="OCSC">อยู่ในเกณฑ์</option>
                    <option value="NON-OCSC">ไม่อยู่ในเกณฑ์</option>
                  </Input>
                </FormGroup>
              ) : PatentName ? (
                <FormGroup>
                  <Label for="sub_level_1">
                    *ระดับคุณภาพการยื่นขอจดสิทธิบัตร
                  </Label>
                  <Input
                    type="select"
                    name="sub_level_1"
                    innerRef={register}
                    onChange={onChange}
                    disabled
                    required
                  >
                    <option value="">
                      ไม่สามารถระบุระดับคุณภาพการยื่นขอจดสิทธิบัตร
                    </option>
                  </Input>
                  <Input
                    type="hidden"
                    name="sub_level_1"
                    innerRef={register}
                    onChange={onChange}
                    required
                  >
                    <option value="">
                      ไม่สามารถระบุระดับคุณภาพการยื่นขอจดสิทธิบัตร
                    </option>
                  </Input>
                </FormGroup>
              ) : PettyPatentName ? (
                <FormGroup>
                  <Label for="sub_level_1">
                    *ระดับคุณภาพการยื่นขอจดอนุสิทธิบัตร
                  </Label>
                  <Input
                    type="select"
                    name="sub_level_1"
                    innerRef={register}
                    onChange={onChange}
                    disabled
                    required
                  >
                    <option value="">
                      ไม่สามารถระบุระดับคุณภาพการยื่นขอจดสิทธิบัตร
                    </option>
                  </Input>
                  <Input
                    type="hidden"
                    name="sub_level_1"
                    innerRef={register}
                    onChange={onChange}
                    required
                  >
                    <option value="">
                      ไม่สามารถระบุระดับคุณภาพการยื่นขอจดสิทธิบัตร
                    </option>
                  </Input>
                </FormGroup>
              ) : CopyrightName ? (
                <Fragment>
                  <FormGroup>
                    <Label for="sub_level_1">
                      *ระดับคุณภาพการยื่นขอจดลิขสิทธิ์
                    </Label>
                    <Input
                      type="select"
                      name="sub_level_1"
                      innerRef={register}
                      onChange={onChange}
                      disabled
                      required
                    >
                      <option value="">
                        ไม่สามารถระบุระดับคุณภาพการจดยื่นขอลิขสิทธิ์
                      </option>
                    </Input>
                    <Input
                      type="hidden"
                      name="sub_level_1"
                      innerRef={register}
                      onChange={onChange}
                      required
                    >
                      <option value="">
                        ไม่สามารถระบุระดับคุณภาพการจดยื่นขอลิขสิทธิ์
                      </option>
                    </Input>
                  </FormGroup>
                </Fragment>
              ) : null}
              {ConfName || JournalName ? (
                <FormGroup>
                  <Label for="sub_level_2">
                    *ฐานข้อมูลที่เผยแพร่บทความวิจัย
                  </Label>
                  <Input
                    type="select"
                    name="sub_level_2"
                    innerRef={register}
                    required
                  >
                    {Level2.map((sublevel_2) => (
                      <option
                        key={sublevel_2.sublevel_2_Key}
                        value={sublevel_2.sublevel_2_Key}
                      >
                        {sublevel_2.sublevel_2}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              ) : PatentName ? (
                <FormGroup>
                  <Label for="sub_level_2">
                    *ฐานข้อมูลที่ยื่นขอจดสิทธิบัตร
                  </Label>
                  <Input
                    type="select"
                    name="sub_level_2"
                    innerRef={register}
                    disabled
                    required
                  >
                    <option value="">
                      ไม่สามารถระบุฐานข้อมูลที่ยื่นขอจดสิทธิบัตร
                    </option>
                  </Input>
                  <Input
                    type="hidden"
                    name="sub_level_2"
                    innerRef={register}
                    required
                  >
                    <option value="">
                      ไม่สามารถระบุฐานข้อมูลที่ยื่นขอจดสิทธิบัตร
                    </option>
                  </Input>
                </FormGroup>
              ) : PettyPatentName ? (
                <FormGroup>
                  <Label for="sub_level_2">
                    *ฐานข้อมูลที่ยื่นขอจดอนุสิทธิบัตร
                  </Label>
                  <Input
                    type="select"
                    name="sub_level_2"
                    innerRef={register}
                    disabled
                    required
                  >
                    <option value="">
                      ไม่สามารถระบุฐานข้อมูลที่ยื่นขอจดอนุสิทธิบัตร
                    </option>
                  </Input>
                  <Input
                    type="hidden"
                    name="sub_level_2"
                    innerRef={register}
                    required
                  >
                    <option value="">
                      ไม่สามารถระบุฐานข้อมูลที่ยื่นขอจดอนุสิทธิบัตร
                    </option>
                  </Input>
                </FormGroup>
              ) : CopyrightName ? (
                <Fragment>
                  <FormGroup>
                    <Label for="sub_level_2">
                      *ฐานข้อมูลที่ยื่นขอจดลิขสิทธิ์
                    </Label>
                    <Input
                      type="select"
                      name="sub_level_2"
                      innerRef={register}
                      disabled
                      required
                    >
                      <option value="">
                        ไม่สามารถระบุฐานข้อมูลที่ยื่นขอจดลิขสิทธิ์
                      </option>
                    </Input>
                    <Input
                      type="hidden"
                      name="sub_level_2"
                      innerRef={register}
                      required
                    >
                      <option value="">
                        ไม่สามารถระบุฐานข้อมูลที่ยื่นขอจดลิขสิทธิ์
                      </option>
                    </Input>
                  </FormGroup>
                </Fragment>
              ) : null}
            </Fragment>
          ) : null}
          {ConfName || JournalName ? (
            <FormGroup>
              <Label for="year">*ปีที่เผยแพร่บทความวิจัย</Label>
              <Input
                type="select"
                name="year"
                innerRef={register}
                defaultValue={fullyear}
                required
              >
                <option value={fullyear + 1}>{fullyear + 1}</option>
                {Array.from(new Array(2), (v, i) => (
                  <option key={i} value={fullyear - i}>
                    {fullyear - i}
                  </option>
                ))}
              </Input>
            </FormGroup>
          ) : PatentName ? (
            <FormGroup>
              <Label for="year">*ปีที่ยื่นขอจดสิทธิบัตร</Label>
              <Input
                type="select"
                name="year"
                innerRef={register}
                defaultValue={fullyear}
                required
              >
                <option value={fullyear + 1}>{fullyear + 1}</option>
                {Array.from(new Array(2), (v, i) => (
                  <option key={i} value={fullyear - i}>
                    {fullyear - i}
                  </option>
                ))}
              </Input>
            </FormGroup>
          ) : PettyPatentName ? (
            <FormGroup>
              <Label for="year">*ปีที่ยื่นขอจดอนุสิทธิบัตร</Label>
              <Input
                type="select"
                name="year"
                innerRef={register}
                defaultValue={fullyear}
                required
              >
                <option value={fullyear + 1}>{fullyear + 1}</option>
                {Array.from(new Array(2), (v, i) => (
                  <option key={i} value={fullyear - i}>
                    {fullyear - i}
                  </option>
                ))}
              </Input>
            </FormGroup>
          ) : CopyrightName ? (
            <Fragment>
              <FormGroup>
                <Label for="year">*ปีที่ยื่นขอจดลิขสิทธิ์</Label>
                <Input
                  type="select"
                  name="year"
                  innerRef={register}
                  defaultValue={fullyear}
                  required
                >
                  <option value={fullyear + 1}>{fullyear + 1}</option>
                  {Array.from(new Array(2), (v, i) => (
                    <option key={i} value={fullyear - i}>
                      {fullyear - i}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Fragment>
          ) : null}

          {ConfName ? (
            <Fragment>
              <FormGroup>
                <Label for="month">*เดือนที่เผยแพร่บทความวิจัย</Label>
                <Input type="select" name="month" innerRef={register} required>
                  {monthJson.map((level) => (
                    <option value={level.levelKey} key={level.levelKey}>
                      {level.level}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Fragment>
          ) : null}
          {OpenSubQuartile ? (
            <Fragment>
              {ConfName && Level0 === "COUNTRY" ? (
                <FormGroup>
                  <Label for="quartile">
                    *ระดับ Quartile ของบทความวิจัยที่เผยแพร่
                  </Label>
                  <Input
                    type="select"
                    name="quartile"
                    innerRef={register}
                    disabled
                    required
                  >
                    <option value="">ไม่สามารถระบุ Quartile ได้</option>
                  </Input>
                  <Input
                    type="hidden"
                    name="quartile"
                    innerRef={register}
                    required
                  >
                    <option value="">ไม่สามารถระบุ Quartile ได้</option>
                  </Input>
                </FormGroup>
              ) : ConfName && Level0 === "INTERNATIONAL" ? (
                <FormGroup>
                  <Label for="quartile">
                    *ระดับ Quartile ของบทความวิจัยที่เผยแพร่
                  </Label>
                  <Input
                    type="select"
                    name="quartile"
                    innerRef={register}
                    required
                  >
                    <option value="">---โปรดเลือก---</option>
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                    <option value="">ไม่สามารถระบุ Quartile ได้</option>
                  </Input>
                </FormGroup>
              ) : JournalName && Level0 === "INTERNATIONAL" ? (
                <FormGroup>
                  <Label for="quartile">
                    *ระดับ Quartile ของบทความวิจัยที่เผยแพร่
                  </Label>
                  <Input
                    type="select"
                    name="quartile"
                    innerRef={register}
                    required
                  >
                    <option value="">---โปรดเลือก---</option>
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                    <option value="">ไม่สามารถระบุ Quartile ได้</option>
                  </Input>
                </FormGroup>
              ) : JournalName && Level0 === "COUNTRY" ? (
                <FormGroup>
                  <Label for="quartile">
                    *ระดับ Quartile ของบทความวิจัยที่เผยแพร่
                  </Label>
                  <Input
                    type="select"
                    name="quartile"
                    innerRef={register}
                    disabled
                    required
                  >
                    <option value="">ไม่สามารถระบุ Quartile ได้</option>
                  </Input>
                  <Input
                    type="hidden"
                    name="quartile"
                    innerRef={register}
                    required
                  >
                    <option value="">ไม่สามารถระบุ Quartile ได้</option>
                  </Input>
                </FormGroup>
              ) : PatentName ? (
                <FormGroup>
                  <Label for="quartile">
                    *ระดับ Quartile ที่ยื่นขอจดสิทธิบัตร
                  </Label>
                  <Input
                    type="select"
                    name="quartile"
                    innerRef={register}
                    disabled
                    required
                  >
                    <option value="">ไม่สามารถระบุ Quartile ได้</option>
                  </Input>
                  <Input
                    type="hidden"
                    name="quartile"
                    innerRef={register}
                    required
                  >
                    <option value="">ไม่สามารถระบุ Quartile ได้</option>
                  </Input>
                </FormGroup>
              ) : PettyPatentName ? (
                <FormGroup>
                  <Label for="quartile">
                    *ระดับ Quartile ที่ยื่นขอจดอนุสิทธิบัตร
                  </Label>
                  <Input
                    type="select"
                    name="quartile"
                    innerRef={register}
                    disabled
                    required
                  >
                    <option value="">ไม่สามารถระบุ Quartile ได้</option>
                  </Input>
                  <Input
                    type="hidden"
                    name="quartile"
                    innerRef={register}
                    required
                  >
                    <option value="">ไม่สามารถระบุ Quartile ได้</option>
                  </Input>
                </FormGroup>
              ) : CopyrightName ? (
                <Fragment>
                  <FormGroup>
                    <Label for="quartile">
                      *ระดับ Quartile ที่ยื่นขอจดลิขสิทธิ์
                    </Label>
                    <Input
                      type="select"
                      name="quartile"
                      innerRef={register}
                      disabled
                      required
                    >
                      <option value="">ไม่สามารถระบุ Quartile ได้</option>
                    </Input>
                    <Input
                      type="hidden"
                      name="quartile"
                      innerRef={register}
                      required
                    >
                      <option value="">ไม่สามารถระบุ Quartile ได้</option>
                    </Input>
                  </FormGroup>
                </Fragment>
              ) : null}
            </Fragment>
          ) : null}
          {ConfName || JournalName ? (
            <FormGroup tag="fieldset">
              <Label for="author">*บทบาทของผู้นิพนธ์บทความวิจัย</Label>
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="author"
                    innerRef={register}
                    value="FIRST-AUTHOR"
                    required
                  />{" "}
                  ผู้นิพนธ์ชื่อแรก (First Author)
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="author"
                    innerRef={register}
                    value="AUTHOR"
                    required
                  />{" "}
                  ผู้นิพนธ์หลัก (Corresponding Author)
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="author"
                    innerRef={register}
                    value="FIRST-AUTHOR-AND-AUTHOR"
                    required
                  />{" "}
                  ผู้นิพนธ์ชื่อแรก (First Author) & ผู้นิพนธ์หลัก (Corresponding
                  Author)
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="author"
                    innerRef={register}
                    value="CO-AUTHOR"
                    required
                  />{" "}
                  ผู้นิพนธ์ร่วม (Co-Author)
                </Label>
              </FormGroup>
            </FormGroup>
          ) : PatentName ? (
            <FormGroup tag="fieldset">
              <Label for="author">*บทบาทของผู้ยื่นขอจดสิทธิบัตร</Label>
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="author"
                    innerRef={register}
                    value="AUTHOR"
                    required
                  />{" "}
                  ผู้ยื่นขอจดสิทธิบัตร
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="author"
                    innerRef={register}
                    value="CO-AUTHOR"
                    required
                  />{" "}
                  ผู้ร่วมขอจดสิทธิบัตร
                </Label>
              </FormGroup>
            </FormGroup>
          ) : PettyPatentName ? (
            <FormGroup tag="fieldset">
              <Label for="author">*บทบาทของผู้ยื่นขอจดอนุสิทธิบัตร</Label>
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="author"
                    innerRef={register}
                    value="AUTHOR"
                    required
                  />{" "}
                  ผู้ยื่นขอจดอนุสิทธิบัตร
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="author"
                    innerRef={register}
                    value="CO-AUTHOR"
                    required
                  />{" "}
                  ผู้ร่วมขอจดอนุสิทธิบัตร
                </Label>
              </FormGroup>
            </FormGroup>
          ) : CopyrightName ? (
            <FormGroup tag="fieldset">
              <Label for="author">*บทบาทของผู้ยื่นขอจดลิขสิทธิ์</Label>
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="author"
                    innerRef={register}
                    value="AUTHOR"
                    required
                  />{" "}
                  ผู้ยื่นขอจดลิขสิทธิ์
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="author"
                    innerRef={register}
                    value="CO-AUTHOR"
                    required
                  />{" "}
                  ผู้ร่วมขอจดลิขสิทธิ์
                </Label>
              </FormGroup>
            </FormGroup>
          ) : null}
          {ConfName || JournalName ? (
            <Fragment>
              <FormGroup>
                <Label for="name">
                  *ชื่อบทความวิจัย (ภาษาอังกฤษ หากไม่มีให้ใส่ภาษาไทย)
                </Label>
                <Input type="text" name="name" innerRef={register} required />
              </FormGroup>
              <FormGroup>
                <Label for="name_th">ชื่อบทความวิจัย (ภาษาไทย)</Label>
                <Input type="text" name="name_th" innerRef={register} />
              </FormGroup>
            </Fragment>
          ) : PatentName ? (
            <Fragment>
              <FormGroup>
                <Label for="name">
                  *ชื่อหัวเรื่องที่ยื่นคำขอจดสิทธิบัตร (ภาษาอังกฤษ
                  หากไม่มีให้ใส่ภาษาไทย)
                </Label>
                <Input type="text" name="name" innerRef={register} required />
              </FormGroup>
              <FormGroup>
                <Label for="name_th">
                  ชื่อหัวเรื่องที่ยื่นคำขอจดสิทธิบัตร (ภาษาไทย)
                </Label>
                <Input type="text" name="name_th" innerRef={register} />
              </FormGroup>
            </Fragment>
          ) : PettyPatentName ? (
            <Fragment>
              <FormGroup>
                <Label for="name">
                  *ชื่อหัวเรื่องที่ยื่นคำขอจดอนุสิทธิบัตร (ภาษาอังกฤษ
                  หากไม่มีให้ใส่ภาษาไทย)
                </Label>
                <Input type="text" name="name" innerRef={register} required />
              </FormGroup>
              <FormGroup>
                <Label for="name_th">
                  ชื่อหัวเรื่องที่ยื่นคำขอจดอนุสิทธิบัตร (ภาษาไทย)
                </Label>
                <Input type="text" name="name_th" innerRef={register} />
              </FormGroup>
            </Fragment>
          ) : CopyrightName ? (
            <Fragment>
              <FormGroup>
                <Label for="name">
                  *ชื่อหัวเรื่องที่ยื่นคำขอจดลิขสิทธิ์ (ภาษาอังกฤษ
                  หากไม่มีให้ใส่ภาษาไทย)
                </Label>
                <Input type="text" name="name" innerRef={register} required />
              </FormGroup>
              <FormGroup>
                <Label for="name_th">
                  ชื่อหัวเรื่องที่ยื่นคำขอจดลิขสิทธิ์ (ภาษาไทย)
                </Label>
                <Input type="text" name="name_th" innerRef={register} />
              </FormGroup>
            </Fragment>
          ) : null}

          {ConfName ? (
            <Fragment>
              <FormGroup>
                <Label for="conf_name">
                  *ชื่องานประชุมวิชาการ (ภาษาอังกฤษ หากไม่มีให้ใส่ภาษาไทย)
                </Label>
                <Input
                  type="text"
                  name="conf_name"
                  innerRef={register}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="conf_name_th">ชื่องานประชุมวิชาการ (ภาษาไทย)</Label>
                <Input type="text" name="conf_name_th" innerRef={register} />
              </FormGroup>
              {Level0 === "COUNTRY" ? (
                <Fragment>
                  <FormGroup>
                    <Label for="conf_country">
                      *ชื่อประเทศที่จัดงานประชุมวิชาการ
                    </Label>
                    <Input
                      type="select"
                      name="conf_country"
                      value={conf_country}
                      onChange={handleCountryChange}
                      innerRef={register}
                      defaultValue={"Thailand"}
                      disabled
                      required
                    >
                      {countriesTH}
                    </Input>
                    <Input
                      type="hidden"
                      name="conf_country"
                      value={conf_country}
                      onChange={handleCountryChange}
                      innerRef={register}
                      defaultValue={"Thailand"}
                      required
                    >
                      {countriesTH}
                    </Input>
                  </FormGroup>

                  <FormGroup>
                    <Label for="conf_local">
                      *ชื่อจังหวัดที่จัดงานประชุมวิชาการ
                    </Label>
                    <Input
                      type="select"
                      name="conf_local"
                      value={conf_local}
                      onChange={handleStateChange}
                      innerRef={register}
                      required
                    >
                      <option value="">---โปรดเลือก---</option>
                      {statesTH}
                    </Input>
                  </FormGroup>
                </Fragment>
              ) : Level0 === "INTERNATIONAL" ? (
                <FormGroup>
                  <Label for="conf_country">
                    *ชื่อประเทศที่จัดงานประชุมวิชาการ
                  </Label>
                  <Input
                    type="select"
                    name="conf_country"
                    value={conf_country}
                    onChange={handleCountryChange}
                    innerRef={register}
                    required
                  >
                    <option value="">---โปรดเลือก---</option>
                    {countries}
                  </Input>
                </FormGroup>
              ) : null}
              {conf_country ? (
                <Fragment>
                  {Level0 === "INTERNATIONAL" ? (
                    <FormGroup>
                      <Label for="conf_local">
                        *ชื่อจังหวัดที่จัดงานประชุมวิชาการ
                      </Label>
                      <Input
                        type="select"
                        name="conf_local"
                        value={conf_local}
                        onChange={handleStateChange}
                        innerRef={register}
                        required
                      >
                        <option value="">---โปรดเลือก---</option>
                        {states}
                      </Input>
                    </FormGroup>
                  ) : null}
                </Fragment>
              ) : null}
            </Fragment>
          ) : null}

          <FormGroup>
            <Label for="uploadfile">
              *Upload File (เฉพาะไฟล์ PDF เท่านั้น):
            </Label>{" "}
            <UploadFilePDF />
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
          {/* Tag */}
          <FormGroup>
            <Label for="tagResearch">
              keywords: (ให้พิมพ์ keywords ภาษาอังกฤษ
              ที่ต้องการแล้วต่อด้วยการกดปุ่ม Enter หรือ , ในทุก ๆ keyword)
            </Label>
            <Tags />
            <br />
            {/* Student */}
            <Label for="tagStudent">
              รายชื่อนิสิตที่ร่วม: (ให้พิมพ์ ชื่อ - นามสกุลของนิสิต
              ที่ต้องการแล้วต่อด้วยการกดปุ่ม Enter หรือ , ในทุก ๆ รามชื่อ)
            </Label>
            <Student />
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
    loadingoverlay,
    uploadfile,
    sendList,
    sendLog,
    getemail_committee,
  })(ResearchFormPage)
);
