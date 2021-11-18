import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table'
import InputGroup from 'react-bootstrap/InputGroup'
import { FormControl } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

class Movies extends React.Component {

    //exampleMovies
    moviesR = [{title:"Harry Potter", director:"Tahir", year:'2000'}, {title:"Harry Potter 2", director:"Jay", year:'2003'}]

    state = {
        movies: [],
        searchVal: null,
    }

    searchMovies(e){
        //console.log(e.target.value)
        //make api call and recieve list of movies
        this.setState({movies: this.moviesR})
    }

    render() {
        return (
            <Container align='center'>
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
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Director</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.movies.map((movie)=>{
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
