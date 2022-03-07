import React, { Fragment, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const FormButton = (props) => {
  const [modal, setmodal] = useState(false);
  const dispatch = useDispatch();
  const toggle = () => {
    setmodal(!modal);
  };

  const GoFormPage = (e) => {
    e.preventDefault();
    dispatch({ type: "PAGE_LOADING" });
    props.history.push("/complaint/form");
  };

  return (
    <Fragment>
      <Button name="button" color="dark" onClick={toggle}>
        แจ้งเรื่องร้องเรียน
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          หลักเกณฑ์ในการรับเรื่องร้องเรียน
        </ModalHeader>
        <ModalBody>
          <ul>
            <li>
              ใช้ถ้อยคำหรือข้อความที่สุภาพ และต้องมี
              <ul>
                <li>
                  ชื่อ ที่อยู่ หมายเลขโทรศัพท์ หรือ อีเมล์
                  ที่สามารถติดต่อถึงผู้ร้องเรียนหรือร้องทุกข์ได้
                </li>
                <li>
                  ข้อเท็จจริง หรือ
                  พฤติการณ์ของเรื่องที่ร้องเรียนได้อย่างชัดเจนว่าได้รับความเดือดร้อนหรือเสียหายอย่างไร
                  ต้องการให้แก้ไข
                </li>
                <li>
                  ระบุ เวลา สถานที่ พยาน เอกสาร พยานวัตถุ และพยานบุคคล (ถ้ามี)
                  ให้ชัดเจน
                </li>
              </ul>
            </li>
            <li>
              ข้อร้องเรียนต้องเป็นเรื่องจริงที่มีมูลเหตุ
              มิได้หวังสร้างกระแสหรือสร้างข่าวที่เสียหายต่อบุคคลอื่นหรือหน่วยงานต่างๆ
              ที่เกี่ยวข้อง
            </li>
            <li>
              การใช้บริการร้องเรียนนั้น ต้องสามารถติดต่อกลับไปยังผู้ใช้บริการได้
              เพื่อยืนยันว่ามีตัวตนจริง
              ไม่ได้สร้างเรื่องเพื่อกล่าวหาบุคคลอื่นหรือหน่วยงานต่าง ๆ
              ให้เกิดความเสียหาย
            </li>
            <li>
              ข้อร้องเรียนที่มีข้อมูลไม่ครบถ้วน ไม่เพียงพอ
              หรือไม่สามารถหาข้อมูลเพิ่มเติมได้ในการดำเนินการตรวจสอบ สืบสวน
              สอบสวน ข้อเท็จจริง ตามรายละเอียดที่กล่าวมาในข้อที่ 1 นั้น
              ให้ยุติเรื่อง
            </li>
          </ul>
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
  );
};

export default withRouter(connect(null, null)(FormButton));
