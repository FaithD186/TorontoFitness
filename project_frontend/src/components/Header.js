import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { Route, Link, useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Header() {
    //const {logoutUser} = useContext(AuthContext) ?? {}
    const navigate = useNavigate();

    function logout(){
        localStorage.removeItem("authTokens");
        navigate("/login");
        window.location.reload();
    }
    return (
        <Navbar sticky="top"  expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={Link} activeStyle={{}} to='/'>Toronto Fitness Club</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} activeStyle={{}} to='/'>Home</Nav.Link>
                        <Nav.Link as={Link} activeStyle={{}} to='/studio/postcode/'>Find Studios</Nav.Link>
                        <NavDropdown title="Subscriptions" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} activeStyle={{}} to='/subscriptions'>Subscribe</NavDropdown.Item>
                            <NavDropdown.Item as={Link} activeStyle={{}} to='/subscriptions/edit'>Edit/Cancel Subscription</NavDropdown.Item>
                        </NavDropdown>
                        {localStorage.getItem("authTokens") && (
                            <>
                                <NavDropdown title="My Classes" id="basic-nav-dropdown">
                                    <NavDropdown.Item as={Link} activeStyle={{}} to="/class/schedule">My Schedule</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} activeStyle={{}} to="/class/history">My History</NavDropdown.Item>
                                </NavDropdown>

                            <NavDropdown title="Payments" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} activeStyle={{}} to="/subscriptions/card/edit/">Edit Card Info</NavDropdown.Item>
                                <NavDropdown.Item as={Link} activeStyle={{}} to="/subscriptions/payments/history/">
                                    Payment History
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} activeStyle={{}} to="/subscriptions/payments/future/">
                                    Upcoming Payment
                                </NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Profile" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} activeStyle={{}} to="/profile/view">View Profile</NavDropdown.Item>
                                <NavDropdown.Item as={Link} activeStyle={{}} to="/profile/edit">
                                    Edit Profile
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} activeStyle={{}} to="/login" onClick={logout}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                            </>
                        )}
                        {!localStorage.getItem("authTokens") && (
                            <>
                                <Nav.Link as={Link} activeStyle={{}} to="/login" >Login</Nav.Link>
                                <Nav.Link as={Link} activeStyle={{}} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;