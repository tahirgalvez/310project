import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Actors from './Actors';
import Movies from './Movies';
import Directors from './Directors';

function NavigationBar() {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/movies">Movies</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/actors">Actors</Nav.Link>
                    <Nav.Link href="/directors">Directors</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}


class Navvv extends React.Component {

    render() {
        return (
            <>
                <Router title="router">
                    {NavigationBar()}
                    <Container title="cont">
                        <Switch title="switch">
                            <Route exact path="/" component={Movies} />
                            <Route exact path="/movies" component={Movies} />
                            <Route exact path="/actors" component={Actors} />
                            <Route exact path="/directors" component={Directors} />
                            <Route component={Movies} />
                        </Switch>
                    </Container>
                </Router>
            </>
        )
    }
}

export default Navvv;