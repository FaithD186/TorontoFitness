import React, {useContext, useState, useEffect, useRef} from "react";
import AuthContext from "../context/AuthContext";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Map from "../components/Map";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Pagination from "react-bootstrap/Pagination";
//is this saved ?
const FilterStudiosPage = () => {
    const [studioList, setStudioList] = useState([])
    const {authTokens, logoutUser} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    let [studioNameFilter, setStudioNameFilter] = useState("")
    let [amenityFilter, setAmenityFilter] = useState("")
    let [classNameFilter, setClassNameFilter] = useState("")
    let [coachFilter, setCoachFilter] = useState("")
    const [page_num_post, setPageNumPost] = useState(1)
    const [page_num_curr, setPageNumCurr] = useState(1)
    const [getcurr, setGetCurr] = useState(false)
    const [getpost, setGetPost] = useState(true)
    const [prev, setPrev] = useState(false)
    const [next, setNext] = useState(true)


    useEffect(() => {
        setPageNumPost(1)
        getFilteredStudios()
    },[studioNameFilter, amenityFilter, classNameFilter, coachFilter])

    const handleNextbtn = () => {
        if(next){
            getFilteredStudios()
        }
    }
    const handlePrevbtn = () => {
        if (prev && next){
            setPageNumPost(page_num_post => page_num_post - 2)
            getFilteredStudios()
        }else if (!prev){
            setPageNumPost(1)
        }else {
            setPageNumPost(page_num_post => page_num_post - 1)
            getFilteredStudios()
        }

    }


    let getFilteredStudios = async()=>{
        // problem: when pages have previous and next is not null
        let response = await fetch(`http://127.0.0.1:8000/studio/filter/?studio_name=${studioNameFilter}&amenity=${amenityFilter}&class_name=${classNameFilter}&coach=${coachFilter}`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json"
            },
        })
        let data = await response.json()
        console.log(data)
        if (response.status === 200){
            setStudioList(data.results)
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
            <h1>Filter Studios</h1>
            <Form className="filter-form" onSubmit={e => { e.preventDefault(); }}>
                <label htmlFor="studio-name-filter">Filter by Studio Name</label>
                <br/>
                <Form.Control type="text"
                              id="studio-name-filter"
                              placeholder="Enter Studio Name Filter"
                              onChange={e => setStudioNameFilter(e.target.value)}/>
                <br/>
                <label htmlFor="amenity-filter">Filter by Amenity</label>
                <br/>
                <Form.Control type="text"
                              id="amenity-filter"
                              placeholder="Enter Amenity Filter"
                              onChange={e => setAmenityFilter(e.target.value)}/>
                <br/>
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
            </Form>
            <Link to="/studio/sortby/currlocation" className="studio-list"><Button variant="light">View All Studios</Button></Link>

            <div className="studio-list">
                {studioList.map(studio => (
                    <>
                        <Card>
                            <Card.Body>
                                <div key={studio.id}>
                                    <div key={studio.name}><Card.Title>{studio.name}</Card.Title></div>
                                    <div key={studio.location.address}><Card.Subtitle className="mb-2 text-muted">Location: {studio.location.address}</Card.Subtitle></div>
                                    <Card.Text>
                                        <div key={studio.location.post_code}>Postal Code: {studio.location.post_code}</div>
                                    </Card.Text>
                                    <Link to={"/studio/" + studio.id + "/details"}><Button variant="outline-secondary">Studio Details</Button></Link>&nbsp;&nbsp;&nbsp;
                                    <Link to={"/studio/" + studio.id + "/classes"}><Button variant="primary">Studio Classes</Button></Link>
                                </div>
                            </Card.Body>
                            {/* <Card.Footer className="text-muted" key={studio.location.distance}>{studio.location.distance} km from {postCode}</Card.Footer> */}
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

export default FilterStudiosPage


