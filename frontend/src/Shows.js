import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table'
import InputGroup from 'react-bootstrap/InputGroup'
import { FormControl } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

class Shows extends React.Component {
    //exampleMovies
    showsR = [{ title: "Harry Potter Show", director: "Tahir", year: '2000' }, { title: "Harry Potter Show 2", director: "Jay", year: '2003' }]

    state = {
        shows: [],
        searchVal: null,
    }

    searchShows(e) {
        //console.log(e.target.value)
        //make api call and recieve list of movies
        this.setState({ shows: this.showsR })
    }

    render() {
        return (
            <Container align='center'>
                <h1>Shows</h1>
                <br />
                <InputGroup size="lg">
                    <Button variant="outline-secondary"
                        id="movies-search-button"
                        onClick={(e) => this.searchShows(e)}
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
                        {this.state.shows.map((shows) => {
                            return (
                                <tr>
                                    <td>{shows.title}</td>
                                    <td>{shows.director}</td>
                                    <td>{shows.year}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>

            </Container>
        )
    }
}

export default Shows;