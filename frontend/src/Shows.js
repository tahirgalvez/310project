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
    title: "Title",
    dataIndex: "primary_title",
    key: "primary_title",
  },
  {
    title: "Year",
    dataIndex: "end_year",
    key: "end_year",
  },
];

const data = [
  {
    key: "1",
    title: "The Office",
    director: "Tahir",
    year: "2000",
  },
  {
    key: "2",
    title: "Parks and Recreation",
    director: "Jay",
    year: "2001",
  },
  {
    key: "3",
    title: "New Girl",
    director: "Tahir",
    year: "2002",
  },
];

const getRowKey = (record) => {
  return `${record.key}`;
};

class Shows extends React.Component {
  constructor(props, context) {
    super(props, context);
    autoBind(this);
    this.state = {
      selectedRowKey: null,
      visible: false,
      selectedShow: null,
      searchValue: "",
      showData: [],
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

  async searchShows(e) {
    // let newMovies = data.filter((movie) => {
    //   return movie.title.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) >= 0;
    // });

    try{
      const resp =  await fetch(`/showss?title=${this.state.searchValue}`)
      const data = await resp.json()
      //console.log(data)
      this.setState({ showData: data })
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
        <h1>Shows</h1>
        <br />
        <InputGroup size="lg">
          <Button
            variant="outline-secondary"
            id="shows-search-button"
            onClick={(e) => this.searchShows(e)}
          >
            {" "}
            Search Title
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
                  this.setState({ selectedShow: record });
                },
              };
            }}
            dataSource={this.state.showData}
          />
          {this.state.visible && (
            <Modal
              title={this.state.selectedShow.title}
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p>Title: {this.state.selectedShow.primary_title}</p>
              <p>Genre: {this.state.selectedShow.genres.toString()}</p>
              <p>Year: {this.state.selectedShow.end_year}</p>
            </Modal>
          )}
        </div>
      </Container>
    );
  }
}

export default Shows;
