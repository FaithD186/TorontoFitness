import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import {Link, useNavigate} from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone_num, setPhoneNum] = useState("")
    const [image, setImage] = useState(null)
    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        username: [],
        password: [],
        first_name: [],
        last_name: [],
        email: [],
        phone_num: [],
        avatar: []
    });


    const handleImageChange = (e) => {
        setImage(e.target.files[0])
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let form_data = new FormData();
        form_data.append('username', username);
        form_data.append('password', password);
        form_data.append('first_name', first_name);
        form_data.append('last_name', last_name);
        form_data.append('email', email);
        form_data.append('phone_num', phone_num)
        if (image){
            form_data.append('avatar', image);
        }
        let url = 'http://127.0.0.1:8000/accounts/register/';
        axios.post(url, form_data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(res => {
                console.log(res.data);
                navigate("/login");
            })
            .catch(err => {
                console.log(err.response.data);
                setErrors(err.response.data);
            })
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <hr />
            <Form.Group className="mb-3">
                <Form.Label htmlFor="username">Username</Form.Label>
                <Form.Control type="text" id="username" onChange={e => setUsername(e.target.value)} placeholder="*Username"/>
                {errors.username && (
                    <Form.Text className='text-danger' tooltip="true">
                        {errors.username}
                    </Form.Text>
                )}
            </Form.Group>
            <div className="mb-3">
                <label htmlFor="password">Password</label>
                <Form.Control
                    type="password"
                    id="password"
                    onChange={e => setPassword(e.target.value)}
                    placeholder="*Password"
                />
                <Form.Text className='text-danger' tooltip="true">
                    {errors.password}
                </Form.Text>
            </div>
            <Row>
                <Col>
                    <div className="mb-3">
                        <label htmlFor="first_name">First Name</label>
                        <Form.Control
                            type="text"
                            id="first_name"
                            onChange={e => setFirstName(e.target.value)}
                            placeholder="*First Name"
                        />
                        <Form.Text className='text-danger' tooltip="true">
                            {errors.first_name}
                        </Form.Text>
                    </div>
                </Col>
                <Col>
                    <div className="mb-3">
                        <label htmlFor="last_name">Last Name</label>
                        <Form.Control
                            type="text"
                            id="last_name"
                            onChange={e => setLastName(e.target.value)}
                            placeholder="*Last Name"
                        />
                        <Form.Text className='text-danger' tooltip="true">
                            {errors.last_name}
                        </Form.Text>
                    </div>
                </Col>
            </Row>
            <div className="mb-3">
                <label htmlFor="email">Email</label>
                <Form.Control
                    type="email"
                    id="email"
                    onChange={e => setEmail(e.target.value)}
                    placeholder="*Email"
                />
                <Form.Text className='text-danger' tooltip="true">
                    {errors.email}
                </Form.Text>
            </div>
            <div className="mb-3">
                <label htmlFor="phone_num">Phone Number</label>
                <Form.Control
                    type="text"
                    id="phone_num"
                    onChange={e => setPhoneNum(e.target.value)}
                    placeholder="*Phone Number"
                />
                <Form.Text className='text-danger' tooltip="true">
                    {errors.phone_num}
                </Form.Text>
            </div>
            <div className="mb-3">
                <label htmlFor="avatar">Avatar (Optional)</label>
                <Form.Control
                    type="file"
                    id="image"
                    accept="image/png, image/jpeg"
                    onChange={handleImageChange}
                />
            </div>
            <Button variant="primary" type="submit">Register</Button>
            <br/>
            <br/>
            <p className="register"> Already a user? <Link style={{textDecoration: 'none', color: '#d85c27'}} to="/login">Login</Link></p>
        </Form>
    )




/*    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //const [password2, setPassword2] = useState("");
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone_num, setPhoneNum] = useState("")
    const [avatar, setAvatar] = useState(null)
    const { registerUser } = useContext(AuthContext);
    const {registerError} = useContext(AuthContext)

    const handleSubmit = async e => {
        e.preventDefault();
        registerUser(username, password, first_name, last_name, email, phone_num, avatar);
    };
*/
}

export default Register;