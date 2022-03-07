import React, { useState, useEffect, Fragment, useMemo } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Container, Table, Button } from "reactstrap";
import { withRouter } from "react-router-dom";
import dateFormat, { masks } from "dateformat";

// JSON
import articleJson from "../../../utilis/research/typearticle.json";
import statusJson from "../../../utilis/research/typestatus.json";
import level0Json from "../../../utilis/research/typelevel.json";
import level_sub1Json from "../../../utilis/research/typelevel_sub1.json";
import authorJson from "../../../utilis/research/typeauthor.json";
import authorPatentJson from "../../../utilis/research/typeauthor_patent.json";
import authorPettyPatentJson from "../../../utilis/research/typeauthor_pettypatent.json";
import authorCopyRightJson from "../../../utilis/research/typeauthor_copyright.json";

import BackToResearchPage from "../../research/BackResearchPage";
import UpdateStatusModal from "../../research/UpdateStatusModal";

// Date
import "moment-timezone";
import "moment/locale/th";
import moment from "moment-timezone";

// Env
import { config } from "../../../utilis/config";

const ResearchDetailPage = (props) => {
  const researchUser = useSelector(
    (state) => state.main.auth.service.e_research
  );
  const user = useSelector((state) => state.main.auth.user);
  const detail = useSelector((state) => state.research.list.detail);
  const [UploadFilter, setUploadFilter] = useState(null);
  // config
  const conResearch = config.connectResearchAPI;
  // trigger
  const trigger_status = useSelector(
    (state) => state.research.trigger.update_status
  );
  const log = useSelector((state) => state.research.trigger.log);

  const [Level0Filter, setLevel0Filter] = useState(null);
  const [Level1Filter, setLevel1Filter] = useState(null);
  const [AuthorFilter, setAuthorFilter] = useState(null);
  const [AuthorPatentFilter, setAuthorPatentFilter] = useState(null);
  const [AuthorPettyPatentFilter, setAuthorPettyPatentFilter] = useState(null);
  const [AuthorCopyRightFilter, setAuthorCopyRightFilter] = useState(null);
  const [ArticleFilter, setArticleFilter] = useState(null);
  const [StatusFilter, setStatusFilter] = useState(null);
  const [StudentFilter, setStudentFilter] = useState(null);
  const [TagFilter, setTagFilter] = useState(null);
  console.log(TagFilter);
  const [NoteFilter, setNoteFilter] = useState(false);

  const [GoEdit, setGoEdit] = useState(false);
  const dispatch = useDispatch();

  // check outdate?
  const [CloseSubmit, setCloseSubmit] = useState(false);
  const checkout_date = useSelector(
    (state) => state.research.button.date_check
  );
  const currentDate = moment()._d;
  const currentDateUnix = Date.parse(currentDate);

  useEffect(() => {
    if (trigger_status && log) {
      const GotoMainPage = async () => {
        await alert("อัพเดตสถานะสำเร็จ");
        await dispatch({ type: "PAGE_LOADING" });
        await props.history.push("/research");
      };
      GotoMainPage();
    }
    // eslint-disable-next-line
  }, [trigger_status, log]);

  useMemo(() => {
    if (detail) {
      if (detail[0]) {
        // LEVEL
        if (detail[0].level) {
          setLevel0Filter(
            level0Json
              .filter((data) => {
                if (data.levelKey === detail[0].level) {
                  return data.level;
                } else {
                  return null;
                }
              })
              .map((data) => {
                if (data.levelKey === detail[0].level) {
                  return <Fragment key={data.levelKey}>{data.level}</Fragment>;
                } else {
                  return null;
                }
              })
          );
        }
        // LEVEL_SUB1
        if (detail[0].level_sub1) {
          setLevel1Filter(
            level_sub1Json
              .filter((data) => {
                if (data.levelKey === detail[0].level_sub1) {
                  return data.level;
                } else {
                  return null;
                }
              })
              .map((data) => {
                if (data.levelKey === detail[0].level_sub1) {
                  return <Fragment key={data.levelKey}>{data.level}</Fragment>;
                } else {
                  return null;
                }
              })
          );
        }
        // AUTHOR
        if (detail[0].author_type) {
          setAuthorFilter(
            authorJson
              .filter((data) => {
                if (data.authorKey === detail[0].author_type) {
                  return data.author;
                } else {
                  return null;
                }
              })
              .map((data) => {
                if (data.authorKey === detail[0].author_type) {
                  return (
                    <Fragment key={data.authorKey}>{data.author}</Fragment>
                  );
                } else {
                  return null;
                }
              })
          );
        }
        if (detail[0].author_type) {
          setAuthorPatentFilter(
            authorPatentJson
              .filter((data) => {
                if (data.authorKey === detail[0].author_type) {
                  return data.author;
                } else {
                  return null;
                }
              })
              .map((data) => {
                if (data.authorKey === detail[0].author_type) {
                  return (
                    <Fragment key={data.authorKey}>{data.author}</Fragment>
                  );
                } else {
                  return null;
                }
              })
          );
        }
        if (detail[0].author_type) {
          setAuthorPettyPatentFilter(
            authorPettyPatentJson
              .filter((data) => {
                if (data.authorKey === detail[0].author_type) {
                  return data.author;
                } else {
                  return null;
                }
              })
              .map((data) => {
                if (data.authorKey === detail[0].author_type) {
                  return (
                    <Fragment key={data.authorKey}>{data.author}</Fragment>
                  );
                } else {
                  return null;
                }
              })
          );
        }
        if (detail[0].author_type) {
          setAuthorCopyRightFilter(
            authorCopyRightJson
              .filter((data) => {
                if (data.authorKey === detail[0].author_type) {
                  return data.author;
                } else {
                  return null;
                }
              })
              .map((data) => {
                if (data.authorKey === detail[0].author_type) {
                  return (
                    <Fragment key={data.authorKey}>{data.author}</Fragment>
                  );
                } else {
                  return null;
                }
              })
          );
        }

        //  ARTICLE
        if (detail[0].article_type) {
          setArticleFilter(
            articleJson
              .filter((data) => {
                if (data.articleKey === detail[0].article_type) {
                  return data.article;
                } else {
                  return null;
                }
              })
              .map((data) => {
                if (data.articleKey === detail[0].article_type) {
                  return (
                    <Fragment key={data.articleKey}>{data.article}</Fragment>
                  );
                } else {
                  return null;
                }
              })
          );
        }
        // STATUS
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
        }
        // TAGS
        if (detail[0].tags) {
          setTagFilter(
            detail[0].tags.map((data) => {
              if (data) {
                return <Fragment key={data._id}>{data.text}, </Fragment>;
              } else {
                return null;
              }
            })
          );
        }
        // Student
        detail
          ? detail[0]
            ? detail[0].student
              ? setStudentFilter(
                  detail[0].student.map((data) => {
                    if (data) {
                      return <Fragment key={data._id}>{data.text}, </Fragment>;
                    } else {
                      return null;
                    }
                  })
                )
              : setStudentFilter(null)
            : setStudentFilter(null)
          : setStudentFilter(null);

        if (detail[0].note) {
          setNoteFilter(detail[0].note);
        }
        if (detail[0].file_name) {
          setUploadFilter(conResearch + detail[0].file_path);
        }
      } else {
        props.history.push("/research");
      }
    }
    if (!detail) {
      props.history.push("/research");
    }
    // checkout date?
    checkout_date
      ? checkout_date[0]
        ? checkout_date[0].status === "open"
          ? Date.parse(checkout_date[0].datetime) <= currentDateUnix
            ? setCloseSubmit(true)
            : setCloseSubmit(false)
          : setCloseSubmit(false)
        : setCloseSubmit(false)
      : setCloseSubmit(false);

    // eslint-disable-next-line
  }, [detail]);

  //UploadFilterChange
  useEffect(() => {
    if (UploadFilter) {
      // console.log(UploadFilter);
    }
  }, [UploadFilter]);

  useEffect(() => {
    if (GoEdit) {
      props.history.push("/research/edit");
      dispatch({ type: "PAGE_LOADING" });
      setGoEdit(false);
    }
    // eslint-disable-next-line
  }, [GoEdit]);

  const toggleEdit = () => {
    setGoEdit(true);
  };

  // Button PDF
  const togglePDF = () => {
    window.open(UploadFilter);
  };

  return (
    <Fragment>
      <Container>
        <BackToResearchPage />
      </Container>
      {detail ? (
        detail[0] ? (
          <Fragment>
            <Container>
              <h4>รายละเอียด</h4>
              <br />
              <Table hover responsive>
                <tbody>
                  <tr>
                    <th scope="row">วันที่ส่งแบบฟอร์ม</th>
                    <td>{dateFormat(detail[0].createdAt)}</td>
                  </tr>
                  <tr>
                    <th scope="row">ชื่อบทความวิจัย:</th>
                    <td>{detail[0].research_name}</td>
                  </tr>
                  {detail[0].research_name_th ? (
                    <tr>
                      <th scope="row">ชื่อบทความวิจัย (ภาษาไทย):</th>
                      <td>{detail[0].research_name_th}</td>
                    </tr>
                  ) : null}

                  <tr>
                    <th scope="row">ประเภทการเผยแพร่บทความวิจัย:</th>
                    <td>{ArticleFilter}</td>
                  </tr>

                  {detail[0].article_type === "PATENT" ||
                  detail[0].article_type === "PETTY-PATENT" ? (
                    <Fragment>
                      <tr>
                        <th scope="row">ประเภทสิทธิบัตร, อนุสิทธิบัตร:</th>
                        <td>{detail[0].article_type_name[0].type_name}</td>
                      </tr>
                      <tr>
                        <th scope="row">เลขที่คำขอ:</th>
                        <td>
                          {detail[0].article_type_name[0].request_number
                            ? detail[0].article_type_name[0].request_number
                            : null}
                        </td>
                      </tr>
                    </Fragment>
                  ) : detail[0].article_type === "COPYRIGHT" ? (
                    <Fragment>
                      <tr>
                        <th scope="row">ประเภทลิขสิทธิ์:</th>
                        <td>{detail[0].article_type_name[0].type_name}</td>
                      </tr>
                      <tr>
                        <th scope="row">เลขที่คำขอ:</th>
                        <td>
                          {detail[0].article_type_name[0].request_number
                            ? detail[0].article_type_name[0].request_number
                            : null}
                        </td>
                      </tr>
                    </Fragment>
                  ) : detail[0].article_type === "JOURNAL" ? (
                    <Fragment>
                      <tr>
                        <th scope="row">ชื่อวารสาร:</th>
                        <td>
                          {detail[0].article_type_name[0].journal_name
                            ? detail[0].article_type_name[0].journal_name
                            : null}
                        </td>
                      </tr>
                    </Fragment>
                  ) : detail[0].article_type === "CONFERENCE" ? (
                    <Fragment>
                      <tr>
                        <th scope="row">ชื่องานประชุมวิชาการ:</th>
                        <td>{detail[0].conf[0].conf_name}</td>
                      </tr>
                      <tr>
                        <th scope="row">ชื่องานประชุมวิชาการ (ภาษาไทย):</th>
                        <td>{detail[0].conf[0].conf_name_th}</td>
                      </tr>
                      <tr>
                        <th scope="row">ประเทศที่จัดงานประชุมวิชาการ:</th>
                        <td>{detail[0].conf[0].country}</td>
                      </tr>
                      <tr>
                        <th scope="row">จังหวัดที่จัดงานประชุมวิชาการ:</th>
                        <td>{detail[0].conf[0].local_name}</td>
                      </tr>
                    </Fragment>
                  ) : null}
                  {detail[0].article_type === "PATENT" ||
                  detail[0].article_type === "PETTY-PATENT" ||
                  detail[0].article_type === "COPYRIGHT" ? (
                    detail[0].article_type_name[0].register_number ? (
                      <Fragment>
                        <tr>
                          <th scope="row">เลขที่ประกาศ/เลขที่ทะเบียน:</th>
                          <td>
                            {detail[0].article_type_name[0].register_number
                              ? detail[0].article_type_name[0].register_number
                              : null}
                          </td>
                        </tr>
                      </Fragment>
                    ) : null
                  ) : null}

                  {detail[0].article_type === "PATENT" ? (
                    <Fragment>
                      <tr>
                        <th scope="row">ปีที่ยื่นขอจดสิทธิบัตร</th>
                        <td>{detail[0].research_year}</td>
                      </tr>
                      <tr>
                        <th scope="row">ระดับการยื่นขอจดสิทธิบัตร</th>
                        <td>{Level0Filter}</td>
                      </tr>
                      <tr>
                        <th scope="row">บทบาทของผู้ยื่นขอจดสิทธิบัตร</th>
                        <td>{AuthorPatentFilter}</td>
                      </tr>
                    </Fragment>
                  ) : detail[0].article_type === "PETTY-PATENT" ? (
                    <Fragment>
                      <tr>
                        <th scope="row">ปีที่ยื่นขอจดอนุสิทธิบัตร</th>
                        <td>{detail[0].research_year}</td>
                      </tr>
                      <tr>
                        <th scope="row">ระดับการยื่นขอจดอนุสิทธิบัตร</th>
                        <td>{Level0Filter}</td>
                      </tr>
                      <tr>
                        <th scope="row">บทบาทของผู้ยื่นขอจดอนุสิทธิบัตร</th>
                        <td>{AuthorPettyPatentFilter}</td>
                      </tr>
                    </Fragment>
                  ) : detail[0].article_type === "COPYRIGHT" ? (
                    <Fragment>
                      <tr>
                        <th scope="row">ปีที่ยื่นขอจดลิขสิทธิ์</th>
                        <td>{detail[0].research_year}</td>
                      </tr>
                      <tr>
                        <th scope="row">ระดับการยื่นขอจดลิขสิทธิ์</th>
                        <td>{Level0Filter}</td>
                      </tr>
                      <tr>
                        <th scope="row">บทบาทของผู้ยื่นขอจดลิขสิทธิ์</th>
                        <td>{AuthorCopyRightFilter}</td>
                      </tr>
                    </Fragment>
                  ) : null}
                  {detail[0].article_type === "CONFERENCE" ? (
                    <Fragment>
                      <tr>
                        <th scope="row">เดือนที่เผยแพร่บทความวิจัย:</th>
                        <td>
                          {detail[0].conf[0].research_month
                            ? detail[0].conf[0].research_month
                            : null}
                        </td>
                      </tr>
                    </Fragment>
                  ) : null}
                  {detail[0].article_type === "JOURNAL" ||
                  detail[0].article_type === "CONFERENCE" ? (
                    <Fragment>
                      <tr>
                        <th scope="row">ปีที่เผยแพร่บทความวิจัย</th>
                        <td>{detail[0].research_year}</td>
                      </tr>
                      <tr>
                        <th scope="row">ระดับการนำเสนอบทความวิจัย</th>
                        <td>{Level0Filter}</td>
                      </tr>
                      <tr>
                        <th scope="row">บทบาทของผู้นิพนธ์บทความวิจัย</th>
                        <td>{AuthorFilter}</td>
                      </tr>
                    </Fragment>
                  ) : null}
                  {detail[0].article_type === "JOURNAL" ||
                  detail[0].article_type === "CONFERENCE" ? (
                    <Fragment>
                      <tr>
                        <th scope="row">ระดับคุณภาพบทความวิจัยวิชาการ</th>
                        <td>{Level1Filter}</td>
                      </tr>
                      <tr>
                        <th scope="row">ฐานข้อมูลที่เผยแพร่บทความวิจัย</th>
                        <td>
                          {detail[0].level_sub2 === "NON-DB"
                            ? "ไม่อยู่ในฐานข้อมูล"
                            : detail[0].level_sub2}
                        </td>
                      </tr>
                    </Fragment>
                  ) : null}
                  {(detail[0].article_type === "JOURNAL" &&
                    detail[0].quartile !== null) ||
                  (detail[0].article_type === "CONFERENCE" &&
                    detail[0].quartile !== null) ? (
                    <tr>
                      <th scope="row">
                        ระดับ Quartile ของบทความวิจัยที่เผยแพร่
                      </th>
                      <td>{detail[0].quartile}</td>
                    </tr>
                  ) : null}
                  {UploadFilter ? (
                    <tr>
                      <th scope="row">PDF File:</th>
                      <td>
                        <Button color="info" size="sm" onClick={togglePDF}>
                          PDF File
                        </Button>
                      </td>
                    </tr>
                  ) : null}
                  <tr>
                    <th scope="row">keywords</th>
                    <td>
                      {TagFilter && TagFilter.toString().length !== 0
                        ? TagFilter
                        : "ไม่มี keyword"}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">รายชื่อนิสิตที่ร่วม</th>
                    <td>
                      {StudentFilter ? StudentFilter : "ไม่มีนิสิตเข้าร่วม"}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Container>
            <Container>
              <h4>สถานะล่าสุด</h4>
              <Table hover responsive>
                <tbody>
                  <tr>
                    <th scope="row">สถานะ:</th>
                    <td
                      style={
                        detail[0].status === "WAITING"
                          ? { color: "blue" }
                          : detail[0].status === "WAITINGADMIN"
                          ? { color: "blue" }
                          : detail[0].status === "EDIT"
                          ? { color: "blue" }
                          : detail[0].status === "REJECT"
                          ? { color: "red" }
                          : detail[0].status === "APPROVED"
                          ? { color: "green" }
                          : { color: "none" }
                      }
                    >
                      {StatusFilter}
                    </td>
                  </tr>
                  {NoteFilter ? (
                    <tr>
                      <th scope="row">รายละเอียด:</th>
                      <td style={{ color: "red" }}>{NoteFilter}</td>
                    </tr>
                  ) : null}
                  {researchUser.position === "ADMIN" ||
                  (researchUser.position === "COMMITTEE" &&
                    detail[0].committee !== null) ? (
                    <>
                      <tr>
                        <th scope="row">กรรมการที่รับผิดชอบ:</th>
                        <td style={{ color: "blue" }}>{detail[0].committee}</td>
                      </tr>
                    </>
                  ) : null}
                  {researchUser.position === "ADMIN" &&
                  detail[0].admin !== null ? (
                    <>
                      <tr>
                        <th scope="row">ฝ่ายวิจัยที่รับผิดชอบ:</th>
                        <td style={{ color: "blue" }}>{detail[0].admin}</td>
                      </tr>
                    </>
                  ) : null}
                </tbody>
              </Table>
              {researchUser.position === "COMMITTEE" &&
              detail[0].status === "WAITING" ? (
                detail[0].committee === user.buasri_id ||
                detail[0].committee === null ? (
                  CloseSubmit ? (
                    <Button disabled>หมดเวลาการตรวจบทความวิจัย</Button>
                  ) : (
                    <UpdateStatusModal />
                  )
                ) : null
              ) : null}
              {researchUser.position === "ADMIN" &&
              detail[0].status === "WAITINGADMIN" ? (
                detail[0].admin === user.buasri_id ||
                detail[0].admin === null ? (
                  <UpdateStatusModal />
                ) : null
              ) : null}
              {detail[0].status === "EDIT" &&
              detail[0].buasri_id === user.buasri_id ? (
                CloseSubmit ? (
                  <Button disabled>หมดเวลาการตรวจบทความวิจัย</Button>
                ) : (
                  <Button onClick={toggleEdit} color="warning">
                    แก้ไขข้อมูล
                  </Button>
                )
              ) : null}
            </Container>
          </Fragment>
        ) : null
      ) : null}
    </Fragment>
  );
};

export default withRouter(connect(null, null)(ResearchDetailPage));
