import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table'
import InputGroup from 'react-bootstrap/InputGroup'
import { FormControl } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

class CrewCast extends React.Component {

    peopleR = [{ name: "Harry Potter", title: "Tahir", dob: '2000' }, { name: "Harry Potter 2", title: "Jay", dob: '2003' }]

    state = {
        people: [],
        searchVal: null,
    }

    searchPeople(e) {
        //console.log(e.target.value)
        //make api call and recieve list of movies
        this.setState({ people: this.peopleR })
    }

    render() {
        return (
            <Container align='center'>
                <h1>Crew & Cast</h1>
                <br />
                <InputGroup size="lg">
                    <Button variant="outline-secondary"
                        id="movies-search-button"
                        onClick={(e) => this.searchPeople(e)}
                    > Search Name
                    </Button>
                    <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
                </InputGroup>

                <br />
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Title</th>
                            <th>Date of Birth</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.people.map((p) => {
                            return (
                                <tr>    
                                    <td>{p.name}</td>
                                    <td>{p.title}</td>
                                    <td>{p.dob}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>

            </Container>
        )
    }
}

export default CrewCast;