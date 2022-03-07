import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { Badge, Modal, ModalHeader, ModalBody } from "reactstrap";

const UploadFileModal = (props) => {
  const [modal, setmodal] = useState(false);

  const toggle = () => {
    setmodal(!modal);
    if (modal) {
    } else {
    }
  };
  return (
    <Fragment>
      <Badge id="detail_upload" onClick={toggle} href="#" color="warning">
        อ่านรายละเอียดเกี่ยวกับไฟล์ PDF ที่ใช้
      </Badge>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          การแนบไฟล์ผลงานวิจัยสำหรับระบบ E-Research
        </ModalHeader>
        <ModalBody>
          <ol>
            <li>เอกสารแนบที่ใช้ต้องนามสกุล .pdf เท่านั้น</li>
            <li>
              เอกสารที่ใช้แนบประกอบด้วย
              <ul>
                <li>
                  ส่วนที่เป็นบทความที่ตีพิมพ์ผ่านวารสาร ที่มีเลขหน้าปรากฎ
                  (ต้องมี)
                </li>
                <li>หน้าเว็บไซด์ที่เผยแพร่ผลงานของท่าน (ต้องมี)</li>
                <li>หน้าปก (ถ้ามี)</li>
                <li>สารบัญ (ถ้ามี)</li>
                <li>กองบรรณาธิการ (ถ้ามี)</li>
              </ul>
            </li>
            <li>
              ไฟล์ที่ใช้แนบต้องรวมไฟล์ทั้งหมดเป็นไฟล์เดียว
              โดยท่านสามารถเข้าไปรวมไฟล์จากข้อ 2 ได้ ที่
              <ul>
                <li>
                  <a
                    href="https://www.ilovepdf.com/th/merge_pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://www.ilovepdf.com/th/merge_pdf
                  </a>
                </li>
                <li>
                  <a
                    href="https://tools.pdf24.org/th/merge-pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://tools.pdf24.org/th/merge-pdf
                  </a>
                </li>
              </ul>
            </li>
            <li>
              ตัวอย่างไฟล์แนบ{" "}
              <a
                href="https://drive.google.com/file/d/1mRMrUxc_nyy0xs4vDss3ilgwIQps83uZ/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                (คลิก)
              </a>
            </li>
          </ol>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default connect(null, null)(UploadFileModal);
