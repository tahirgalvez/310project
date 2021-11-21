import React, { useState } from 'react';
// import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table'
import InputGroup from 'react-bootstrap/InputGroup'
import { FormControl } from 'react-bootstrap';
import ReactDom from 'react-dom';
// import Popup from './PopUp.js';
import {Modal, Button} from "react-bootstrap";

function Popup(movie) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
      </Modal>
    </>
  );
}

function addRowHandlers() {
  var table = document.getElementById("movieTable");
    var rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler =
            function(row)
            {
                return function() {
                   var cell = row.getElementsByTagName("td")[0];
                   var id = cell.innerHTML;
                   alert("id:" + id);
                  };
            };

        currentRow.onclick = createClickHandler(currentRow);
    }
}

class Movies extends React.Component {


    //exampleMovies
    moviesR = [{title:"Harry Potter", director:"Tahir", year:'2000'}, {title:"Harry Potter 2", director:"Jay", year:'2003'}]

    state = {
        movies: [],
        searchVal: null,
        showPopup: false,
    }


    searchMovies(e){
        //console.log(e.target.value)
        //make api call and recieve list of movies
        this.setState({movies: this.moviesR})
        //TODO: actually search and filter movies based on title
    }

    render() {
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

                <br />
                <Popup />
                <Table striped bordered hover id="movieTable">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Director</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.movies.map((movie)=>{
                          window.onload = addRowHandlers();
                            return(
                                <tr>
                                    <td>{movie.title}</td>
                                    <td>{movie.director}</td>
                                    <td>{movie.year}</td>

                                </tr>
                            )
                        })}
                    </tbody>
                </Table>

            </Container>
        )
    }
}

export default Movies;
