import React, { useMemo } from "react";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import TableView from "./Table";
import LinkedIn from "../images/LinkedIn.svg";
import cb from "../images/crunchbase.svg";
import ReactWordcloud from "react-wordcloud";
import info from "../images/info.svg";
import Followers from "../images/Followers.svg";
import { SelectColumnFilter } from "./filter";
import { toUpper } from "lodash";
import "../css/Table.css";

const DashboardView = ({ show, setShow, modalData }) => {
  const employeeColumns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "Name",
      },
      {
        Header: "LinkedIn",
      },
    ],
    []
  );
  const locationColumns = useMemo(
    () => [
      {
        Header: "Address",
        accessor: "Address",
      },
      {
        Header: "Country Code",
        accessor: "Country Code",
        Filter: SelectColumnFilter,
        filter: "equals",
      },
      {
        Header: "Location",
      },
      {
        Header: "Linkedin",
      },
    ],
    []
  );
  const options = {
    colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
    enableTooltip: false,
    deterministic: false,
    fontFamily: "impact",
    fontSizes: [15, 60],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 1,
    rotationAngles: [0],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 0,
  };
  const words = eval(modalData?.SimilarPages)?.map((x, i) => {
    return { text: x?.["page-title"], value: i++ };
  });
  function formatNumber(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

  const affliatedPages = eval(modalData?.AffiliatedPages)?.map((page) => {
    return {
      code: toUpper(new URL(page)?.hostname?.split(".")?.[0]),
      url: page,
    };
  });

  return (
    <Modal
      show={show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={() => {
        setShow(false);
      }}
      dialogClassName="modal-width"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <Row style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
            <Col md={8}>
              <label title={modalData?.CompanyName} className="text-overflow">
                {modalData?.CompanyName}
              </label>
            </Col>
            <Col md={2}>
              <a
                href={modalData?.Website}
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <img
                  src={modalData?.Logo}
                  title="Accern"
                  style={{
                    width: "40px",
                    height: "40px",
                    paddingRight: "13px",
                    paddingLeft: "5px",
                  }}
                />
              </a>
            </Col>
            <Col md={2} style={{ marginLeft: "-10px" }}>
              <img
                src={info}
                style={{ width: "30px", height: "30px" }}
                title={modalData?.Description}
              />
            </Col>
          </Row>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={5}>
            <Row style={{ textAlign: "center" }}>
              <Col md={3}>
                <div class="card" style={{ width: "200px" }}>
                  <div class="card-body">
                    <h5 class="card-title">Total Employees</h5>
                    <p class="card-text">
                      {formatNumber(modalData?.EmployeeCountOnLI)}
                    </p>
                  </div>
                </div>
              </Col>
              <Col>
                <div
                  class="card"
                  style={{ width: "200px", marginLeft: "80px" }}
                >
                  <div class="card-body">
                    <h5 class="card-title">Locations</h5>
                    <p class="card-text">
                      {formatNumber(modalData?.Locations?.length)}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
            <Row
              style={{
                maxWidth: 1000,
                margin: "0 auto",
                textAlign: "center",
                paddingTop: "40px",
              }}
            >
              <Col md={10}>
                <h5 class="card-title" style={{ paddingBottom: "10px" }}>
                  Contacts
                </h5>
                <TableView
                  columns={employeeColumns}
                  data={eval(modalData?.Employees)}
                  source="Dashboard"
                />
              </Col>
            </Row>
            <Row>
              <Col md={11}>
                <ReactWordcloud words={words} options={options} />
              </Col>
            </Row>
          </Col>
          <Col md={7} style={{ marginLeft: "-50px" }}>
            <TableView
              columns={locationColumns}
              data={eval(modalData?.Locations)}
              companyPages={affliatedPages}
              source="Locations"
              isPageLinks={true}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Row style={{ textAlign: "center" }}>
          <Col md={4}>
            <img
              src={Followers}
              title={formatNumber(modalData?.FollowerCount)}
              style={{
                width: "100px",
                height: "40px",
                filter:
                  "invert(25%) sepia(82%) saturate(1686%) hue-rotate(195deg) brightness(99%) contrast(96%)",
              }}
            />
          </Col>
          <Col md={3} style={{ float: "right" }}>
            <a
              href={
                eval("[" + modalData?.FundingInfo + "]")?.[0]?.[
                  "crunchbase-link"
                ]
              }
            >
              <img
                src={cb}
                style={{
                  width: "100px",
                  height: "40px",
                  filter:
                    "invert(25%) sepia(82%) saturate(1686%) hue-rotate(195deg) brightness(99%) contrast(96%)",
                }}
              />
            </a>
          </Col>
          <Col md={5} style={{ float: "right" }}>
            <a href={modalData?.CompanyLIUrl}>
              <img
                src={LinkedIn}
                style={{
                  filter:
                    "invert(25%) sepia(82%) saturate(1686%) hue-rotate(195deg) brightness(99%) contrast(96%)",
                }}
              />
            </a>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default DashboardView;
