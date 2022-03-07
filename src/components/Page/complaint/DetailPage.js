import React, { useState, Fragment, useMemo } from "react";
import { Container, Table } from "reactstrap";
import { connect, useSelector } from "react-redux";
// import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import statusJson from "../../../utilis/typestatus.json";
import typeJson from "../../../utilis/typecomplaint.json";
import UpdateStatusModal from "../../complaint/UpdateStatusModal";
import BackComplaintPage from "../../complaint/BackComplaintPage";

// Env
import { config } from "../../../utilis/config";
import NewLineToBr from "../../../utilis/newLine";

const ComplaintDetailPage = (props) => {
  const detail = useSelector((state) => state.complaint.list.detail);
  const complaintUser = useSelector((state) => state.complaint.auth.user);
  const [TypeFilter, setTypeFilter] = useState(null);
  const [StatusFilter, setStatusFilter] = useState(null);
  const [NoteFilter, setNoteFilter] = useState("ไม่มีรายละเอียด");
  const [UploadFilter, setUploadFilter] = useState(null);
  const conComplaint = config.connectComplaintAPI;

  useMemo(() => {
    if (detail) {
      if (detail[0].status) {
        setStatusFilter(
          statusJson
            .filter((data) => {
              if (data.status === detail[0].status) {
                return data.name;
              } else {
                return null;
              }
            })
            .map((data) => {
              if (data.status === detail[0].status) {
                return <Fragment key={data.status}>{data.name}</Fragment>;
              } else {
                return null;
              }
            })
        );
        setTypeFilter(
          typeJson
            .filter((data) => {
              if (data.type === detail[0].type) {
                return data.name;
              } else {
                return null;
              }
            })
            .map((data) => {
              if (data.type === detail[0].type) {
                return <Fragment key={data.type}>{data.name}</Fragment>;
              } else {
                return null;
              }
            })
        );
      }
      if (detail[0].status.note) {
        setNoteFilter(detail[0].status.note);
      }
      if (detail[0].file_name) {
        setUploadFilter(conComplaint + detail[0].file_path);
      }
    }
    // eslint-disable-next-line
  }, [detail]);
  //   console.log(StatusFilter);
  return (
    <Fragment>
      <Container>
        <BackComplaintPage />
      </Container>

      {detail ? (
        <Fragment>
          <Container>
            <h4>รายละเอียด</h4>
            <br />
            <Table hover responsive>
              <tbody>
                <tr>
                  <th scope="row">หัวข้อที่แจ้ง:</th>
                  <td>{detail[0].topic}</td>
                </tr>
                <tr>
                  <th scope="row">ประเภทการร้องเรียน:</th>
                  <td>{TypeFilter}</td>
                </tr>
                <tr>
                  <th scope="row">รายละเอียด:</th>
                  <td>
                    <NewLineToBr>{detail[0].detail}</NewLineToBr>
                  </td>
                </tr>
                <tr>
                  <th scope="row">E-mail:</th>
                  <td>{detail[0].email}</td>
                </tr>
                <tr>
                  <th scope="row">เบอร์ติดต่อ:</th>
                  <td>{detail[0].phone}</td>
                </tr>
                {UploadFilter ? (
                  <tr>
                    <th scope="row">รูปภาพ:</th>
                    <td>
                      <img src={UploadFilter} alt="" width="300"></img>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </Table>
          </Container>
          <Container>
            <h4>สถานะล่าสุด</h4>
            <Table hover responsive>
              <tbody>
                <tr>
                  <th scope="row">สถานะ:</th>
                  <td>{StatusFilter}</td>
                </tr>
                <tr>
                  <th scope="row">รายละเอียด:</th>
                  <td colSpan="4">{NoteFilter}</td>
                </tr>
              </tbody>
            </Table>
            {complaintUser.position === "ADMIN" &&
            detail[0].status !== "EDIT" &&
            detail[0].member === "MEMBER" ? (
              <UpdateStatusModal />
            ) : null}
            {complaintUser.position === "ADMIN" &&
            detail[0].member === "GUEST" ? (
              <UpdateStatusModal />
            ) : null}
            {complaintUser.position === "USER" &&
            detail[0].status === "EDIT" ? (
              <UpdateStatusModal />
            ) : null}
          </Container>
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default withRouter(connect(null, null)(ComplaintDetailPage));
