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
      movieData: [],
    };
  }

  setRowKey(record) {
    const selectedRowKey = getRowKey(record);
    //console.log(record);
    //console.log(selectedRowKey, typeof selectedRowKey);
    this.setState({ selectedRowKey });
    this.setState({ record });
  }

  handleOk = (e) => {
    //console.log(e);
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

  async searchMovies(e) {
    // let newMovies = data.filter((movie) => {
    //   return movie.title.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) >= 0;
    // });

    try{
      const resp =  await fetch(`/titles?title=${this.state.searchValue}`)
      const data = await resp.json()
      //console.log(data)
      this.setState({ movieData: data })
      //console.log(this.state.movieData)
    }catch(err){
      console.log(err)
    }
  }

  render() {
    const { selectedRowKey } = this.state;
    //console.log(selectedRowKey, typeof selectedRowKey);

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
                  this.setState({ selectedMovie: record });
                },
              };
            }}
            dataSource={this.state.movieData}
          />
          {this.state.visible && (
            <Modal
              title={this.state.selectedMovie.primary_title}
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p>Title: {this.state.selectedMovie.primary_title}</p>
              <p>Genre: {this.state.selectedMovie.genres.toString()}</p>
              <p>Year: {this.state.selectedMovie.end_year}</p>
            </Modal>
          )}
        </div>
      </Container>
    );
  }
}

export default Movies;
