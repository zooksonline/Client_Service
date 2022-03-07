import React from "react";
const NewLineToBr = ({ children = "" }) => {
  return children.split("\n").reduce(function (arr, line) {
    return arr.concat(line, <br />);
  }, []);
};

export default NewLineToBr;
