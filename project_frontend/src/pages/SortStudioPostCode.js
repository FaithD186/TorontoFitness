import React, {useContext, useState, useEffect, useRef} from "react";
import AuthContext from "../context/AuthContext";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Map from "../components/Map";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Pagination from "react-bootstrap/Pagination";
import Dropdown from "react-bootstrap/Dropdown";
//is this saved ?
const SortStudioPostCode = () => {
    const [studioList, setStudioList] = useState([])
    const {authTokens, logoutUser} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    let [postCode, setPostCode] = useState("")
    const [page_num_post, setPageNumPost] = useState(1)
    const [page_num_curr, setPageNumCurr] = useState(1)
    const [getcurr, setGetCurr] = useState(false)
    const [getpost, setGetPost] = useState(true)
    const [prev, setPrev] = useState(false)
    const [next, setNext] = useState(true)


    useEffect(() => {
        setPageNumPost(1)
        getPostStudio()
    },[postCode])

    const handleNextbtn = () => {
        if(next){
            getPostStudio()
        }
    }
    const handlePrevbtn = () => {
        if (prev && next){
            setPageNumPost(page_num_post => page_num_post - 2)
            getPostStudio()
        }else if (!prev){
            setPageNumPost(1)
        }else {
            setPageNumPost(page_num_post => page_num_post - 1)
            getPostStudio()
        }

    }


    let getPostStudio = async()=>{
        // problem: when pages have previous and next is not null
        let response = await fetch(`http://127.0.0.1:8000/studio/sortby/postcode/?page=${page_num_post}&post_code=${postCode}`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
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
            <div className="studio-upper"><h5 className="h2-text">Find Studios: Sort By Postal Code</h5></div>
            {/*<br/>
            <h1>Find Studios</h1>
            <h6 className="studio-list">Sorting by Postal Code</h6>*/}
            <Map studios={studioList}/>
            <Form className="post-code-form" onSubmit={e => { e.preventDefault(); }}>
                <label htmlFor="postcode">Sort by Postal Code</label>
                <br/>
                <Form.Control type="text"
                              id="postcode"
                              placeholder="Enter Postal Code"
                              onChange={e => setPostCode(e.target.value)}/>
            </Form>
{/*            <Link to="/studio/sortby/currlocation" className="studio-list"><Button variant="light">View All Studios</Button></Link>
            <Link to="/studio/map" className="studio-list"><Button variant="light">Sort By Pinpoint on Map</Button></Link>*/}
{/*            <br/>
            <br/>*/}
            <Dropdown className="studio-list">
                <Dropdown.Toggle id="dropdown-basic">
                    Sorting By Postal Code
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item as={Link} activeStyle={{}} to="/studio/map">Sort By Pinpoint</Dropdown.Item>
                    <Dropdown.Item as={Link} activeStyle={{}} to="/studio/sortby/currlocation">Sort By Current Location</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <br/>
            <Link to="/studio/filter/" className="studio-list"><Button variant="light">Filter</Button></Link>

            <div className="studio-list">
                {studioList.map(studio => (
                    <>
                        <Card >
                            <Card.Body>
                                <div key={studio.id}>
                                    <div key={studio.name}><Card.Title>{studio.name}</Card.Title></div>
                                    <div key={studio.location.address}><Card.Subtitle className="mb-2 text-muted">Location: {studio.location.address}</Card.Subtitle></div>
                                    <Card.Text>
                                        <div key={studio.location.post_code}>Postal Code: {studio.location.post_code}</div>
                                    </Card.Text>
                                    <Link to={"/studio/" + studio.id + "/details"}><Button variant="outline-secondary">Studio Details</Button></Link>&nbsp;&nbsp;&nbsp;
                                    {localStorage.getItem("authTokens") && (
                                        <Link to={"/studio/" + studio.id + "/classes"}><Button variant="primary">Studio Classes</Button></Link>
                                    )}
                                    {!localStorage.getItem("authTokens") && (
                                        <Link to={"/subscriptions"}><Button variant="primary">Studio Classes</Button></Link>
                                    )}

                                </div>
                            </Card.Body>
                            <Card.Footer className="text-muted" key={studio.location.distance}>{studio.location.distance} km from {postCode}</Card.Footer>
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

export default SortStudioPostCode


