import React, { useState, Fragment, useEffect } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Table, Label, Button, Pagination, PaginationLink } from "reactstrap";

import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  useFilters,
  usePagination,
} from "react-table";
import { withRouter } from "react-router-dom";
import { getdetail_list } from "../../actions/research/listAction";

// CSS
import "../../utilis/research/style_maintable.css";

const MainTableUser = (props) => {
  // Main
  const token = useSelector((state) => state.main.auth.token);
  const fetchdata = useSelector((state) => state.research.list.list);
  const [data, setdata] = useState([
    { _id: 0 },
    { buasri_id: null },
    { name: null },
    { status: null },
  ]);
  // Trigger
  const detail_page = useSelector(
    (state) => state.research.trigger.detail_page
  );

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
  };

  // const IndeterminateCheckbox = React.forwardRef(
  //   ({ indeterminate, ...rest }, ref) => {
  //     const defaultRef = React.useRef();
  //     const resolvedRef = ref || defaultRef;

  //     React.useEffect(() => {
  //       resolvedRef.current.indeterminate = indeterminate;
  //     }, [resolvedRef, indeterminate]);

  //     return <input type="checkbox" ref={resolvedRef} {...rest} />;
  //   }
  // );

  // trigger
  useEffect(() => {
    if (detail_page) {
      const GotoDetailPage = async () => {
        await dispatch({ type: "PAGE_LOADING" });
        await props.history.push("/research/detail");
      };
      GotoDetailPage();
    }
    // eslint-disable-next-line
  }, [detail_page]);

  useEffect(() => {
    if (fetchdata) {
      setdata(fetchdata);
    }
    // eslint-disable-next-line
  }, [fetchdata]);

  const columns = React.useMemo(
    () => [
      { Header: "buasri_id", accessor: "buasri_id" },
      {Header: "??????????????????????????????", accessor: d => `${d.firstname} ${d.lastname}` },
      { Header: "????????????????????????????????????", accessor: "name" },
      {
        Header: "???????????????",
        accessor: "status",
        Filter: SelectColumnFilterStatus,
        filter: "includes",
        Cell: ({ cell }) => (
          <Fragment>
            {cell.row.values.status === "WAITING" ? (
              <p className="waiting">????????????????????????????????????????????????</p>
            ) : null}
            {cell.row.values.status === "WAITINGADMIN" ? (
              <p className="waitingadmin">??????????????????????????????????????????????????????</p>
            ) : null}
            {cell.row.values.status === "EDIT" ? (
              <p className="edit">?????????????????????????????????????????????</p>
            ) : null}
            {cell.row.values.status === "REJECT" ? (
              <p className="reject">??????????????????</p>
            ) : null}
            {cell.row.values.status === "APPROVED" ? (
              <p className="success">??????????????????????????????????????????</p>
            ) : null}
          </Fragment>
        ),
      },
      {
        Header: "??????????????????????????????",
        accessor: "_id",
        Filter: "",
        Cell: ({ cell }) => (
          <Button
            value={[cell.row.values._id, cell.row.values.buasri_id]}
            onClick={onClick}
          >
            ??????????????????????????????
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
  function SelectColumnFilterStatus({
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
        <option value="">?????????????????????</option>
        <option value="WAITING">????????????????????????????????????????????????</option>
        <option value="WAITINGADMIN">??????????????????????????????????????????????????????</option>
        <option value="EDIT">?????????????????????????????????????????????</option>
        <option value="REJECT">??????????????????</option>
        <option value="APPROVED">??????????????????????????????????????????</option>
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
        hiddenColumns: ["buasri_id", "status"],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <Fragment>
      {fetchdata ? (
        <Fragment>
          <br />
          {/* <div style={{ display: "inline-block" }}>
            <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} />
            ?????????????????????????????????
          </div> */}
          {allColumns.map((column) => (
            // column.id ?????????????????????????????? accessor
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
          <Pagination style={{ display: "row", justifyContent: "center" }}>
            <PaginationLink
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
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
      ) : null}
    </Fragment>
  );
};

export default withRouter(connect(null, { getdetail_list })(MainTableUser));
