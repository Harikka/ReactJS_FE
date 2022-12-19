import "./App.css";
import { useEffect, useMemo, useState } from "react";
import TableView from "./components/Table";
import { Col, Container, Input, Row } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { SelectColumnFilter } from "./components/filter";
import "./css/Table.css";

function App() {
  const [data, setData] = useState([]);
  const [source, setSource] = useState("ABN");
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "MainEntity.NonIndividualName.NonIndividualNameText",
      },
      {
        Header: "Entity Type",
        accessor: "EntityType.EntityTypeText",
        Filter: SelectColumnFilter,
        filter: "equals",
      },
      {
        Header: "ABN",
        accessor: "ABN",
      },
      {
        Header: "PostCode",
        accessor: "MainEntity.BusinessAddress.AddressDetails.Postcode",
      },
      {
        Header: "State",
        accessor: "MainEntity.BusinessAddress.AddressDetails.State",
        Filter: SelectColumnFilter,
        filter: "equals",
      },
    ],
    []
  );

  const companyColumns = useMemo(
    () => [
      {
        Header: "Company Name",
        accessor: "CompanyName",
      },
      {
        Header: "Industry",
        accessor: "Industries",
      },
      { Header: "Specialties", accessor: "Specialties" },
      {
        Header: "HeadQuarters",
        accessor: "Headquarters",
      },
      {
        Header: "Type",
        accessor: "Type",
        Filter: SelectColumnFilter,
        filter: "equals",
      },
      { Header: "Dashboard" },
    ],
    []
  );

  const onChangeInSelect = (event) => {
    setSource(event.target.value);
  };

  useEffect(() => {
    const doFetch = async () => {
      const response = await fetch(`http://localhost:9050/${source}`);
      const body = await response.json();
      source === "ABN" ? setData(body.Transfer.ABR) : setData(body);
    };
    doFetch();
  }, [source]);

  return (
    <Container style={{ marginTop: 50, maxWidth: "1600px !important" }}>
      <Row>
        <Col md={2} style={{ marginTop: 7 }}>
          <strong>Select Source</strong>
        </Col>
        <Col md={2} style={{ marginLeft: "-90px" }}>
          <Input
            type="select"
            value={source}
            onChange={(e) => onChangeInSelect(e)}
          >
            >
            {["ABN", "companies"].map((sourceSel) => (
              <option value={sourceSel}>{sourceSel}</option>
            ))}
          </Input>
        </Col>
      </Row>
      <br />
      {source === "ABN" ? (
        <TableView columns={columns} data={data} source={source} />
      ) : (
        <TableView columns={companyColumns} data={data} source={source} />
      )}
    </Container>
  );
}

export default App;
