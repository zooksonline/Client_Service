import React, {
  useState,
  // useMemo,
  Fragment,
  useEffect,
} from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  Row,
  Table,
  // Label,
  Button,
  // Pagination,
  // PaginationLink,
} from "reactstrap";
import PropTypes from "prop-types";
import {
  useTable,
  // useGlobalFilter,
  // useAsyncDebounce,
  // usePagination,
} from "react-table";
import { withRouter } from "react-router-dom";

import depJSON from "../../../utilis/typedep.json";
import userJSON from "../../../utilis/typeuser.json";
import { getServiceUser } from "../../../actions/main/serviceAction";

const AdminTable = (props) => {
  const list = useSelector((state) => state.main.list.userlist);
  const token = useSelector((state) => state.main.auth.token);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  AdminTable.propTypes = {
    getServiceUser: PropTypes.func.isRequired,
  };
  const { getServiceUser } = props;
  useEffect(() => {
    if (list) {
      setData(list);
    }
  }, [list]);

  const onClick = async (e) => {
    const getValue = await e.target.value.split(",");
    const Detail = await {
      token: token,
      id: getValue[0],
      buasri_id: getValue[1],
    };
    // console.log(Detail);
    await getServiceUser(Detail);
    await dispatch({ type: "PAGE_LOADING" });
    await props.history.push("/users/active");
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Buasri ID",
        accessor: "buasri_id",
      },
      {
        Header: "ชื่อ - นามสกุล",
        accessor: (name) => `${name.firstname} ${name.lastname}`,
      },
      {
        Header: "ประเภทผู้ใช้",
        accessor: "type",
        Cell: ({ cell }) => (
          <Fragment>
            {userJSON.map((usermap) => {
              if (usermap.type === cell.row.values.type) {
                return <span key={usermap.type}>{usermap.name}</span>;
              } else {
                return null;
              }
            })}
          </Fragment>
        ),
      },
      {
        Header: "สังกัด",
        accessor: "dep",
        Cell: ({ cell }) => (
          <Fragment>
            {depJSON.map((depmap) => {
              if (depmap.currentNameEN === cell.row.values.dep) {
                return (
                  <span key={depmap.currentNameEN}>{depmap.currentNameTH}</span>
                );
              } else {
                return null;
              }
            })}
          </Fragment>
        ),
      },
      {
        Header: "เลือก",
        accessor: "_id",
        Cell: ({ cell }) => (
          <Button
            value={[cell.row.values._id, cell.row.values.buasri_id]}
            onClick={onClick}
          >
            คลิก
          </Button>
        ),
      },
    ],
    // eslint-disable-next-line
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <Fragment>
      <br />
      <Row>
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Row>
    </Fragment>
  );
};

export default withRouter(connect(null, { getServiceUser })(AdminTable));
