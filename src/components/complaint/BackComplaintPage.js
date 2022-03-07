import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from "reactstrap";
import { PAGE_LOADING } from "../../type/main/type";

const BackToComplaintPage = (props) => {
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch({ type: PAGE_LOADING });
    props.history.push("/complaint");
  };

  return (
    <Fragment>
      <Button
        name="button"
        color="danger"
        className="float-right"
        onClick={onClick}
      >
        กลับหน้ารายการร้องเรียน
      </Button>
    </Fragment>
  );
};

export default withRouter(BackToComplaintPage);
