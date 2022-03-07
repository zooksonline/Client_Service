import React, { Fragment } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Table, Label, Button, Pagination, PaginationLink } from "reactstrap";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
} from "react-table";
import { withRouter } from "react-router-dom";

import { getdetail_list } from "../../actions/complaint/listAction";

const MainTableUser = (props) => {
  // Complaint
  const data = useSelector((state) => state.complaint.list.list);
  const token = useSelector((state) => state.main.auth.token);
  const dispatch = useDispatch();

  MainTableUser.propTypes = {
    getdetail_list: PropTypes.func.isRequired,
  };

  const { getdetail_list } = props;
  const onClick = async (e) => {
    const getValue = await e.target.value.split(",");
    const Detail = await {
      token: token,
      id: getValue[0],
      buasri_id: getValue[1],
    };
    // console.log(getValue);
    await getdetail_list(Detail);
    await dispatch({ type: "PAGE_LOADING" });
    await props.history.push("/complaint/detail");
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Buasri ID",
        accessor: "buasri_id",
      },
      {
        Header: "ประเภท",
        accessor: "type",
        Cell: ({ cell }) => (
          <p>
            {cell.row.values.type === "BUILDING" ? "อาคารและสถานที่" : null}
            {cell.row.values.type === "LEARNING" ? "การเรียนการสอน" : null}
            {cell.row.values.type === "ACTIVITY" ? "กิจกรรม" : null}
            {cell.row.values.type === "SERVICES" ? "การบริการ" : null}
            {cell.row.values.type === "OTHER" ? "อื่น ๆ" : null}
          </p>
        ),
      },
      {
        Header: "หัวข้อ",
        accessor: "topic",
      },
      {
        Header: "สถานะ",
        accessor: "status",
        Cell: ({ cell }) => (
          <p>
            {cell.row.values.status === "WAITING" ? "รอรับเรื่อง" : null}
            {cell.row.values.status === "RECEIVED"
              ? "รับเรื่องแล้ว รอพิจารณา"
              : null}
            {cell.row.values.status === "CONSIDERING" ? "กำลังพิจารณา" : null}
            {cell.row.values.status === "EDIT"
              ? "ต้องการข้อมูลเพิ่มเติม รอข้อมูลจากผู้แจ้ง"
              : null}
            {cell.row.values.status === "RESULT" ? "เสร็จสิ้นการพิจารณา" : null}
          </p>
        ),
      },
      {
        Header: "รายละเอียด",
        accessor: "_id",
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

  // Define a default UI for filtering
  function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
      setGlobalFilter(value || undefined);
    }, 1500);

    return (
      <span>
        Search:{" "}
        <input
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={`${count} records...`}
          style={{
            fontSize: "1.1rem",
            border: "0",
          }}
        />
      </span>
    );
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    state: { pageIndex, pageSize },
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: null },
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <Fragment>
      <br />
      <br />
      <Table>
        <thead>
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: "left",
              }}
            >
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
        </thead>
      </Table>
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
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
      <Pagination>
        <PaginationLink onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </PaginationLink>{" "}
        <PaginationLink
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {"<"}
        </PaginationLink>{" "}
        <PaginationLink onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </PaginationLink>{" "}
        <PaginationLink
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </PaginationLink>{" "}
        <PaginationLink disabled>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </PaginationLink>
        <PaginationLink>
          <Label>| Go to page:</Label>{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </PaginationLink>{" "}
        <PaginationLink>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </PaginationLink>
      </Pagination>
    </Fragment>
  );
};

export default withRouter(connect(null, { getdetail_list })(MainTableUser));
