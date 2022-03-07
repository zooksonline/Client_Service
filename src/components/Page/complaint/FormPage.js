import React, { useState, useEffect, Fragment } from "react";
import {
  Container,
  Button,
  Form,
  FormGroup,
  CustomInput,
  Label,
  Input,
} from "reactstrap";
import { connect, useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { COMPLAINT_CLEAN_TRIGGER } from "../../../type/complaint/type";
import { PAGE_LOADING } from "../../../type/main/type";
import BackComplaintPage from "../../complaint/BackComplaintPage";

import {
  uploadfile,
  newlist as sendNewList,
} from "../../../actions/complaint/formAction";
import { withRouter } from "react-router-dom";

const ComplaintFormPage = (props) => {
  const { handleSubmit, register } = useForm();
  const user = useSelector((state) => state.complaint.auth.user);
  const token = useSelector((state) => state.main.auth.token);
  const addlist = useSelector((state) => state.complaint.trigger.addlist);
  const dispatch = useDispatch();

  // UploadFile
  const [LabelFile] = useState("Choose File");
  const [CheckFile, setCheckFile] = useState(false);
  const [, setCheckFileCorrect] = useState(false);
  const [, setCheckNoFile] = useState(true);
  const [mergeName, setMergeName] = useState("");
  const [filePath, setfilePath] = useState("");
  const [Image, setImage] = useState({
    preview: "",
    raw: "",
  });

  ComplaintFormPage.propTypes = {
    uploadfile: PropTypes.func.isRequired,
    sendNewList: PropTypes.func.isRequired,
  };

  const { uploadfile, sendNewList } = props;

  // check addlist success
  useEffect(() => {
    if (addlist) {
      const checkAddlist = async () => {
        await alert("เพิ่มรายการสำเร็จ");
        await dispatch({ type: COMPLAINT_CLEAN_TRIGGER });

        await props.history.push("/complaint");
        await dispatch({ type: PAGE_LOADING });
      };
      checkAddlist();
    }
    // eslint-disable-next-line
  }, [addlist]);

  const onChange = (e) => {
    const { name } = e.target;
    if (name === "fileupload") {
      if (e.target.files.length) {
        setCheckFile(true);
        setCheckNoFile(false);
        setImage({
          preview: URL.createObjectURL(e.target.files[0]),
          raw: e.target.files[0],
        });
      } else {
        setImage({
          preview: "",
          raw: "",
        });
        setCheckFile(false);
        setMergeName("");
        setfilePath("");
        setCheckFileCorrect(false);
        setCheckNoFile(true);
      }
    }
  };

  // mergeName
  useEffect(() => {
    const timenow = Date.now();
    const setImageName = async () => {
      if ((await Image.raw.type) === "image/png") {
        await setMergeName(timenow + ".png");
        await setCheckFileCorrect(true);
      } else if ((await Image.raw.type) === "image/jpeg") {
        await setMergeName(timenow + ".jpg");
        await setCheckFileCorrect(true);
      } else if ((await Image.raw.type) === "image/gif") {
        await setMergeName(timenow + ".gif");
        await setCheckFileCorrect(true);
      } else {
        await setCheckFileCorrect(false);
      }
    };
    setImageName();
  }, [Image]);

  // create name upload
  useEffect(() => {
    const setImagePath = async () => {
      if (await mergeName) {
        await setfilePath("/uploads/" + user.buasri_id + "/" + mergeName);
      }
    };
    setImagePath();
    // eslint-disable-next-line
  }, [mergeName]);

  // ล้างรูป Upload
  const cancelUpload = (e) => {
    e.preventDefault();
    setImage({
      preview: "",
      raw: "",
    });
    setCheckFile(false);
    setMergeName("");
    setfilePath("");
    setCheckFileCorrect(false);
    setCheckNoFile(true);
  };

  const onSubmit = async (e) => {
    async function upload() {
      if (CheckFile) {
        if (Image) {
          if (
            Image.raw.type === "image/png" ||
            Image.raw.type === "image/jpeg" ||
            Image.raw.type === "image/gif"
          ) {
            const NewUploadFile = new FormData();
            await NewUploadFile.append("file", Image.raw, mergeName);
            await NewUploadFile.append("buasri_id", user.buasri_id);
            await NewUploadFile.append("filePath", filePath);
            await uploadfile(NewUploadFile, token);
          } else {
            await alert("ประเภทไฟล์ของคุณไม่ถูกต้อง");
          }
        }
      }
    }

    // await console.log(e.email);
    if (user.position === "ADMIN") {
      const newList = await {
        token: token,
        buasri_id: user.buasri_id,
        member: e.member,
        email: e.email,
        phone: e.phone,
        type: e.type,
        topic: e.topic,
        detail: e.detail,
        status: "WAITING",
        file_name: mergeName,
        file_path: filePath,
      };
      await sendNewList(newList);
      await upload();
    } else {
      const newList = await {
        token: token,
        buasri_id: user.buasri_id,
        member: "MEMBER",
        email: e.email,
        phone: e.phone,
        type: e.type,
        topic: e.topic,
        detail: e.detail,
        status: "WAITING",
        file_name: mergeName,
        file_path: filePath,
      };
      await sendNewList(newList);
      await upload();
    }
  };

  return (
    <Fragment>
      <Container>
        <BackComplaintPage />
        <h4>
          <b>แบบฟอร์มการร้องเรียน</b>
        </h4>

        <br />
      </Container>
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <p className="text-danger">
              แบบฟอร์มนี้มีไว้สำหรับการรับข้อร้องเรียนต่างๆ
              โดยข้อมูลต่างๆที่ท่านกรอกผ่านแบบฟอร์มนี้ จะถูกเก็บเป็นความลับ ชื่อ
              เบอร์โทรศัพท์ และอีเมล์ ของท่านมีไว้เพื่อติดต่อกลับ
              ทางคณะผู้บริหารจะนำข้อร้องเรียนและข้อเสนอแนะไปปรับปรุงการให้บริการของคณะวิทยาศาสตร์ต่อไป
              ขอขอบพระคุณสำหรับความร่วมมือ{" "}
            </p>
            <p>
              **หมายเหตุ:
              ท่านจำเป็นต้องกรอกข้อมูลทุกข้อให้ครับถ้วนจึงถือเป็นข้อร้องเรียน
            </p>
          </FormGroup>
          {user.position === "ADMIN" ? (
            <Fragment>
              <FormGroup>
                <Label for="email">*Email:</Label>
                <Input
                  type="email"
                  name="email"
                  innerRef={register}
                  placeholder="E-mail ผู้แจ้ง"
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label for="member">*ประเภทผู้ร้องเรียน:</Label>
                <Input type="select" name="member" innerRef={register}>
                  <option value="GUEST">บุคคลภายนอกมหาวิทยาลัย</option>
                  <option value="MEMBER">บุคคลภายในมหาวิทยาลัย</option>
                </Input>
              </FormGroup>
            </Fragment>
          ) : (
            <Fragment>
              <FormGroup>
                <Label for="email">*Email:</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder={user.email}
                  innerRef={register}
                  value={user.email}
                  readOnly
                ></Input>
              </FormGroup>
            </Fragment>
          )}
          <FormGroup>
            <Label for="phone">เบอร์ติดต่อ:</Label>
            <Input
              type="text"
              name="phone"
              innerRef={register}
              placeholder="เบอร์ที่ใช้ติดต่อ (สูงสุด 20 ตัวอักษร)"
              maxLength="20"
            />
          </FormGroup>
          {/* ประเภทการร้องเรียน */}
          <FormGroup tag="fieldset">
            <Label>*ประเภทการร้องเรียน:</Label>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="type"
                  innerRef={register}
                  value="BUILDING"
                  required
                />{" "}
                อาคารและสถานที่
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="type"
                  innerRef={register}
                  value="LEARNING"
                  required
                />{" "}
                การเรียนการสอน
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="type"
                  innerRef={register}
                  value="ACTIVITY"
                  required
                />{" "}
                กิจกรรม
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="type"
                  innerRef={register}
                  value="SERVICES"
                  required
                />{" "}
                การบริการ
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="type"
                  innerRef={register}
                  value="ETHICAL"
                  required
                />{" "}
                จริยธรรม/จรรยาบรรณ
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="type"
                  innerRef={register}
                  value="OTHER"
                  required
                />{" "}
                อื่น ๆ
              </Label>
            </FormGroup>
          </FormGroup>
          <FormGroup>
            <Label for="topic">*หัวข้อ:</Label>
            <Input
              type="text"
              name="topic"
              innerRef={register}
              placeholder="หัวข้อที่ต้องการร้องเรียน (สูงสุด 80 ตัวอักษร)"
              maxLength="80"
              required
            />
          </FormGroup>
          {/*  */}
          <FormGroup>
            <Label for="detail">*รายละเอียด:</Label>
            <Input
              type="textarea"
              name="detail"
              innerRef={register}
              placeholder="อธิบายรายละเอียดที่ต้องการร้องเรียน"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="uploadfile">
              Upload File: (เฉพาะไฟล์รูปภาพ PNG, JPG และ GIF เท่านั้น)
            </Label>
            <CustomInput
              type="file"
              id="fileupload"
              name="fileupload"
              label={LabelFile}
              onChange={onChange}
              accept="image/PNG, image/JPEG, image/GIF"
            />
            {Image.preview ? (
              <Fragment>
                <br />
                <br />
                <Button color={"danger"} onClick={cancelUpload}>
                  ยกเลิก Upload
                </Button>
                <br />
                <br />
                <img src={Image.preview} alt="" width="300" />
              </Fragment>
            ) : null}
          </FormGroup>
          <FormGroup>
            <Button color="dark">Submit</Button>
          </FormGroup>
        </Form>
      </Container>
    </Fragment>
  );
};

export default withRouter(
  connect(null, { uploadfile, sendNewList })(ComplaintFormPage)
);
