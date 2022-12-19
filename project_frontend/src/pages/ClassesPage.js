import React, {useContext, useState, useEffect} from "react";
import AuthContext from "../context/AuthContext";
import Button from "react-bootstrap/Button";
import {Link, useParams, Navigate} from "react-router-dom";
import Map from "../components/Map";
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import Pagination from "react-bootstrap/Pagination";
import axios from "axios";
import Alert from "react-bootstrap/Alert";

const ClassesPage = () => {
    const {id} = useParams();
    let [classes, setClasses] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [prev, setPrev] = useState(false)
    const [next, setNext] = useState(true)
    const [popup, setPopup] = useState("")
    const [redirect, setRedirect] = useState(false)
    const [page_num_post, setPageNumPost] = useState(1)

    useEffect(() => {
        getClassesInfo()
    },[])

    const handleNextbtn = () => {
        if(next){
            getClassesInfo()
        }
    }
    const handlePrevbtn = () => {
        if (prev && next){
            setPageNumPost(page_num_post => page_num_post - 2)
            getClassesInfo()
        }else if (!prev){
            setPageNumPost(1)
        }else {
            setPageNumPost(page_num_post => page_num_post - 1)
            getClassesInfo()
        }

    }

    const enrol = (class_id, time_id) => {
        fetch(`http://127.0.0.1:8000/class/${class_id}/enrol`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + String(authTokens.access)
          },
          body: JSON.stringify({
            enrolled_time: time_id
          })
        }).then(res => {
            console.log(res);
            if (res.status === 200) {
                setPopup("Successfully Enrolled In The Class Instance");
            } else {
                setRedirect(true);
            }
        })
    }

    const enrolAll = (class_id) => {
        fetch(`http://127.0.0.1:8000/class/${class_id}/enrol/all`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + String(authTokens.access)
        }}).then(res => {
            console.log(res);
            if (res.status === 200) {
                setPopup("Successfully Enrolled in All Class Instances");
            } else {
                setRedirect(true);
            }
        })
    }

    const drop = (class_id, time_id) => {
        fetch(`http://127.0.0.1:8000/class/${class_id}/drop`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + String(authTokens.access)
          },
          body: JSON.stringify({
            enrolled_time: time_id
          })
        }).then(res => {
            console.log(res);
            if (res.status === 200) {
                setPopup("Successfully Dropped The Class Instance");
            } else {
                setRedirect(true);
            }
            
        })
    }

    const dropAll = (class_id) => {
        fetch(`http://127.0.0.1:8000/class/${class_id}/drop/all`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + String(authTokens.access)
        }}).then(res => {
            console.log(res);
            if (res.status === 200) {
                setPopup("Successfully Dropped All Class Instances");
            } else {
                setRedirect(true);
            }
        })
    }

    let getClassesInfo = async()=>{
        let response = await fetch(`http://127.0.0.1:8000/studio/${id}/classes/`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + String(authTokens.access)
            }
        })

        let data = await response.json()
        if (response.status === 200){
            setClasses(data)
            setLoading(false)
        } else if (response.statusText==='Unauthorized') {
            logoutUser()
        }

    }

    if (redirect) {
        return <Navigate to='/subscriptions'/>;
      }

    if (loading){
        return (
            <div></div>
        )
    }
    return (
        <div>
            <br/>
            <h1>Classes</h1>
            <br/>
            {/* <Form className="filters-form" onSubmit={e => { e.preventDefault(); }}>
                <label htmlFor="filter">Sort by Postal Code</label>
                <br/>
                <Form.Control type="text"
                              id="filter"
                              placeholder="Enter Postal Code"
                              onChange={e => setPostCode(e.target.value)}/>
            </Form>
            <Link to="/studio/sortby/currlocation" className="studio-list"><Button variant="light">View All Studios</Button></Link> */}
            <Link to={`/studio/${id}/classes/filter`} className="studio-list"><Button variant="light">Filter</Button></Link>
            {popup && <Alert style={{width: "26%", marginLeft: "67vh"}} variant="success">
                {popup}
            </Alert>}

            <div className="classes-list">
                {classes.map(curr_class => (
                    <>
                    <Card>
                        <Card.Body>
                            <div key={curr_class.id}>
                            <div key={curr_class.name}><Card.Title>{curr_class.name}</Card.Title></div>
                            <div key={curr_class.description} className="mb-2 text-muted"><Card.Subtitle>{curr_class.description}</Card.Subtitle></div>
                            <Card.Text>
                                <div key={curr_class.coach}>Coach: {curr_class.coach}</div>
                            </Card.Text>
                            <Button variant="success" onClick={() => enrolAll(curr_class.id)}>Enrol All</Button>&nbsp;&nbsp;&nbsp;
                            <Button variant="danger" onClick={() => dropAll(curr_class.id)}>Drop All</Button>
                            <div className="times-list">
                                {curr_class.times.map(curr_time => (
                                    <>
                                    <Card>
                                        <Card.Body>
                                            <div key={curr_time.id}>
                                            <div key={curr_time.name}><Card.Title>{curr_time.class_date} from {curr_time.start_time} to {curr_time.end_time}</Card.Title></div>
                                            {/* <div key={curr_class.}><Card.Subtitle className="mb-2 text-muted">Location: {class.}</Card.Subtitle></div> */}
                                            <Card.Text>
                                            <div key={curr_time.class_date}>Date: {curr_time.class_date}</div>
                                            <div key={curr_time.start_time}>Time: {curr_time.start_time} - {curr_time.end_time}</div>
                                            </Card.Text>
                                            <Button variant="success" onClick={() => enrol(curr_class.id, curr_time.id)}>Enrol</Button>&nbsp;&nbsp;&nbsp;
                                            <Button variant="danger" onClick={() => drop(curr_class.id, curr_time.id)}>Drop</Button>
                                            
                                            </div>
                                        </Card.Body>
                                        <Card.Footer className="text-muted" key={curr_time.space_left}>Remaining Capacity: {curr_time.space_left}</Card.Footer>
                                        {/* {postCode && (
                                            <Card.Footer className="text-muted" key={studio.location.distance}>{studio.location.distance} km from {postCode}</Card.Footer>
                                        )} */}
                                    </Card>
                                    <br/>
                                    </>
                                ))}
                            </div>
                            <div className="container d-flex justify-content-center">
                                <Pagination size="lg">
                                    <Pagination.Prev
                                        onClick={handlePrevbtn}/>
                                    <Pagination.Next
                                        onClick={handleNextbtn}/>
                                </Pagination>
                            </div>
                             </div>
                        </Card.Body>
                        {/* <Card.Footer className="text-muted" key={studio.phone_num}>Contact at {studio.phone_num}</Card.Footer> */}
{/*                        {postCode && (
                            <Card.Footer className="text-muted" key={studio.location.distance}>{studio.location.distance} km from {postCode}</Card.Footer>
                        )}*/}
                    </Card>
                     <br/>
                    </>
                ))}
            </div>
            <div className="container d-flex justify-content-center">
                <Pagination size="lg">
                    <Pagination.Prev
                        onClick={handlePrevbtn}/>
                    <Pagination.Next
                        onClick={handleNextbtn}/>
                </Pagination>
            </div>

        </div>
    )
}

export default ClassesPage