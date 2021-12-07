import React from "react";
import { Container } from "react-bootstrap";
import autoBind from "react-autobind";
import "antd/dist/antd.css";
import { Table, Modal } from "antd";
import InputGroup from "react-bootstrap/InputGroup";
import { FormControl } from "react-bootstrap";
import { Button } from "react-bootstrap";

const columns = [
  {
    title: "Name",
    dataIndex: "primary_name",
    key: "primary_name",
  },
  {
    title: "Primary Profession",
    dataIndex: "primary_profession",
    key: "primary_profession",
  },
  {
    title: "Birth Year",
    dataIndex: "birth_year",
    key: "birth_year",
  },
];

const data = [
  {
    key: "1",
    name: "Daniel Radcliffe",
    profession: "Actor",
    dob: "1989",
  },
  {
    key: "2",
    name: "Emma Watson",
    profession: "Actress",
    dob: "1990",
  },
  {
    key: "3",
    name: "Rupert Grint",
    profession: "Actor",
    dob: "1988",
  },
  {
    key: "4",
    name: "Tom Felton",
    profession: "Actor",
    dob: "1987",
  },
];

const getRowKey = (record) => {
  return `${record.key}`;
};

class CrewCast extends React.Component {
  constructor(props, context) {
    super(props, context);
    autoBind(this);
    this.state = {
      selectedRowKey: null,
      visible: false,
      selectedPerson: null,
      searchValue: "",
      personData: [],
    };
  }

  setRowKey(record) {
    const selectedRowKey = getRowKey(record);
    console.log(record);
    console.log(selectedRowKey, typeof selectedRowKey);
    this.setState({ selectedRowKey });
    this.setState({ record });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

 async searchCrewCast(e) {
    try{
      const resp =  await fetch(`/people?title=${this.state.searchValue}`)
      const data = await resp.json()
      //console.log(data)
      this.setState({ personData: data })
      //console.log(this.state.movieData)
    }catch(err){
      console.log(err)
    }
  }

  render() {
    const { selectedRowKey } = this.state;
    console.log(selectedRowKey, typeof selectedRowKey);

    return (
      <Container align="center">
        <br />
        <h1>CrewCast</h1>
        <br />
        <InputGroup size="lg">
          <Button
            variant="outline-secondary"
            id="crew-cast-search-button"
            onClick={(e) => this.searchCrewCast(e)}
          >
            {" "}
            Search Name
          </Button>
          <FormControl
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
            value={this.state.searchValue}
            onChange={(e) => this.setState({ searchValue: e.target.value })}
          />
        </InputGroup>

        <div className="holder">
          <p></p>
          <Table
            columns={columns}
            rowKey={(record) => getRowKey(record)}
            rowClassName={(record) =>
              getRowKey(record) === selectedRowKey ? "highlighted" : ""
            }
            onRow={(record) => {
              return {
                onClick: () => {
                  this.setState({ visible: true });
                  this.setRowKey(record);
                  this.setState({ selectedPerson: record });
                },
              };
            }}
            dataSource={this.state.personData}
          />
          {this.state.visible && (
            <Modal
              title={this.state.selectedPerson.primary_name}
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p>Name: {this.state.selectedPerson.primary_name}</p>
              <p>Primary Profession: {this.state.selectedPerson.primary_profession}</p>
              <p>Birth Year: {this.state.selectedPerson.birth_year}</p>
            </Modal>
          )}
        </div>
      </Container>
    );
  }
}

export default CrewCast;
