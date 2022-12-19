import React, {useContext, useState, useEffect, useRef} from "react";
import AuthContext from "../context/AuthContext";
import {Link, useParams} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Map from "../components/Map";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Pagination from "react-bootstrap/Pagination";
//is this saved ?
const FilterClassesPage = () => {
    const {id} = useParams();
    const [classes, setClasses] = useState([])
    const {authTokens, logoutUser} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    let [classNameFilter, setClassNameFilter] = useState("")
    let [coachFilter, setCoachFilter] = useState("")
    let [dateFilter, setDateFilter] = useState("")
    let [startTimeFilter, setStartTimeFilter] = useState("")
    let [endTimeFilter, setEndTimeFilter] = useState("")
    const [page_num_post, setPageNumPost] = useState(1)
    const [page_num_curr, setPageNumCurr] = useState(1)
    const [getcurr, setGetCurr] = useState(false)
    const [getpost, setGetPost] = useState(true)
    const [prev, setPrev] = useState(false)
    const [next, setNext] = useState(true)


    useEffect(() => {
        setPageNumPost(1)
        getFilteredClasses()
    },[classNameFilter, coachFilter, dateFilter, startTimeFilter, endTimeFilter])


    const convertTime12to24 = (time12h) => {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
      
        if (hours === '12') {
          hours = '00';
        }
      
        if (modifier === 'PM') {
          hours = parseInt(hours, 10) + 12;
        }
      
        return `${hours}:${minutes}:00`;
      }

    const handleNextbtn = () => {
        if(next){
            getFilteredClasses()
        }
    }
    const handlePrevbtn = () => {
        if (prev && next){
            setPageNumPost(page_num_post => page_num_post - 2)
            getFilteredClasses()
        }else if (!prev){
            setPageNumPost(1)
        }else {
            setPageNumPost(page_num_post => page_num_post - 1)
            getFilteredClasses()
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
        })
    }

    const enrolAll = (class_id) => {
        fetch(`http://127.0.0.1:8000/class/${class_id}/enrol/all`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + String(authTokens.access)
        }})
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
        })
    }

    const dropAll = (class_id) => {
        fetch(`http://127.0.0.1:8000/class/${class_id}/drop/all`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + String(authTokens.access)
        }})
    }


    let getFilteredClasses = async()=>{
        // problem: when pages have previous and next is not null
        let response = await fetch(`http://127.0.0.1:8000/studio/${id}/classes/filter/?class_name=${classNameFilter}&coach=${coachFilter}&date=${dateFilter}&start_time=${startTimeFilter}&end_time=${endTimeFilter}`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json"

            },
        })
        let data = await response.json()
        console.log(data)
        if (response.status === 200){
            setClasses(data)
            setLoading(false)
            if (data.next != null){
                setPageNumPost(page_num_post => page_num_post + 1)
                setNext(true)
            }else{
                setNext(false)
            }
            if (data.previous != null){
                setPrev(true)
            }else{
                setPrev(false)
            }
        }else if(response.statusText==='Unauthorized'){
            logoutUser()
        }else{
            setPageNumPost(1)
        }

    }

    if (loading){
        return (
            <div></div>
        )
    }
    return (
        <div>
            <br/>
            <h1>Filter Classes</h1>
            <Form className="filter-form" onSubmit={e => { e.preventDefault(); }}>
                <label htmlFor="class-name-filter">Filter by Class Name</label>
                <br/>
                <Form.Control type="text"
                              id="class-name-filter"
                              placeholder="Enter Class Name Filter"
                              onChange={e => setClassNameFilter(e.target.value)}/>
                <br/>
                <label htmlFor="coach-filter">Filter by Coach</label>
                <br/>
                <Form.Control type="text"
                              id="coach-filter"
                              placeholder="Enter Coach Filter"
                              onChange={e => setCoachFilter(e.target.value)}/>
                <br/>
                <label htmlFor="class-name-filter">Filter by Date</label>
                <br/>
                <Form.Control type="date"
                              id="date-filter"
                              placeholder="Enter Date Filter"
                              onChange={e => setDateFilter(e.target.value)}/>
                <br/>
                <label htmlFor="start-time-filter">Filter by Start Time</label>
                <br/>
                <Form.Control type="time"
                              id="start-time-filter"
                              placeholder="Enter Start Time Filter"
                              onChange={e => setStartTimeFilter(convertTime12to24(e.target.value))}/>
                <br/>
                <label htmlFor="end-time-filter">Filter by End Time</label>
                <br/>
                <Form.Control type="time"
                              id="end-time-filter"
                              placeholder="Enter End Time Filter"
                              onChange={e => setEndTimeFilter(convertTime12to24(e.target.value))}/>
                <br/>
            </Form>
            <Link to={`/studio/${id}/classes`} className="studio-list"><Button variant="light">View All Classes</Button></Link>

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
                                            <Card.Text>
                                            <div key={curr_time.class_date}>Date: {curr_time.class_date}</div>
                                            <div key={curr_time.start_time}>Time: {curr_time.start_time} - {curr_time.end_time}</div>
                                            </Card.Text>
                                            <Button variant="success" onClick={() => enrol(curr_class.id, curr_time.id)}>Enrol</Button>&nbsp;&nbsp;&nbsp;
                                            <Button variant="danger" onClick={() => drop(curr_class.id, curr_time.id)}>Drop</Button>
                                            </div>
                                        </Card.Body>
                                        <Card.Footer className="text-muted" key={curr_time.space_left}>Remaining Capacity: {curr_time.space_left}</Card.Footer>
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

export default FilterClassesPage


