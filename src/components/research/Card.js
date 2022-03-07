import React, { Fragment } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Button,
} from "reactstrap";
import { withRouter } from "react-router-dom";
import { connect, useSelector, useDispatch } from "react-redux";
import image from "../../images/PicResearch.png";

const CardResearch = (props) => {
  const auth = useSelector((state) => state.main.auth.user);
  const dispatch = useDispatch();

  const imgStyle = {
    maxWidth: 300,
  };

  const onClick = async (e) => {
    e.preventDefault();
    await dispatch({ type: "PAGE_LOADING" });
    await props.history.push("/research");
  };

  return (
    <Fragment>
      <Card>
        <CardImg
          className="align-self-center"
          top
          width="100%"
          src={image}
          style={imgStyle}
          alt="Card image cap"
        />
        <CardBody>
          <CardTitle>
            <h4>Research</h4>
          </CardTitle>
          <CardText>
            จัดการข้อมูลงานวิจัย - เพิ่ม แก้ไข และอัพเดตข้อมูลงานวิจัย
            ภายในคณะวิทยาศาสตร์
          </CardText>
          {auth ? (
            <Fragment>
              <Button color="dark" onClick={onClick} block>
                เข้าใช้งาน
              </Button>
            </Fragment>
          ) : (
            <Fragment></Fragment>
          )}
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default withRouter(connect(null, null)(CardResearch));
