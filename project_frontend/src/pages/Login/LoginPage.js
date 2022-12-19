import {useContext, useState} from "react";
import AuthContext from "../../context/AuthContext";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import '../../style.css';
import Alert from 'react-bootstrap/Alert';
import {Link} from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";



const LoginPage = () => {
    const [validated, setValidated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let {error} = useContext(AuthContext)
    let {loginUser} = useContext(AuthContext)
    const state = useLocation().search;

    const handleSubmit = event => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        console.log("logging in with", username, password)
        console.log("login ", state)
        loginUser(username, password, state);
    };

    return (
        <section className="login-box">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <h1>Login </h1>
                <hr />
                <Form.Group className="mb-3">
                <Form.Label htmlFor="username">Username</Form.Label>
                    <InputGroup hasValidation>
                <Form.Control
                    type="text"
                    id="username"
                    placeholder="Enter Username"
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                    <Form.Control.Feedback type="invalid">
                        Please enter a username.
                    </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label htmlFor="password">Password</Form.Label>

                <Form.Control type="password" id="password" placeholder="Enter Password" onChange={e => setPassword(e.target.value)} required />
                        <Form.Control.Feedback type="invalid">
                            Please enter a password.
                        </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
                <br></br>
                <br></br>
                {error && <Alert key="danger" variant="danger">
                    {error}
                </Alert>}
                <p className="register"> Don't have account? <Link style={{textDecoration: 'none', color: '#d85c27'}} to="/register">Create an account</Link></p>
            </Form>
        </section>
    );
};

export default LoginPage;