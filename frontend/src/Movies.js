import React from "react";
import { Container } from "react-bootstrap";
import autoBind from "react-autobind";
import "antd/dist/antd.css";
import { Table, Modal } from "antd";
import InputGroup from "react-bootstrap/InputGroup";
import { FormControl } from "react-bootstrap";
import { Button } from "react-bootstrap";
import ReactHtmlParser from "react-html-parser";

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Director",
    dataIndex: "director",
    key: "director",
  },
  {
    title: "Year",
    dataIndex: "year",
    key: "year",
  },
];

const data = [
  {
    key: "1",
    title: "Harry Potter",
    director: "Tahir",
    year: "2000",
  },
  {
    key: "2",
    title: "Harry Potter 2",
    director: "Jay",
    year: "2001",
  },
  {
    key: "3",
    title: "Harry Potter 3",
    director: "Tahir",
    year: "2002",
  },
  {
    key: "4",
    title: "Jaws",
    director: "Spielberg",
    year: "1975",
  },
];

const getRowKey = (record) => {
  return `${record.key}`;
};

class Movies extends React.Component {
  constructor(props, context) {
    super(props, context);
    autoBind(this);
    this.state = {
      selectedRowKey: null,
      visible: false,
      selectedMovie: null,
      searchValue: "",
      movieData: data,
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

  searchMovies(e) {
    let newMovies = data.filter((movie) => {
      return movie.title.indexOf(this.state.searchValue) >= 0;
    });
    this.setState({ movieData: newMovies });
  }

  render() {
    const { selectedRowKey } = this.state;
    console.log(selectedRowKey, typeof selectedRowKey);

    return (
      <Container align="center">
        <br />
        <h1>Movies</h1>
        <br />
        <InputGroup size="lg">
          <Button
            variant="outline-secondary"
            id="movies-search-button"
            onClick={(e) => this.searchMovies(e)}
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
                  this.setState({ selectedMovie: record.key });
                },
              };
            }}
            dataSource={this.state.movieData}
          />
          {this.state.visible && (
            <Modal
              title={this.state.movieData[this.state.selectedMovie - 1].title}
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p>Title: {this.state.movieData[this.state.selectedMovie - 1].title}</p>
              <p>Director: {this.state.movieData[this.state.selectedMovie - 1].director}</p>
              <p>Year: {this.state.movieData[this.state.selectedMovie - 1].year}</p>
            </Modal>
          )}
        </div>
      </Container>
    );
  }
}

export default Movies;
