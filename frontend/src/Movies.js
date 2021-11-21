import React from "react";
import { Container } from 'react-bootstrap';
import autoBind from "react-autobind";
import "antd/dist/antd.css";
import { Table, Modal } from "antd";
import InputGroup from 'react-bootstrap/InputGroup'
import { FormControl } from 'react-bootstrap';
import {Button} from "react-bootstrap";

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title"
  },
  {
    title: "Director",
    dataIndex: "director",
    key: "director"
  },
  {
    title: "Year",
    dataIndex: "year",
    key: "year"
  }
];

const data = [
  {
    key: "1",
    title: "Harry Potter",
    director: "Tahir",
    year: "2000"
  },
  {
    key: "2",
    title: "Harry Potter 2",
    director: "Jay",
    year: "2001"
  },
  {
    key: "3",
    title: "Harry Potter 3",
    director: "Tahir",
    year: "2002"
  },
];

const getRowKey = record => {
  return `${record.key}`;
};

class Movies extends React.Component {
  constructor(props, context) {
    super(props, context);
    autoBind(this);
    this.state = { selectedRowKey: null, visible: false };
  }

  setRowKey(record) {
    const selectedRowKey = getRowKey(record);
    console.log(record);
    console.log(selectedRowKey, typeof selectedRowKey);
    this.setState({ selectedRowKey });
  }

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  searchMovies(e){
    //console.log(e.target.value)
    //make api call and recieve list of movies
    this.setState({movies: this.moviesR})
    //TODO: actually search and filter movies based on title
}

  render() {
    const { selectedRowKey } = this.state;
    console.log(selectedRowKey, typeof selectedRowKey);

    return (
      <Container align='center'>

                <br />
                <h1>Movies</h1>
                <br />
                <InputGroup size="lg">
                   <Button variant ="outline-secondary"
                     id="movies-search-button"
                     onClick={(e)=>this.searchMovies(e)}
                     > Search Title
                   </Button>
                   <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
               </InputGroup>

      <div className="holder">
        <Table
          columns={columns}
          rowKey={record => getRowKey(record)}
          rowClassName={record =>
            getRowKey(record) === selectedRowKey ? "highlighted" : ""
          }
          onRow={record => {
            return {
              onClick: () => {
                this.setState({ visible: true });
                this.setRowKey(record);
              }
            };
          }}
          dataSource={data}
        />

        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>document.getElementByID("title").innerHTML</p>
          <p>Some contents...</p>
        </Modal>
      </div>
      </Container>
    );
  }
}

export default Movies;
