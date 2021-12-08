import React from "react";
import { Container, FormLabel } from "react-bootstrap";
import autoBind from "react-autobind";
import "antd/dist/antd.css";
import { Table, Modal } from "antd";
import InputGroup from "react-bootstrap/InputGroup";
import { FormControl } from "react-bootstrap";
import { Button } from "react-bootstrap";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

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
      titleType: null,
      isAdult: null,
      minYear: null,
      maxYear: null,
      minRunTimeMinutes: null,
      maxRunTimeMinutes: null,
      minRating: null,
      maxRating: null,
      genres: [],
      page: null,
      itemsPerPage: null,
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

  handleAdult = (e) => {
    // First time checkbox is clicked
    if (this.state.isAdult === null) {
      this.setState({ isAdult: 'true' });
      return;
    }

    if (this.state.isAdult === 'true') {
      this.setState({ isAdult: 'false' });
    }
    else {
      this.setState({ isAdult: 'true' });
    }
  }

  handleGenres = (e) => {
    const genres = this.state.genres;
    var index;

    if (e.target.checked) {
      genres.push(e.target.value);
    }
    else {
      index = genres.indexOf(e.target.value);
      genres.splice(index, 1);
    }

    this.setState({ genres: genres });
    console.log(genres);
  }

  async searchMovies(e) {
    // let newMovies = data.filter((movie) => {
    //   return movie.title.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) >= 0;
    // });

    try {
      const resp = await fetch(`/titles?title=${this.state.searchValue}&isAdult=${this.state.isAdult}&minYear=${this.state.minYear}&maxYear=${this.state.maxYear}&minRunTimeMinutes=${this.state.minRunTimeMinutes}&maxRunTimeMinutes=${this.state.maxRunTimeMinutes}&minRating=${this.state.minRating}&maxRating=${this.state.maxRating}&genres=${this.state.genres}`);
      const data = await resp.json()
      //console.log(data)
      this.setState({ movieData: data })
      //console.log(this.state.movieData)
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { selectedRowKey } = this.state;
    //console.log(selectedRowKey, typeof selectedRowKey);
    console.log(this.state)
    return (
      <Container align="center">
        <br />
        <h1>Movies</h1>
        <br />

        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Air Date Year Range</InputGroup.Text>
          <FormControl
            placeholder="Start Year"
            onChange={(e) => this.setState({ minYear: e.target.value })}
          />
          <FormControl
            placeholder="End Year"
            onChange={(e) => this.setState({ maxYear: e.target.value })}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Runtime Minutes:</InputGroup.Text>
          <FormControl
            placeholder="Min"
            type="number"
            onChange={(e) => this.setState({ minRunTimeMinutes: e.target.value })}
          />
          <FormControl
            placeholder="Max"
            type="number"
            onChange={(e) => this.setState({ maxRunTimeMinutes: e.target.value })}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1"> Star Rating Range (0 - 5):</InputGroup.Text>
          <FormControl
            placeholder="Min"
            type="number"
            onChange={(e) => this.setState({ minRating: e.target.value })}
          />
          <FormControl
            placeholder="Max"
            type="number"
            onChange={(e) => this.setState({ maxRating: e.target.value })}
          />
        </InputGroup>
        <Container>
        <div className="genres">
          <form>
            Romance <input type="checkbox" value="romance" onChange={(e) => this.handleGenres(e)} />
            {' '}
            Action <input type="checkbox" value="action" onChange={(e) => this.handleGenres(e)} />
            {' '}
            Mystery <input type="checkbox" value="mystery" onChange={(e) => this.handleGenres(e)} />
            {' '}
          </form>
        </div>
        <div className="Adults">
          Adult Rated Movies Only? <input type="checkbox" value="isAdult" onChange={(e) => this.handleAdult(e)} />
        </div>
        </Container>

        <br />
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
              <p>Adult Movie: {this.state.selectedMovie.is_adult}</p>
              <p>Runtime: {this.state.selectedMovie.runtime_minutes}</p>
            </Modal>
          )}
        </div>
      </Container>
    );
  }
}

export default Movies;
