import React, { Fragment, useState } from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";
import { Table, Row, Col, Button, Input } from "reactstrap";
import { Filter, DefaultColumnFilter } from "./filter";
import dashboard from "../images/Dashboard.svg";
import "../css/Table.css";
import DashboardModal from "./dashboard";
import LinkedInIcon from "../images/LinkedIn.svg";
import Location from "../images/location.svg";

const TableView = ({
  columns,
  data,
  renderRowSubComponent,
  source,
  companyPages,
  isPageLinks,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: { pageIndex: 0, pageSize: 20 },
    },
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  const [show, setShow] = useState("");
  const [rowData, setRowData] = useState("");
  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };

  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };

  return (
    <Fragment>
      <div style={{ maxHeight: "50rem", overflow: "auto" }}>
        <Table bordered hover {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    <div {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                    </div>
                    <Filter column={column} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {source === "ABN" ||
          source === "Dashboard" ||
          source === "Locations" ? (
            !(data?.length > 0) ? (
              <>
                <div
                  style={{ marginTop: "250px", marginLeft: "700px" }}
                  className="spinner"
                ></div>
              </>
            ) : (
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <Fragment key={row.getRowProps().key}>
                      <tr>
                        {row?.cells?.map((cell) => {
                          return !["LinkedIn", "Linkedin", "Location"].includes(
                            cell?.column?.Header
                          ) &&
                            (cell?.value === undefined ||
                              cell?.value === "") ? (
                            <td>---</td>
                          ) : cell?.column?.Header === "LinkedIn" ? (
                            <td {...cell.getCellProps()}>
                              <a href={row?.Link}>
                                <img
                                  src={LinkedInIcon}
                                  style={{
                                    filter:
                                      "invert(25%) sepia(82%) saturate(1686%) hue-rotate(195deg) brightness(99%) contrast(96%)",
                                  }}
                                />
                              </a>
                            </td>
                          ) : cell?.column?.Header === "Location" ? (
                            <td {...cell.getCellProps()}>
                              <a
                                href={
                                  data[cell.row.id]?.["Get Directions Link"]
                                }
                              >
                                <img
                                  src={Location}
                                  style={{
                                    filter:
                                      "invert(25%) sepia(82%) saturate(1686%) hue-rotate(195deg) brightness(99%) contrast(96%)",
                                  }}
                                />
                              </a>
                            </td>
                          ) : cell?.column?.Header === "Linkedin" &&
                            isPageLinks ? (
                            <td {...cell.getCellProps()}>
                              <a
                                href={
                                  companyPages?.filter(
                                    (x) =>
                                      x.code ===
                                      data[cell.row.id]?.["Country Code"]
                                  )?.length > 0
                                    ? companyPages
                                        ?.filter(
                                          (x) =>
                                            x.code ===
                                            data[cell.row.id]?.["Country Code"]
                                        )
                                        .map((x) => x?.url)
                                    : "https://in.linkedin.com/company/accentureindia"
                                }
                              >
                                <img
                                  src={LinkedInIcon}
                                  style={{
                                    filter:
                                      "invert(25%) sepia(82%) saturate(1686%) hue-rotate(195deg) brightness(99%) contrast(96%)",
                                  }}
                                />
                              </a>
                            </td>
                          ) : (
                            <td {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                      {row.isExpanded && (
                        <tr>
                          <td colSpan={visibleColumns.length}>
                            {renderRowSubComponent(row)}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            )
          ) : (
            source === "companies" && (
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <Fragment key={row.getRowProps().key}>
                      <tr>
                        {row.cells.map((cell) => {
                          return (cell.column.Header !== "Dashboard" &&
                            cell.value === undefined) ||
                            cell.value === "" ? (
                            <td>---</td>
                          ) : cell.column.Header === "Company Name" ? (
                            <td {...cell.getCellProps()}>
                              <img
                                src={data[cell.row.id].Logo}
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  paddingRight: "12px",
                                }}
                              />
                              <a href={data[cell.row.id].Website}>
                                {cell.render("Cell")}
                              </a>
                            </td>
                          ) : cell.column.Header === "Dashboard" ? (
                            <>
                              <img
                                src={dashboard}
                                className="center"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  paddingRight: "12px",
                                  filter:
                                    "invert(25%) sepia(90%) saturate(3508%) hue-rotate(214deg) brightness(105%) contrast(98%)",
                                }}
                                onClick={() => {
                                  setShow("SHOW");
                                  setRowData(data[cell.row.id]);
                                }}
                              />
                            </>
                          ) : cell.column.Header === "Specialties" ? (
                            <td {...cell.getCellProps()}>
                              {data[cell.row.id].Specialties.split(",").map(
                                (Specialtie) => {
                                  return (
                                    <>
                                      <div class="basic-chip background-primary">
                                        {Specialtie.replace("and", "")}
                                      </div>
                                    </>
                                  );
                                }
                              )}
                            </td>
                          ) : (
                            <td {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                      {row.isExpanded && (
                        <tr>
                          <td colSpan={visibleColumns.length}>
                            {renderRowSubComponent(row)}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            )
          )}
        </Table>
      </div>
      {page.length >= 10 && (
        <Row
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          <Col md={3}>
            <Button
              color="primary"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {"<<Start"}
            </Button>{" "}
            <Button
              color="primary"
              onClick={previousPage}
              disabled={!canPreviousPage}
            >
              {"<Prev"}
            </Button>
          </Col>
          <Col md={2} style={{ marginTop: 7 }}>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </Col>
          <Col md={2}>
            <Input
              type="number"
              min={1}
              style={{ width: 70 }}
              max={pageOptions.length}
              defaultValue={pageIndex + 1}
              onChange={onChangeInInput}
            />
          </Col>
          <Col md={2}>
            <Input type="select" value={pageSize} onChange={onChangeInSelect}>
              >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Input>
          </Col>
          <Col md={3}>
            <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
              {"Next >"}
            </Button>{" "}
            <Button
              color="primary"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {"End >>"}
            </Button>
          </Col>
        </Row>
      )}
      <DashboardModal show={show} setShow={setShow} modalData={rowData} />¯
    </Fragment>
  );
};

export default TableView;
