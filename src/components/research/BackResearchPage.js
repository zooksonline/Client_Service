import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from "reactstrap";
import { PAGE_LOADING } from "../../type/main/type";

const BackToResearchPage = (props) => {
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch({ type: PAGE_LOADING });
    props.history.push("/research");
  };

  return (
    <Fragment>
      <Button
        name="button"
        color="danger"
        className="float-right"
        onClick={onClick}
      >
        กลับหน้ารายการวิจัย
      </Button>
    </Fragment>
  );
};

export default withRouter(BackToResearchPage);
