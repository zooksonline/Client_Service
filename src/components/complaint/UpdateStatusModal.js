import React, { useState, useEffect, Fragment } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
} from "reactstrap";
// import statusJson from "../../utilis/typestatus.json";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { useForm } from "react-hook-form";

import { uploadfile } from "../../actions/complaint/formAction";
import { sendUpdateStatus } from "../../actions/complaint/updateAction";

import { COMPLAINT_CLEAN_TRIGGER } from "../../type/complaint/type";
import { PAGE_LOADING } from "../../type/main/type";

const UpdateStatusModal = (props) => {
  // ค่า status ที่ต้องการเปลี่ยน
  const initialValue = [
    { id: 0, value: "A", name: "1" },
    { id: 1, value: "B", name: "2" },
  ];
  const [StatusName, setStatusName] = useState(null);
  const [StatusChange, setStatusChange] = useState(initialValue);

  const detail = useSelector((state) => state.complaint.list.detail);
  const token = useSelector((state) => state.main.auth.token);
  const updatestatus = useSelector(
    (state) => state.complaint.trigger.updatestatus
  );
  const { handleSubmit, register } = useForm();

  const [LabelFile] = useState("Choose File");
  const [CheckFileCorrect, setCheckFileCorrect] = useState(false);
  const [CheckFile, setCheckFile] = useState(false);
  const [CheckNoFile, setCheckNoFile] = useState(true);
  const [mergeName, setMergeName] = useState("");
  const [filePath, setfilePath] = useState("");
  const [Image, setImage] = useState({
    preview: "",
    raw: "",
  });

  const [modal, setmodal] = useState(false);
  const [disButton, setdisButton] = useState(false);
  const dispatch = useDispatch();

  UpdateStatusModal.propTypes = {
    uploadfile: PropTypes.func.isRequired,
    sendUpdateStatus: PropTypes.func.isRequired,
  };
  const { uploadfile, sendUpdateStatus } = props;

  // status ก่อนเปลี่ยน
  useEffect(() => {
    if (detail) {
      if (detail[0].status) {
        if (detail[0].status === "WAITING") {
          setStatusName("รอรับเรื่อง");
        }
        if (detail[0].status === "RECEIVED") {
          setStatusName("รับเรื่องแล้ว รอพิจารณา");
        }
        if (detail[0].status === "CONSIDERING") {
          setStatusName("กำลังพิจารณา");
        }
        if (detail[0].status === "EDIT") {
          setStatusName("ต้องการข้อมูลเพิ่มเติม รอข้อมูลจากผู้แจ้ง");
        }
        if (detail[0].status === "RESULT") {
          setStatusName("เสร็จสิ้นการพิจารณา");
        }
      }
    }
    // eslint-disable-next-line
  }, [detail]);

  // status สำหรับเปลี่ยน
  useEffect(() => {
    const WaitingStatus = [{ id: 0, value: "RECEIVED", name: "รับเรื่อง" }];
    const ReceivedStatus = [{ id: 0, value: "CONSIDERING", name: "พิจารณา" }];
    const ConsideringStatus = [
      { id: 0, value: "EDIT", name: "แก้ไขหรือส่งข้อมูลเพิ่มเติม" },
      { id: 1, value: "CONSIDERING", name: "พิจารณาอีกรอบ" },
      { id: 2, value: "RESULT", name: "เสร็จสิ้นการพิจารณา" },
    ];

    const EditStatus = [{ id: 0, value: "RECEIVED", name: "รับเรื่อง" }];
    const ResultStatus = [{ id: 0, value: null, name: null }];
    if (StatusName) {
      if (detail[0].status === "WAITING") {
        setStatusChange(WaitingStatus);
      }
      if (detail[0].status === "RECEIVED") {
        setStatusChange(ReceivedStatus);
      }
      if (detail[0].status === "CONSIDERING") {
        setStatusChange(ConsideringStatus);
      }
      if (detail[0].status === "EDIT") {
        setStatusChange(EditStatus);
      }
      if (detail[0].status === "RESULT") {
        setStatusChange(ResultStatus);
        setdisButton(true);
      }
    }
    // eslint-disable-next-line
  }, [StatusName]);

  const toggle = async () => {
    await setmodal(!modal);
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
    // eslint-disable-next-line
  }, [Image]);

  useEffect(() => {
    const setImagePath = async () => {
      if (await mergeName) {
        await setfilePath("/uploads/" + detail[0].buasri_id + "/" + mergeName);
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

  // check update status success
  useEffect(() => {
    if (updatestatus) {
      const checkUpdateStatus = async () => {
        await alert("อัพเดตรายการสำเร็จ");
        await dispatch({ type: COMPLAINT_CLEAN_TRIGGER });
        await props.history.push("/complaint");
        await dispatch({ type: PAGE_LOADING });
      };
      checkUpdateStatus();
    }
    // eslint-disable-next-line
  }, [updatestatus]);

  const onChange = async (e) => {
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
            await NewUploadFile.append("buasri_id", detail[0].buasri_id);
            await NewUploadFile.append("filePath", filePath);
            await uploadfile(NewUploadFile, token);
          } else {
            await alert("ประเภทไฟล์ของคุณไม่ถูกต้อง");
          }
        }
      }
    }

    //
    const newUpdate = await {
      id: e.no_id,
      buasri_id: detail[0].buasri_id,
      email: detail[0].email,
      member: detail[0].member,
      phone: detail[0].phone,
      topic: detail[0].topic,
      note: e.note,
      status_before: detail[0].status,
      status: e.status_change,
      file_name: mergeName,
      file_path: filePath,
    };

    if (await window.confirm("โปรดยืนยันการอัพเดต?")) {
      await upload();
      if ((await CheckFileCorrect) || (await CheckNoFile)) {
        await sendUpdateStatus(newUpdate, token);
        await setdisButton(true);
      }
    } else {
      return false;
    }
  };

  return (
    <Fragment>
      {detail[0].status !== "RESULT" ? (
        <Button onClick={toggle} disabled={disButton}>
          อัพเดตสถานะ
        </Button>
      ) : null}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>สถานะที่ต้องการอัพเดต</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label for="no_id">หมายเลขแจ้ง</Label>
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
                placeholder={StatusName}
                value={detail[0].status}
                innerRef={register}
                readOnly
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="note">รายละเอียด</Label>
              <Input type="textarea" name="note" innerRef={register}></Input>
            </FormGroup>

            {detail[0].status === "EDIT" ? (
              <FormGroup>
                <Label for="file">
                  Upload File: (เฉพาะไฟล์รูปภาพ PNG, JPG และ GIF เท่านั้น)
                </Label>
                <CustomInput
                  type="file"
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
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default withRouter(
  connect(null, { uploadfile, sendUpdateStatus })(UpdateStatusModal)
);
