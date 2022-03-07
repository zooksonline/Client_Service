import React, { Fragment, useState, useEffect } from "react";
import { DropdownItem } from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { logout } from "../../actions/main/authAction";

const Logout = (props) => {
  Logout.propTypes = {
    logout: PropTypes.func.isRequired,
  };

  const [Tologout, setTologout] = useState(false);
  const { logout } = props;
  useEffect(() => {
    if (Tologout) {
      const removeID = async () => {
        await logout();
      };
      removeID();
    }
    // eslint-disable-next-line
  }, [Tologout]);
  return (
    <Fragment>
      <DropdownItem onClick={() => setTologout(true)}>ลงชื่อออก</DropdownItem>
    </Fragment>
  );
};

export default connect(null, { logout })(Logout);
