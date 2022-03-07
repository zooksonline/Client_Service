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
import { withRouter } from "react-router-dom";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import LoadingOverlay from "react-loading-overlay";
import styled, { css } from "styled-components";
import UploadFilePDF from "../../research/UploadFileModal";
// Action
import { uploadfile } from "../../../actions/research/formAction";
import {
  newlist as sendList,
  loadingoverlay,
} from "../../../actions/research/editAction";
import { getemail_committee } from "../../../actions/research/emailAction";

import { newlog as sendLog } from "../../../actions/research/logAction";

// Json
import typeartical from "../../../utilis/research/typearticle.json";
import typelevel from "../../../utilis/research/typelevel.json";
import patentJson from "../../../utilis/research/typepatent.json";
import pettypatentJson from "../../../utilis/research/typepettypatent.json";
import copyrightJson from "../../../utilis/research/typecopyright.json";
import countryLocJson from "../../../utilis/research/typecountry_loc.json";
import countryLocTHJson from "../../../utilis/research/typecountry_locTH.json";
import monthJson from "../../../utilis/research/typemonth.json";

import EditTags from "../../research/TagsEdit";
import TagStudentEdit from "../../research/TagStudentEdit";

// Env
import { config } from "../../../utilis/config";

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

const ResearchEditPage = (props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.main.auth.token);
  const user = useSelector((state) => state.main.auth.user);
  const detail = useSelector((state) => state.research.list.detail);
  const trigger = useSelector((state) => state.research.trigger);
  const e_research = useSelector((state) => state.main.auth.service.e_research);
  const CheckLoadingOverlay = useSelector(
    (state) => state.research.form.loading_overlay
  );

  const [FullName, setFullName] = useState(null);
  const fullyear = new Date().getFullYear();
  // Start Form
  const [start, setStart] = useState(true);
  // Form
  const { register, handleSubmit } = useForm();
  // trigger research type
  const [ConfName, setConfName] = useState(false);
  const [PatentName, setPatentName] = useState(false);
  const [PettyPatentName, setPettyPatentName] = useState(false);
  const [CopyrightName, setCopyrightName] = useState(false);
  const [JournalName, setJournalName] = useState(false);
  // From Email Reducer
  // get email
  const email_committee = useSelector(
    (state) => state.research.email.email_committee
  );
  const [countEmail, setcountEmail] = useState(0);
  // level0
  // value เปลี่ยนเมื่อ level เปลี่ยน
  const [levelChange, setlevelChange] = useState("");
  // trigger เมื่อ level เปลี่ยน
  const [levelStart, setlevelStart] = useState(true);
  // ใช้ trigger เมื่อเปลี่ยน level sub 2 สำเร็จ
  const [levelStart2, setlevelStart2] = useState(true);

  // config
  const conResearch = config.connectResearchAPI;
  // Tag
  const tagstate = useSelector((state) => state.research.form.tags);
  // Student
  const studentstate = useSelector((state) => state.research.form.student);

  const log = useSelector((state) => state.research.form.log);

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

  // ประเภทงานวิจัย
  const [Level2, setLevel2] = useState([
    {
      sublevel_2_Key: "",
      sublevel_2: "---โปรดเลือก---",
    },
  ]);

  // สำหรับ Country and Local เท่านั้น
  const [ListCountry] = useState(
    countryLocJson.map((item) => (
      <option key={item.name} value={item.name}>
        {item.name}
      </option>
    ))
  );
  const [ListCountryTH] = useState(
    countryLocTHJson.map((item) => (
      <option key={item.name} value={item.name}>
        {item.name}
      </option>
    ))
  );
  const statesTH = countryLocJson
    .find((item) => item.name === "Thailand")
    ?.states.map((state) => (
      <option key={state} value={state}>
        {state}
      </option>
    ));
  const [ListLocal, setListLocal] = useState(null);
  /* ******************************************************** */

  // propTypes
  ResearchEditPage.propTypes = {
    loadingoverlay: PropTypes.func.isRequired,
    uploadfile: PropTypes.func.isRequired,
    sendList: PropTypes.func.isRequired,
    getemail_committee: PropTypes.func.isRequired,
    sendLog: PropTypes.func.isRequired,
  };

  const { loadingoverlay, uploadfile, sendList, getemail_committee, sendLog } =
    props;

  // detail[0].conf[0].country
  // detail[0].conf[0].local_name
  // When ListCountry has value
  useEffect(() => {
    if (detail) {
      if (detail[0].conf[0]) {
        setListLocal(
          countryLocJson
            .find((item) => item.name === detail[0].conf[0].country)
            ?.states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))
        );
      }
    }

    // eslint-disable-next-line
  }, [ListCountry]);

  // When Send Form Success
  useEffect(() => {
    if (trigger.send_success && log) {
      const goMainResearchPage = async () => {
        await alert("ส่งงานวิจัยสำเร็จ");
        dispatch({ type: "PAGE_LOADING" });
        props.history.push("/research");
      };
      goMainResearchPage();
    }
    // eslint-disable-next-line
  }, [trigger, log]);

  // Start EditPage
  useEffect(() => {
    if (start) {
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

  // IF GET EMAIL COMMITTEE THEN COUNT EMAIL
  useEffect(() => {
    if (email_committee) {
      setcountEmail(email_committee.length);
    }
    // eslint-disable-next-line
  }, [email_committee]);

  // หากมีข้อมูล ให้ใส่ข้อมูลลง redux
  useEffect(() => {
    if (detail) {
      if (levelStart) {
        setlevelStart(false);
        setlevelStart2(true);
        setlevelChange(detail[0].level);
      }
      if (detail[0].file_name) {
        setOldUpload(conResearch + detail[0].file_path);
        setOldUploadName(detail[0].file_name);
        setOldUploadPath(detail[0].file_path);
      }
      if (detail[0].firstname && detail[0].lastname) {
        setFullName(detail[0].firstname + " " + detail[0].lastname);
      }

      if (detail[0].article_type) {
        if (detail[0].article_type === "CONFERENCE") {
          setConfName(true);
          setPatentName(false);
          setPettyPatentName(false);
          setJournalName(false);
          setCopyrightName(false);
        } else if (detail[0].article_type === "PATENT") {
          setConfName(false);
          setPatentName(true);
          setPettyPatentName(false);
          setJournalName(false);
          setCopyrightName(false);
        } else if (detail[0].article_type === "PETTY-PATENT") {
          setConfName(false);
          setPatentName(false);
          setPettyPatentName(true);
          setJournalName(false);
          setCopyrightName(false);
        } else if (detail[0].article_type === "COPYRIGHT") {
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
    }
    // eslint-disable-next-line
  }, [detail]);

  // หาก level มีการเปลี่ยนแปลง ให้เปลี่ยน dropdown เป็น level ที่เลือก
  useEffect(() => {
    if (levelChange) {
      if (levelChange === "INTERNATIONAL") {
        if (detail[0].level_sub1 === "OCSC") {
          setLevel2([
            { sublevel_2_Key: "SCOPUS", sublevel_2: "Scopus" },
            { sublevel_2_Key: "WEB-OF-SCIENCE", sublevel_2: "lsi" },
            { sublevel_2_Key: "Eric", sublevel_2: "ERIC" },
            { sublevel_2_Key: "MathSciNet", sublevel_2: "MathSciNet" },
            { sublevel_2_Key: "Pubmed", sublevel_2: "Pubmed" },
            { sublevel_2_Key: "JSTOR", sublevel_2: "JSTOR" },
            { sublevel_2_Key: "Project Muse", sublevel_2: "Project Muse" },
          ]);
          setlevelStart2(false);
        } else {
          setLevel2([
            { sublevel_2_Key: "NON-DB", sublevel_2: "ไม่มีฐานข้อมูล" },
          ]);
          setlevelStart2(false);
        }
      } else if (levelChange === "COUNTRY") {
        if (detail[0].level_sub1 === "OCSC") {
          setLevel2([
            { sublevel_2_Key: "TCI-TYPE-1", sublevel_2: "TCI กลุ่ม 1" },
            { sublevel_2_Key: "TCI-TYPE-2", sublevel_2: "TCI กลุ่ม 2" },
            {
              sublevel_2_Key: "TCI-TYPE-3",
              sublevel_2: "TCI อื่น ๆ หรือระบุไม่ได้",
            },
          ]);
          setlevelStart2(false);
        } else {
          setLevel2([
            { sublevel_2_Key: "NON-DB", sublevel_2: "ไม่มีฐานข้อมูล" },
          ]);
          setlevelStart2(false);
        }
      } else {
        setLevel2([
          {
            sublevel_2_Key: "",
            sublevel_2: "---------",
          },
        ]);
        setlevelStart2(false);
      }
    }
    // eslint-disable-next-line
  }, [levelChange]);

  // หากไม่มีข้อมูลให้กลับไปหน้าก่อน
  useEffect(() => {
    const fetchData = async () => {
      if (!detail) {
        props.history.push("/research");
      }
      if (detail && user) {
        if (
          detail[0].buasri_id !== user.buasri_id &&
          detail[0].status !== "EDIT"
        ) {
          props.history.push("/research");
        }
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [detail]);
  /////////////////////////////////////Start Upload Zone ////////////////////////////////////////

  // หากมี PDF เก่าให้แสดง
  useEffect(() => {
    if (OldUpload) {
    }
  }, [OldUpload]);

  // Button Open Old PDF
  const toggleOldPDF = () => {
    window.open(OldUpload);
  };

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

  /////////////////////////////////////End Upload Zone ////////////////////////////////////////

  // หากมีการเปลี่ยนแปลงการ form
  const onChange = (e) => {
    const { name, value } = e.target;
    // level
    if (name === "level0") {
      setlevelChange(value);
      // console.log(value);
    }

    // level1
    if (name === "level_sub1") {
      if (value === "OCSC" && levelChange === "INTERNATIONAL") {
        setLevel2([
          { sublevel_2_Key: "SCOPUS", sublevel_2: "Scopus" },
          { sublevel_2_Key: "WEB-OF-SCIENCE", sublevel_2: "lsi" },
          { sublevel_2_Key: "Eric", sublevel_2: "ERIC" },
          { sublevel_2_Key: "MathSciNet", sublevel_2: "MathSciNet" },
          { sublevel_2_Key: "Pubmed", sublevel_2: "Pubmed" },
          { sublevel_2_Key: "JSTOR", sublevel_2: "JSTOR" },
          { sublevel_2_Key: "Project Muse", sublevel_2: "Project Muse" },
        ]);
      } else if (value === "OCSC" && levelChange === "COUNTRY") {
        setLevel2([
          { sublevel_2_Key: "TCI-TYPE-1", sublevel_2: "TCI-TYPE-1" },
          { sublevel_2_Key: "TCI-TYPE-2", sublevel_2: "TCI-TYPE-2" },
          {
            sublevel_2_Key: "TCI-TYPE-3",
            sublevel_2: "TCI อื่น ๆ หรือระบุไม่ได้",
          },
        ]);
      } else {
        setLevel2([{ sublevel_2_Key: "NON-DB", sublevel_2: "ไม่มีฐานข้อมูล" }]);
      }
    }

    // fileupload
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
    // article_type
    if (name === "article_type") {
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

    // country
    if (name === "conf_country") {
      setListLocal(
        countryLocJson
          .find((item) => item.name === value)
          ?.states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))
      );
    }
  };

  const onSubmit = async (e) => {
    async function upload_newpdf() {
      if (CheckFile === false) {
        const newList = await {
          token,
          data_email: email_committee,
          count_email: countEmail,
          user_email: user.email,
          _id: detail[0]._id,
          buasri_id: detail[0].buasri_id,
          year: detail[0].year ? detail[0].year : undefined,
          email: detail[0].email,
          dep: detail[0].dep,
          firstname: detail[0].firstname,
          lastname: detail[0].lastname,
          position: detail[0].position,
          research_name: e.research_name
            ? e.research_name
            : detail[0].research_name
            ? detail[0].research_name
            : undefined,
          research_name_th: e.research_name_th
            ? e.research_name_th
            : detail[0].research_name_th
            ? detail[0].research_name_th
            : undefined,
          article_type: e.article_type
            ? e.article_type
            : detail[0].article_type
            ? detail[0].article_type
            : undefined,
          level: e.level0
            ? e.level0
            : detail[0].level
            ? detail[0].level
            : undefined,
          level_sub1: e.level_sub1
            ? e.level_sub1
            : detail[0].level_sub1
            ? detail[0].level_sub1
            : undefined,
          level_sub2: e.level_sub2
            ? e.level_sub2
            : detail[0].level_sub2
            ? detail[0].level_sub2
            : undefined,
          type_name:
            PatentName || PettyPatentName || CopyrightName
              ? e.type_name
                ? e.type_name
                : detail[0].type_name
              : undefined,
          request_number:
            PatentName || PettyPatentName || CopyrightName
              ? e.request_number
                ? e.request_number
                : detail[0].article_type_name[0].request_number
                ? detail[0].article_type_name[0].request_number
                : undefined
              : undefined,
          register_number:
            PatentName || PettyPatentName || CopyrightName
              ? e.register_number
                ? e.register_number
                : detail[0].article_type_name[0].register_number
                ? detail[0].article_type_name[0].register_number
                : undefined
              : undefined,
          journal_name: JournalName
            ? e.journal_name
              ? e.journal_name
              : detail[0].journal_name
              ? detail[0].journal_name
              : undefined
            : undefined,
          quartile: e.quartile
            ? e.quartile
            : detail[0].quartile
            ? detail[0].quartile
            : undefined,
          author_type: e.author_type
            ? e.author_type
            : detail[0].author_type
            ? detail[0].author_type
            : undefined,
          research_year: e.research_year,
          conference_name: ConfName
            ? e.conference_name
              ? e.conference_name
              : detail[0].conf[0].conf_name
              ? detail[0].conf[0].conf_name
              : undefined
            : undefined,
          conference_name_th: ConfName
            ? e.conference_name_th
              ? e.conference_name_th
              : detail[0].conf[0].conf_name_th
              ? detail[0].conf[0].conf_name_th
              : undefined
            : undefined,
          research_month: ConfName ? e.month : undefined,
          conf_country: ConfName
            ? e.conf_country
              ? e.conf_country
              : detail[0].conf[0].country
            : undefined,
          conf_local: ConfName
            ? e.conf_local
              ? e.conf_local
              : detail[0].conf[0].local_name
            : undefined,
          tags: tagstate
            ? tagstate
            : detail[0].tags
            ? detail[0].tags
            : undefined,
          student: studentstate
            ? studentstate
            : detail[0].student
            ? detail[0].student
            : undefined,
          note: detail[0].note,
          file_name:
            mergeName && filePath
              ? mergeName
              : OldUploadName
              ? OldUploadName
              : undefined,
          file_path:
            mergeName && filePath
              ? filePath
              : OldUploadPath
              ? OldUploadPath
              : undefined,
          status: "WAITING",
        };

        const newLog = await {
          token,
          research_id: detail[0]._id,
          buasri_id: detail[0].buasri_id,
          year: detail[0].year ? detail[0].year : undefined,
          email: detail[0].email,
          firstname: detail[0].firstname,
          lastname: detail[0].lastname,
          position: detail[0].position,
          name: e.research_name
            ? e.research_name
            : detail[0].research_name
            ? detail[0].research_name
            : undefined,
          name_th: e.research_name_th
            ? e.research_name_th
            : detail[0].research_name_th
            ? detail[0].research_name_th
            : undefined,
          article: e.article_type
            ? e.article_type
            : detail[0].article_type
            ? detail[0].article_type
            : undefined,
          level: e.level0
            ? e.level0
            : detail[0].level
            ? detail[0].level
            : undefined,
          sub_level_1: e.level_sub1
            ? e.level_sub1
            : detail[0].level_sub1
            ? detail[0].level_sub1
            : undefined,
          sub_level_2: e.level_sub2
            ? e.level_sub2
            : detail[0].level_sub2
            ? detail[0].level_sub2
            : undefined,
          type_name:
            PatentName || PettyPatentName || CopyrightName
              ? e.type_name
                ? e.type_name
                : detail[0].type_name
              : undefined,
          request_number:
            PatentName || PettyPatentName || CopyrightName
              ? e.request_number
                ? e.request_number
                : detail[0].article_type_name[0].request_number
                ? detail[0].article_type_name[0].request_number
                : undefined
              : undefined,
          register_number:
            PatentName || PettyPatentName || CopyrightName
              ? e.register_number
                ? e.register_number
                : detail[0].article_type_name[0].register_number
                ? detail[0].article_type_name[0].register_number
                : undefined
              : undefined,
          journal_name: JournalName
            ? e.journal_name
              ? e.journal_name
              : detail[0].journal_name
              ? detail[0].journal_name
              : undefined
            : undefined,
          quartile: e.quartile
            ? e.quartile
            : detail[0].quartile
            ? detail[0].quartile
            : undefined,
          author: e.author_type
            ? e.author_type
            : detail[0].author_type
            ? detail[0].author_type
            : undefined,
          research_year: e.research_year,
          conference_name: ConfName
            ? e.conference_name
              ? e.conference_name
              : detail[0].conf[0].conf_name
            : undefined,
          conference_name_th: ConfName
            ? e.conference_name_th
              ? e.conference_name_th
              : detail[0].conf[0].conf_name_th
            : undefined,
          conference_month: ConfName ? e.month : undefined,
          conference_country: ConfName
            ? e.conf_country
              ? e.conf_country
              : detail[0].conf[0].country
            : undefined,
          conference_local: ConfName
            ? e.conf_local
              ? e.conf_local
              : detail[0].conf[0].local_name
            : undefined,
          tags: tagstate
            ? tagstate
            : detail[0].tags
            ? detail[0].tags
            : undefined,
          student: studentstate
            ? studentstate
            : detail[0].student
            ? detail[0].student
            : undefined,
          note: detail[0].note,
          file_name:
            mergeName && filePath
              ? mergeName
              : OldUploadName
              ? OldUploadName
              : undefined,
          file_path:
            mergeName && filePath
              ? filePath
              : OldUploadPath
              ? OldUploadPath
              : undefined,
          status: "WAITING",
        };

        await loadingoverlay();
        await sendList(newList);
        await sendLog(newLog);
      }

      if (CheckFile) {
        if (PDF) {
          if (PDF.raw.type === "application/pdf") {
            const NewUploadFile = new FormData();
            await NewUploadFile.append("file", PDF.raw, mergeName);
            await NewUploadFile.append("buasri_id", user.buasri_id);
            await NewUploadFile.append("filePath", filePath);

            // await console.log(...NewUploadFile);
            // // ส่งไฟล์ Upload
            await loadingoverlay();
            await uploadfile(NewUploadFile, token);
            const newList = await {
              token,
              data_email: email_committee,
              count_email: countEmail,
              user_email: user.email,
              _id: detail[0]._id,
              buasri_id: detail[0].buasri_id,
              year: detail[0].year ? detail[0].year : undefined,
              email: detail[0].email,
              dep: detail[0].dep,
              firstname: detail[0].firstname,
              lastname: detail[0].lastname,
              position: detail[0].position,
              research_name: e.research_name
                ? e.research_name
                : detail[0].research_name
                ? detail[0].research_name
                : undefined,
              research_name_th: e.research_name_th
                ? e.research_name_th
                : detail[0].research_name_th
                ? detail[0].research_name_th
                : undefined,
              article_type: e.article_type
                ? e.article_type
                : detail[0].article_type
                ? detail[0].article_type
                : undefined,
              level: e.level0
                ? e.level0
                : detail[0].level
                ? detail[0].level
                : undefined,
              level_sub1: e.level_sub1
                ? e.level_sub1
                : detail[0].level_sub1
                ? detail[0].level_sub1
                : undefined,
              level_sub2: e.level_sub2
                ? e.level_sub2
                : detail[0].level_sub2
                ? detail[0].level_sub2
                : undefined,
              type_name:
                PatentName || PettyPatentName || CopyrightName
                  ? e.type_name
                    ? e.type_name
                    : detail[0].type_name
                  : undefined,
              request_number:
                PatentName || PettyPatentName || CopyrightName
                  ? e.request_number
                    ? e.request_number
                    : detail[0].article_type_name[0].request_number
                    ? detail[0].article_type_name[0].request_number
                    : undefined
                  : undefined,
              register_number:
                PatentName || PettyPatentName || CopyrightName
                  ? e.register_number
                    ? e.register_number
                    : detail[0].article_type_name[0].register_number
                    ? detail[0].article_type_name[0].register_number
                    : undefined
                  : undefined,
              journal_name: JournalName
                ? e.journal_name
                  ? e.journal_name
                  : detail[0].journal_name
                  ? detail[0].journal_name
                  : undefined
                : undefined,
              quartile: e.quartile
                ? e.quartile
                : detail[0].quartile
                ? detail[0].quartile
                : undefined,
              author_type: e.author_type
                ? e.author_type
                : detail[0].author_type
                ? detail[0].author_type
                : undefined,
              research_year: e.research_year,
              conference_name: ConfName
                ? e.conference_name
                  ? e.conference_name
                  : detail[0].conf[0].conf_name
                : undefined,
              conference_name_th: ConfName
                ? e.conference_name_th
                  ? e.conference_name_th
                  : detail[0].conf[0].conf_name_th
                : undefined,
              research_month: ConfName ? e.month : undefined,
              conf_country: ConfName
                ? e.conf_country
                  ? e.conf_country
                  : detail[0].conf[0].country
                : undefined,
              conf_local: ConfName
                ? e.conf_local
                  ? e.conf_local
                  : detail[0].conf[0].local_name
                : undefined,
              tags: tagstate
                ? tagstate
                : detail[0].tags
                ? detail[0].tags
                : undefined,
              student: studentstate
                ? studentstate
                : detail[0].student
                ? detail[0].student
                : undefined,
              note: detail[0].note,
              file_name:
                mergeName && filePath
                  ? mergeName
                  : OldUploadName
                  ? OldUploadName
                  : undefined,
              file_path:
                mergeName && filePath
                  ? filePath
                  : OldUploadPath
                  ? OldUploadPath
                  : undefined,
              status: "WAITING",
            };

            const newLog = await {
              token,
              research_id: detail[0]._id,
              buasri_id: detail[0].buasri_id,
              year: detail[0].year ? detail[0].year : undefined,
              email: detail[0].email,
              firstname: detail[0].firstname,
              lastname: detail[0].lastname,
              position: detail[0].position,
              name: e.research_name
                ? e.research_name
                : detail[0].research_name
                ? detail[0].research_name
                : undefined,
              name_th: e.research_name_th
                ? e.research_name_th
                : detail[0].research_name_th
                ? detail[0].research_name_th
                : undefined,
              article: e.article_type
                ? e.article_type
                : detail[0].article_type
                ? detail[0].article_type
                : undefined,
              level: e.level0
                ? e.level0
                : detail[0].level
                ? detail[0].level
                : undefined,
              sub_level_1: e.level_sub1
                ? e.level_sub1
                : detail[0].level_sub1
                ? detail[0].level_sub1
                : undefined,
              sub_level_2: e.level_sub2
                ? e.level_sub2
                : detail[0].level_sub2
                ? detail[0].level_sub2
                : undefined,
              type_name:
                PatentName || PettyPatentName || CopyrightName
                  ? e.type_name
                    ? e.type_name
                    : detail[0].type_name
                  : undefined,
              request_number:
                PatentName || PettyPatentName || CopyrightName
                  ? e.request_number
                    ? e.request_number
                    : detail[0].article_type_name[0].request_number
                    ? detail[0].article_type_name[0].request_number
                    : undefined
                  : undefined,
              register_number:
                PatentName || PettyPatentName || CopyrightName
                  ? e.register_number
                    ? e.register_number
                    : detail[0].article_type_name[0].register_number
                    ? detail[0].article_type_name[0].register_number
                    : undefined
                  : undefined,
              journal_name: JournalName
                ? e.journal_name
                  ? e.journal_name
                  : detail[0].journal_name
                  ? detail[0].journal_name
                  : undefined
                : undefined,
              quartile: e.quartile
                ? e.quartile
                : detail[0].quartile
                ? detail[0].quartile
                : undefined,
              author: e.author_type
                ? e.author_type
                : detail[0].author_type
                ? detail[0].author_type
                : undefined,
              research_year: e.research_year,
              conference_name: ConfName
                ? e.conference_name
                  ? e.conference_name
                  : detail[0].conf[0].conf_name
                : undefined,
              conference_name_th: ConfName
                ? e.conference_name_th
                  ? e.conference_name_th
                  : detail[0].conf[0].conf_name_th
                : undefined,
              conference_month: ConfName ? e.month : undefined,
              conference_country: ConfName
                ? e.conf_country
                  ? e.conf_country
                  : detail[0].conf[0].country
                : undefined,
              conference_local: ConfName
                ? e.conf_local
                  ? e.conf_local
                  : detail[0].conf[0].local_name
                : undefined,
              tags: tagstate
                ? tagstate
                : detail[0].tags
                ? detail[0].tags
                : undefined,
              student: studentstate
                ? studentstate
                : detail[0].student
                ? detail[0].student
                : undefined,
              note: detail[0].note,
              file_name:
                mergeName && filePath
                  ? mergeName
                  : OldUploadName
                  ? OldUploadName
                  : undefined,
              file_path:
                mergeName && filePath
                  ? filePath
                  : OldUploadPath
                  ? OldUploadPath
                  : undefined,
              status: "WAITING",
            };

            await loadingoverlay();
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

    await upload_newpdf();

    // console.log(newList);
  };

  return (
    <Fragment>
      {detail ? (
        <Container>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label for="fullname">ผู้ส่ง:</Label>
              <Input name="fullname" defaultValue={FullName} readOnly></Input>
            </FormGroup>
            {ConfName || JournalName ? (
              <Fragment>
                <FormGroup>
                  <Label for="research_name">
                    *ชื่อบทความวิจัย (ภาษาอังกฤษ หากไม่มีให้ใส่ภาษาไทย):
                  </Label>
                  <Input
                    name="research_name"
                    onChange={onChange}
                    innerRef={register}
                    defaultValue={detail[0].research_name}
                    required
                  ></Input>
                </FormGroup>
                <FormGroup>
                  <Label for="research_name_th">
                    ชื่อบทความวิจัย (ภาษาไทย):
                  </Label>
                  <Input
                    name="research_name_th"
                    onChange={onChange}
                    innerRef={register}
                    defaultValue={
                      detail[0].research_name_th
                        ? detail[0].research_name_th
                        : null
                    }
                  ></Input>
                </FormGroup>
              </Fragment>
            ) : PatentName ? (
              <Fragment>
                <FormGroup>
                  <Label for="research_name">
                    *ชื่อหัวเรื่องที่ยื่นคำขอจดสิทธิบัตร (ภาษาอังกฤษ
                    หากไม่มีให้ใส่ภาษาไทย):
                  </Label>
                  <Input
                    name="research_name"
                    onChange={onChange}
                    innerRef={register}
                    defaultValue={detail[0].research_name}
                    required
                  ></Input>
                </FormGroup>
                <FormGroup>
                  <Label for="research_name_th">
                    *ชื่อหัวเรื่องที่ยื่นคำขอจดสิทธิบัตร (ภาษาไทย):
                  </Label>
                  <Input
                    name="research_name_th"
                    onChange={onChange}
                    innerRef={register}
                    defaultValue={
                      detail[0].research_name_th
                        ? detail[0].research_name_th
                        : null
                    }
                  ></Input>
                </FormGroup>
              </Fragment>
            ) : PettyPatentName ? (
              <Fragment>
                <FormGroup>
                  <Label for="research_name">
                    *ชื่อหัวเรื่องที่ยื่นคำขอจดอนุสิทธิบัตร (ภาษาอังกฤษ
                    หากไม่มีให้ใส่ภาษาไทย):
                  </Label>
                  <Input
                    name="research_name"
                    onChange={onChange}
                    innerRef={register}
                    defaultValue={detail[0].research_name}
                    required
                  ></Input>
                </FormGroup>
                <FormGroup>
                  <Label for="research_name_th">
                    ชื่อหัวเรื่องที่ยื่นคำขอจดอนุสิทธิบัตร (ภาษาไทย):
                  </Label>
                  <Input
                    name="research_name_th"
                    onChange={onChange}
                    innerRef={register}
                    defaultValue={
                      detail[0].research_name_th
                        ? detail[0].research_name_th
                        : null
                    }
                  ></Input>
                </FormGroup>
              </Fragment>
            ) : CopyrightName ? (
              <Fragment>
                <FormGroup>
                  <Label for="research_name">
                    *ชื่อหัวเรื่องที่ยื่นคำขอจดลิขสิทธิ์ (ภาษาอังกฤษ
                    หากไม่มีให้ใส่ภาษาไทย):
                  </Label>
                  <Input
                    name="research_name"
                    onChange={onChange}
                    innerRef={register}
                    defaultValue={detail[0].research_name}
                    required
                  ></Input>
                </FormGroup>
                <FormGroup>
                  <Label for="research_name_th">
                    ชื่อหัวเรื่องที่ยื่นคำขอจดลิขสิทธิ์ (ภาษาไทย):
                  </Label>
                  <Input
                    name="research_name_th"
                    onChange={onChange}
                    innerRef={register}
                    defaultValue={
                      detail[0].research_name_th
                        ? detail[0].research_name_th
                        : null
                    }
                  ></Input>
                </FormGroup>
              </Fragment>
            ) : null}

            <FormGroup>
              <Label for="article_type">ประเภทการเผยแพร่บทความวิจัย:</Label>
              <Input
                type="select"
                name="article_type"
                onChange={onChange}
                defaultValue={detail[0].article_type}
                innerRef={register}
              >
                {typeartical.map((opt) => (
                  <option value={opt.articleKey} key={opt.articleKey}>
                    {opt.article}
                  </option>
                ))}
              </Input>
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
                    defaultValue={
                      detail[0].article_type === "PATENT"
                        ? detail[0].article_type_name[0].type_name
                        : null
                    }
                    required
                  >
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
                    defaultValue={
                      detail[0].article_type === "PATENT"
                        ? detail[0].article_type_name[0].request_number
                        : null
                    }
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="register_number">
                    เลขที่ประกาศ/เลขที่ทะเบียน
                  </Label>
                  <Input
                    type="text"
                    name="register_number"
                    innerRef={register}
                    defaultValue={
                      detail[0].article_type === "PATENT"
                        ? detail[0].article_type_name[0].register_number
                        : null
                    }
                  />
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
                    defaultValue={
                      detail[0].article_type === "PETTY-PATENT"
                        ? detail[0].article_type_name[0].type_name
                        : null
                    }
                    required
                  >
                    {pettypatentJson.map((petty) => (
                      <option key={petty.No} value={petty.Value}>
                        {petty.Name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="request_number">*เลขคำขออนุสิทธิบัตร</Label>
                  <Input
                    type="text"
                    name="request_number"
                    innerRef={register}
                    defaultValue={
                      detail[0].article_type === "PETTY-PATENT"
                        ? detail[0].article_type_name[0].request_number
                        : null
                    }
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="register_number">
                    เลขที่ประกาศ/เลขที่ทะเบียน
                  </Label>
                  <Input
                    type="text"
                    name="register_number"
                    innerRef={register}
                    defaultValue={
                      detail[0].article_type === "PATENT"
                        ? detail[0].article_type_name[0].register_number
                        : null
                    }
                  />
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
                    defaultValue={
                      detail[0].article_type === "JOURNAL"
                        ? detail[0].article_type_name[0].journal_name
                        : null
                    }
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
                    defaultValue={
                      detail[0].article_type === "COPYRIGHT"
                        ? detail[0].article_type_name[0].type_name
                        : null
                    }
                    required
                  >
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
                    defaultValue={
                      detail[0].article_type === "COPYRIGHT"
                        ? detail[0].article_type_name[0].request_number
                        : null
                    }
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="register_number">
                    เลขที่ประกาศ/เลขที่ทะเบียน
                  </Label>
                  <Input
                    type="text"
                    name="register_number"
                    innerRef={register}
                    defaultValue={
                      detail[0].article_type === "COPYRIGHT"
                        ? detail[0].article_type_name[0].register_number
                        : null
                    }
                  />
                </FormGroup>
              </Fragment>
            ) : null}
            {ConfName || JournalName ? (
              <FormGroup>
                <Label for="level0">ระดับการนำเสนอบทความวิจัย:</Label>
                <Input
                  type="select"
                  name="level0"
                  defaultValue={detail[0].level}
                  onChange={onChange}
                  innerRef={register}
                >
                  {typelevel.map((opt) => (
                    <option value={opt.levelKey} key={opt.levelKey}>
                      {opt.level}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            ) : PatentName ? (
              <FormGroup>
                <Label for="level0">*ระดับการยื่นขอจดสิทธิบัตร</Label>
                <Input
                  type="select"
                  name="level0"
                  defaultValue={detail[0].level}
                  onChange={onChange}
                  innerRef={register}
                >
                  {typelevel.map((opt) => (
                    <option value={opt.levelKey} key={opt.levelKey}>
                      {opt.level}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            ) : PettyPatentName ? (
              <FormGroup>
                <Label for="level0">*ระดับการยื่นขอจดอนุสิทธิบัตร</Label>
                <Input
                  type="select"
                  name="level0"
                  defaultValue={detail[0].level}
                  onChange={onChange}
                  innerRef={register}
                >
                  {typelevel.map((opt) => (
                    <option value={opt.levelKey} key={opt.levelKey}>
                      {opt.level}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            ) : CopyrightName ? (
              <FormGroup>
                <Label for="level0">*ระดับการยื่นขอจดลิขสิทธิ์</Label>
                <Input
                  type="select"
                  name="level0"
                  defaultValue={detail[0].level}
                  onChange={onChange}
                  innerRef={register}
                >
                  {typelevel.map((opt) => (
                    <option value={opt.levelKey} key={opt.levelKey}>
                      {opt.level}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            ) : null}
            {ConfName || JournalName ? (
              <FormGroup>
                <Label for="level_sub1">*ระดับคุณภาพบทความวิจัยวิชาการ</Label>
                <Input
                  type="select"
                  name="level_sub1"
                  innerRef={register}
                  onChange={onChange}
                  defaultValue={detail[0].level_sub1}
                >
                  <option value="OCSC">อยู่ในเกณฑ์</option>
                  <option value="NON-OCSC">ไม่อยู่ในเกณฑ์</option>
                </Input>
              </FormGroup>
            ) : PatentName ? (
              <FormGroup>
                <Label for="level_sub1">*ระดับคุณภาพการยื่นขอจดสิทธิบัตร</Label>
                <Input
                  type="select"
                  name="level_sub1"
                  innerRef={register}
                  onChange={onChange}
                  disabled
                >
                  <option value="">
                    ไม่สามารถระบุระดับคุณภาพการยื่นขอจดสิทธิบัตร
                  </option>
                </Input>
                <Input
                  type="hidden"
                  name="level_sub1"
                  innerRef={register}
                  onChange={onChange}
                >
                  <option value="">
                    ไม่สามารถระบุระดับคุณภาพการยื่นขอจดสิทธิบัตร
                  </option>
                </Input>
              </FormGroup>
            ) : PettyPatentName ? (
              <FormGroup>
                <Label for="level_sub1">
                  *ระดับคุณภาพการยื่นขอจดอนุสิทธิบัตร
                </Label>
                <Input
                  type="select"
                  name="level_sub1"
                  innerRef={register}
                  onChange={onChange}
                  disabled
                >
                  <option value="">
                    ไม่สามารถระบุระดับคุณภาพการยื่นขอจดอนุสิทธิบัตร
                  </option>
                </Input>
                <Input
                  type="hidden"
                  name="level_sub1"
                  innerRef={register}
                  onChange={onChange}
                >
                  <option value="">
                    ไม่สามารถระบุระดับคุณภาพการยื่นขอจดอนุสิทธิบัตร
                  </option>
                </Input>
              </FormGroup>
            ) : CopyrightName ? (
              <FormGroup>
                <Label for="level_sub1">*ระดับคุณภาพการยื่นขอจดลิขสิทธิ์</Label>
                <Input
                  type="select"
                  name="level_sub1"
                  innerRef={register}
                  onChange={onChange}
                  disabled
                >
                  <option value="">
                    ไม่สามารถระบุระดับคุณภาพการยื่นขอจดลิขสิทธิ์
                  </option>
                </Input>
                <Input
                  type="hidden"
                  name="level_sub1"
                  innerRef={register}
                  onChange={onChange}
                >
                  <option value="">
                    ไม่สามารถระบุระดับคุณภาพการยื่นขอจดลิขสิทธิ์
                  </option>
                </Input>
              </FormGroup>
            ) : null}
            {ConfName || JournalName ? (
              <FormGroup>
                <Label for="level_sub2">*ฐานข้อมูลที่เผยแพร่บทความวิจัย</Label>
                {levelStart2 ? null : (
                  <Input
                    type="select"
                    name="level_sub2"
                    innerRef={register}
                    defaultValue={detail[0].level_sub2}
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
                )}
              </FormGroup>
            ) : PatentName ? (
              <FormGroup>
                <Label for="level_sub2">*ฐานข้อมูลที่ยื่นขอจดสิทธิบัตร</Label>
                {levelStart2 ? null : (
                  <Input
                    type="select"
                    name="level_sub2"
                    innerRef={register}
                    disabled
                  >
                    <option value="">
                      ไม่สามารถระบุฐานข้อมูลที่ยื่นขอจดสิทธิบัตร
                    </option>
                  </Input>
                )}
                {levelStart2 ? null : (
                  <Input
                    type="hidden"
                    name="level_sub2"
                    innerRef={register}
                    defaultValue=""
                  >
                    {/* <option value="">
                      ไม่สามารถระบุฐานข้อมูลที่ยื่นขอจดสิทธิบัตร
                    </option> */}
                  </Input>
                )}
              </FormGroup>
            ) : PettyPatentName ? (
              <FormGroup>
                <Label for="level_sub2">
                  *ฐานข้อมูลที่ยื่นขอจดอนุสิทธิบัตร
                </Label>
                {levelStart2 ? null : (
                  <Input
                    type="select"
                    name="level_sub2"
                    innerRef={register}
                    disabled
                  >
                    <option value="">
                      ไม่สามารถระบุฐานข้อมูลที่ยื่นขอจดอนุสิทธิบัตร
                    </option>
                  </Input>
                )}
                {levelStart2 ? null : (
                  <Input
                    type="hidden"
                    name="level_sub2"
                    innerRef={register}
                    defaultValue={""}
                  >
                    {/* <option value="">
                      ไม่สามารถระบุฐานข้อมูลที่ยื่นขอจดอนุสิทธิบัตร
                    </option> */}
                  </Input>
                )}
              </FormGroup>
            ) : CopyrightName ? (
              <FormGroup>
                <Label for="level_sub2">*ฐานข้อมูลที่ยื่นขอจดลิขสิทธิ์</Label>
                {levelStart2 ? null : (
                  <Input
                    type="select"
                    name="level_sub2"
                    innerRef={register}
                    disabled
                  >
                    <option value="">
                      ไม่สามารถระบุฐานข้อมูลที่ยื่นขอจดลิขสิทธิ์
                    </option>
                  </Input>
                )}
                {levelStart2 ? null : (
                  <Input
                    type="hidden"
                    name="level_sub2"
                    innerRef={register}
                    defaultValue={""}
                  >
                    {/* <option value="">
                      ไม่สามารถระบุฐานข้อมูลที่ยื่นขอจดลิขสิทธิ์
                    </option> */}
                  </Input>
                )}
              </FormGroup>
            ) : null}
            {ConfName || JournalName ? (
              <FormGroup>
                <Label for="research_year">ปีที่เผยแพร่บทความวิจัย:</Label>
                <Input
                  type="select"
                  name="research_year"
                  defaultValue={detail[0].research_year}
                  innerRef={register}
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
                <Label for="research_year">*ปีที่ยื่นขอจดสิทธิบัตร</Label>
                <Input
                  type="select"
                  name="research_year"
                  defaultValue={detail[0].research_year}
                  innerRef={register}
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
                <Label for="research_year">*ปีที่ยื่นขอจดอนุสิทธิบัตร</Label>
                <Input
                  type="select"
                  name="research_year"
                  defaultValue={detail[0].research_year}
                  innerRef={register}
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
              <FormGroup>
                <Label for="research_year">*ปีที่ยื่นขอจดลิขสิทธิ์</Label>
                <Input
                  type="select"
                  name="research_year"
                  defaultValue={detail[0].research_year}
                  innerRef={register}
                >
                  <option value={fullyear + 1}>{fullyear + 1}</option>
                  {Array.from(new Array(2), (v, i) => (
                    <option key={i} value={fullyear - i}>
                      {fullyear - i}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            ) : null}

            {ConfName ? (
              <Fragment>
                <FormGroup>
                  <Label for="month">*เดือนที่เผยแพร่บทความวิจัย</Label>
                  <Input
                    type="select"
                    name="month"
                    innerRef={register}
                    defaultValue={
                      detail[0].article_type === "CONFERENCE"
                        ? detail[0].conf[0].research_month
                          ? detail[0].conf[0].research_month
                          : null
                        : null
                    }
                    required
                  >
                    {monthJson.map((level) => (
                      <option value={level.levelKey} key={level.levelKey}>
                        {level.level}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Fragment>
            ) : null}

            {ConfName && levelChange === "COUNTRY" ? (
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
                  defaultValue={""}
                  required
                >
                  {/* <option value="">ไม่สามารถระบุ Quartile ได้</option> */}
                </Input>
              </FormGroup>
            ) : ConfName && levelChange === "INTERNATIONAL" ? (
              <FormGroup>
                <Label for="quartile">
                  *ระดับ Quartile ของบทความวิจัยที่เผยแพร่
                </Label>
                <Input
                  type="select"
                  name="quartile"
                  innerRef={register}
                  defaultValue={detail[0].quartile}
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
            ) : JournalName && levelChange === "INTERNATIONAL" ? (
              <FormGroup>
                <Label for="quartile">
                  *ระดับ Quartile ของบทความวิจัยที่เผยแพร่
                </Label>
                <Input
                  type="select"
                  name="quartile"
                  innerRef={register}
                  defaultValue={detail[0].quartile}
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
            ) : JournalName && levelChange === "COUNTRY" ? (
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
                  defaultValue={""}
                  required
                >
                  {/* <option value="">ไม่สามารถระบุ Quartile ได้</option> */}
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
                  defaultValue={""}
                  required
                >
                  {/* <option value="">ไม่สามารถระบุ Quartile ได้</option> */}
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
                  defaultValue={""}
                  required
                >
                  {/* <option value="">ไม่สามารถระบุ Quartile ได้</option> */}
                </Input>
              </FormGroup>
            ) : CopyrightName ? (
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
                  defaultValue={""}
                  required
                >
                  {/* <option value="">ไม่สามารถระบุ Quartile ได้</option> */}
                </Input>
              </FormGroup>
            ) : null}

            {ConfName || JournalName ? (
              <FormGroup tag="fieldset">
                <Label for="author">*บทบาทของผู้นิพนธ์บทความวิจัย</Label>
                <Input
                  name="author_type"
                  type="select"
                  innerRef={register}
                  defaultValue={detail[0].author_type}
                  required
                >
                  <option value="FIRST-AUTHOR">
                    ผู้นิพนธ์ชื่อแรก (First Author)
                  </option>
                  <option value="AUTHOR">
                    ผู้นิพนธ์หลัก (Corresponding Author)
                  </option>
                  <option value="FIRST-AUTHOR-AND-AUTHOR">
                    ผู้นิพนธ์ชื่อแรก (First Author) & ผู้นิพนธ์หลัก
                    (Corresponding Author)
                  </option>
                  <option value="CO-AUTHOR">ผู้นิพนธ์ร่วม (Co-Author)</option>
                </Input>
              </FormGroup>
            ) : PatentName ? (
              <FormGroup tag="fieldset">
                <Label for="author">*บทบาทของผู้ยื่นขอจดสิทธิบัตร</Label>
                <Input
                  name="author_type"
                  type="select"
                  innerRef={register}
                  defaultValue={detail[0].author_type}
                  required
                >
                  <option value="AUTHOR">ผู้ยื่นขอจดสิทธิบัตร</option>
                  <option value="CO-AUTHOR">ผู้ร่วมขอจดสิทธิบัตร</option>
                </Input>
              </FormGroup>
            ) : PettyPatentName ? (
              <FormGroup tag="fieldset">
                <Label for="author">*บทบาทของผู้ยื่นขอจดอนุสิทธิบัตร</Label>
                <Input
                  name="author_type"
                  type="select"
                  innerRef={register}
                  defaultValue={detail[0].author_type}
                  required
                >
                  <option value="AUTHOR">ผู้ยื่นขอจดอนุสิทธิบัตร</option>
                  <option value="CO-AUTHOR">ผู้ร่วมขอจดอนุสิทธิบัตร</option>
                </Input>
              </FormGroup>
            ) : CopyrightName ? (
              <FormGroup tag="fieldset">
                <Label for="author">*บทบาทของผู้ยื่นขอจดลิขสิทธิ์</Label>
                <Input
                  name="author_type"
                  type="select"
                  innerRef={register}
                  defaultValue={detail[0].author_type}
                  required
                >
                  <option value="AUTHOR">ผู้ยื่นขอจดลิขสิทธิ์</option>
                  <option value="CO-AUTHOR">ผู้ร่วมขอจดลิขสิทธิ์</option>
                </Input>
              </FormGroup>
            ) : null}

            {ConfName ? (
              <Fragment>
                <FormGroup>
                  <Label for="conference_name">
                    *ชื่องานประชุมวิชาการ (ภาษาอังกฤษ หากไม่มีให้ใส่ภาษาไทย)
                  </Label>
                  <Input
                    type="text"
                    name="conference_name"
                    defaultValue={
                      detail[0].article_type === "CONFERENCE"
                        ? detail[0].conf[0]
                          ? detail[0].conf[0].conf_name
                          : null
                        : null
                    }
                    innerRef={register}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="conference_name_th">
                    ชื่องานประชุมวิชาการ (ภาษาไทย)
                  </Label>
                  <Input
                    type="text"
                    name="conference_name_th"
                    defaultValue={
                      detail[0].article_type === "CONFERENCE"
                        ? detail[0].conf[0]
                          ? detail[0].conf[0].conf_name_th
                          : null
                        : null
                    }
                    innerRef={register}
                  />
                </FormGroup>
                {levelChange === "COUNTRY" ? (
                  <Fragment>
                    <FormGroup>
                      <Label for="conf_country">
                        *ชื่อประเทศที่จัดงานประชุมวิชาการ
                      </Label>
                      <Input
                        type="select"
                        name="conf_country"
                        onChange={onChange}
                        innerRef={register}
                        defaultValue="Thailand"
                        disabled
                        required
                      >
                        {ListCountryTH}
                      </Input>
                      <Input
                        type="hidden"
                        name="conf_country"
                        onChange={onChange}
                        innerRef={register}
                        defaultValue="Thailand"
                        required
                      >
                        {/* {ListCountryTH} */}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="conf_local">
                        *ชื่อจังหวัดที่จัดงานประชุมวิชาการ
                      </Label>
                      <Input
                        type="select"
                        name="conf_local"
                        onChange={onChange}
                        innerRef={register}
                        required
                      >
                        {statesTH}
                      </Input>
                    </FormGroup>
                  </Fragment>
                ) : levelChange === "INTERNATIONAL" ? (
                  <FormGroup>
                    <Label for="conf_country">
                      *ชื่อประเทศที่จัดงานประชุมวิชาการ
                    </Label>
                    <Input
                      type="select"
                      name="conf_country"
                      defaultValue={
                        detail[0].article_type === "CONFERENCE"
                          ? detail[0].conf[0]
                            ? detail[0].conf[0].country
                            : null
                          : null
                      }
                      onChange={onChange}
                      innerRef={register}
                      required
                    >
                      <option value="">---โปรดเลือก---</option>
                      {ListCountry}
                    </Input>
                  </FormGroup>
                ) : null}
                {ListCountry ? (
                  <Fragment>
                    {levelChange === "INTERNATIONAL" ? (
                      <FormGroup>
                        <Label for="conf_local">
                          *ชื่อจังหวัดที่จัดงานประชุมวิชาการ
                        </Label>
                        <Input
                          type="select"
                          name="conf_local"
                          defaultValue={
                            detail[0].article_type === "CONFERENCE"
                              ? detail[0].conf[0]
                                ? detail[0].conf[0].local_name
                                : null
                              : null
                          }
                          onChange={onChange}
                          innerRef={register}
                          required
                        >
                          {ListLocal}
                        </Input>
                      </FormGroup>
                    ) : null}
                  </Fragment>
                ) : null}
              </Fragment>
            ) : null}

            {/* Tag */}
            <FormGroup>
              <Label for="tagResearch">
                keywords: (ให้พิมพ์ keywords ที่ต้องการแล้วต่อด้วยการกดปุ่ม
                Enter หรือ , ในทุก ๆ keyword)
              </Label>
              <EditTags />
            </FormGroup>
            {/* StudentTag */}
            <FormGroup>
              <Label for="studentResearch">
                รายชื่อนิสิตที่เข้าร่วม: (ให้พิมพ์ชื่อ - นามสกุลของนิสิต
                ที่ต้องการแล้วต่อด้วยการกดปุ่ม Enter หรือ , ในทุก ๆ รายชื่อ)
              </Label>
              <TagStudentEdit />
            </FormGroup>

            <FormGroup>
              <Label for="uploadfile">
                *Upload File (เฉพาะไฟล์ PDF เท่านั้น):
              </Label>{" "}
              <UploadFilePDF />
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
      ) : null}
    </Fragment>
  );
};

export default withRouter(
  connect(null, {
    loadingoverlay,
    uploadfile,
    sendList,
    getemail_committee,
    sendLog,
  })(ResearchEditPage)
);
