import React, { useState, useEffect, Fragment, useMemo } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Container, Table, Button } from "reactstrap";
import { withRouter } from "react-router-dom";

// JSON

// Env
import { config } from "../../../../utilis/config";

const ResearchProjectDetailPage = (props) => {
  const user = useSelector((state) => state.main.auth.user);
  const [fetch, setfetch] = useState(true);
  const detail = useSelector((state) => state.research.projectlist.detail);
  const [UploadFilter, setUploadFilter] = useState(null);
  // config
  const conResearch = config.connectResearchAPI;

  useMemo(() => {
    if (detail && fetch) {
      setfetch(false);
      console.log("inhere");
    }
  }, [detail]);

  // Button PDF
  const togglePDF = () => {
    window.open(UploadFilter);
  };

  return (
    <Fragment>
      <Container>
        <h4>รายละเอียด</h4>
        <br />
        <Table hover responsive>
          <tbody>
            {detail ? (
              <>
                <tr>
                  <th scope="row">ชื่อโครงการวิจัย</th>
                  <td>{detail[0].project_name}</td>
                </tr>
                <tr>
                  <th scope="row">วันที่ส่งแบบฟอร์ม</th>
                  <td>{detail[0].createdAt}</td>
                </tr>
                <tr>
                  <th scope="row">แหล่งทุนวิจัย</th>
                  <td>{detail[0].funds_type}</td>
                </tr>
                <tr>
                  <th scope="row">จำนวนเงินทุน</th>
                  <td>{detail[0].funds}</td>
                </tr>
                <tr>
                  <th scope="row">ประเภทโครงการ</th>
                  <td>{detail[0].project_type}</td>
                </tr>
              </>
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
          </tbody>
        </Table>
      </Container>
    </Fragment>
  );
};

export default withRouter(connect(null, null)(ResearchProjectDetailPage));
