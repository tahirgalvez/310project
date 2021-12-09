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
    dataIndex: "start_year",
    key: "start_year",
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

  async searchShows(e) {
    // let newMovies = data.filter((movie) => {
    //   return movie.title.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) >= 0;
    // });

    try{
      const resp =  await fetch(`/showss?title=${this.state.searchValue}&isAdult=${this.state.isAdult}&minYear=${this.state.minYear}&maxYear=${this.state.maxYear}&minRunTimeMinutes=${this.state.minRunTimeMinutes}&maxRunTimeMinutes=${this.state.maxRunTimeMinutes}&minRating=${this.state.minRating}&maxRating=${this.state.maxRating}&genres=${this.state.genres}`)
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
            Sci-fi <input type="checkbox" value="sci-fi" onChange={(e) => this.handleGenres(e)} />
            {' '}
            Comedy <input type="checkbox" value="comedy" onChange={(e) => this.handleGenres(e)} />
            {' '}
            Horror <input type="checkbox" value="horror" onChange={(e) => this.handleGenres(e)} />
            {' '}
            Thriller <input type="checkbox" value="thriller" onChange={(e) => this.handleGenres(e)} />
            {' '}
            Drama <input type="checkbox" value="drama" onChange={(e) => this.handleGenres(e)} />
            {' '}
            Fantasy <input type="checkbox" value="fantasy" onChange={(e) => this.handleGenres(e)} />
            {' '}
            Animation <input type="checkbox" value="animation" onChange={(e) => this.handleGenres(e)} />
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
              <p>Year: {this.state.selectedShow.start_year}</p>
              <p>Adult Show: {this.state.selectedShow.is_adult.toString()}</p>
              <p>Runtime: {this.state.selectedShow.runtime_minutes}</p>
              <p>Rating: {this.state.selectedShow.average_rating}</p> 
            </Modal>
          )}
        </div>
      </Container>
    );
  }
}

export default Shows;
