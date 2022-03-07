import React, { useState, Fragment, useEffect } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Table, Label, Button, Pagination, PaginationLink } from "reactstrap";
import PropTypes from "prop-types";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  useBlockLayout,
  useResizeColumns,
  useColumnOrder,
  usePagination,
} from "react-table";
import { withRouter } from "react-router-dom";

// Project Detail
import { getdetail_project } from "../../../actions/research/projectAction";
//

// CSS
import "../../../utilis/research/style_maintable.css";

const ProjectTableAdmin = (props) => {
  // Main
  const token = useSelector((state) => state.main.auth.token);
  const fetchdata = useSelector((state) => state.research.projectlist.list);
  const [data, setdata] = useState([
    { _id: 0 },
    { buasri_id: null },
    { name: null },
    { funds: 0 },
    { status: null },
  ]);
  // // Trigger
  // const detail_page = useSelector(
  //   (state) => state.research.trigger.detail_page
  // );

  const dispatch = useDispatch();

  ProjectTableAdmin.propTypes = {
    getdetail_project: PropTypes.func.isRequired,
  };
  const { getdetail_project } = props;

  // //// ใช้ไม่ได้เพราะซ้ำซ้อน
  // // trigger
  // useEffect(() => {
  //   if (detail_page) {
  //     const GotoDetailPage = async () => {
  //       await dispatch({ type: "PAGE_LOADING" });
  //       await props.history.push("/research/project/detail");
  //     };
  //     GotoDetailPage();
  //   }
  //   // eslint-disable-next-line
  // }, [detail_page]);

  // นำข้อมูลลง data
  useEffect(() => {
    if (fetchdata) {
      setdata(fetchdata);
    }
    // eslint-disable-next-line
  }, [fetchdata]);

  const columns = React.useMemo(
    () => [
      // { Header: "เวลา", accessor: "created" },
      { Header: "buasri_id", accessor: "buasri_id" },
      { Header: "ชื่อโครงการวิจัย", accessor: "name" },
      {
        Header: "สถานะ",
        accessor: "status",
        filter: "includes",
        Cell: ({ cell }) => (
          <Fragment>
            {cell.row.values.status === "WAITING" ? (
              <p className="waiting">รอตรวจสอบ</p>
            ) : null}
            {cell.row.values.status === "WAITINGADMIN" ? (
              <p className="waitingadmin">รอฝ่ายวิจัยตรวจสอบ</p>
            ) : null}
            {cell.row.values.status === "EDIT" ? (
              <p className="edit">แก้ไขรายละเอียด</p>
            ) : null}
            {cell.row.values.status === "REJECT" ? (
              <p className="reject">ยกเลิก</p>
            ) : null}
            {cell.row.values.status === "APPROVED" ? (
              <p className="success">ผ่านการตรวจสอบ</p>
            ) : null}
          </Fragment>
        ),
      },
      {
        Header: "จำนวนเบิก",
        accessor: "funds",
        filter: "includes",
      },
      {
        Header: "รายละเอียด",
        accessor: "_id",
        Filter: "",
        Cell: ({ cell }) => (
          <Button
            value={[cell.row.values._id, cell.row.values.buasri_id]}
            onClick={onClick}
          >
            รายละเอียด
          </Button>
        ),
      },
    ],
    // eslint-disable-next-line
    []
  );
  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length;

    return (
      <input
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Search ${count} records...`}
      />
    );
  }
  function SelectColumnFilterDepart({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
      const options = new Set();
      preFilteredRows.forEach((row) => {
        options.add(row.values[id]);
      });
      return [...options.values()];
    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
      <select
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">ทั้งหมด</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    resetResizing,
    setColumnOrder,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    // Show and Hide
    getToggleHideAllColumnsProps,
    allColumns,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: {
        pageIndex: null,
        sortBy: [{ id: "_id", desc: true }],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  );

  const onClick = async (e) => {
    const getValue = await e.target.value.split(",");
    const Detail = await {
      token: token,
      id: getValue[0],
      buasri_id: getValue[1],
    };
    getdetail_project(Detail);
  };

  return (
    <Fragment>
      {fetchdata ? (
        <Fragment>
          {allColumns.map((column) => (
            // column.id จะเป็นชื่อ accessor
            <div
              key={column.render("Header")}
              style={{
                display: "inline-block",
                marginLeft: "15px",
                justifyContent: "center",
                alignItem: "center",
              }}
            >
              <label className="frozen">
                <input type="checkbox" {...column.getToggleHiddenProps()} />{" "}
                {column.render("Header")}
              </label>
            </div>
          ))}
          <Table {...getTableProps()} responsive className="table-bordered">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                      <div>
                        {column.canFilter ? column.render("Filter") : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
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
        </Fragment>
      ) : (
        <Fragment>ไม่มีข้อมูล</Fragment>
      )}
    </Fragment>
  );
};

export default withRouter(
  connect(null, {
    getdetail_project,
  })(ProjectTableAdmin)
);
