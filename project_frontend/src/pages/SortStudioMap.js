import React, {Component, useContext, useEffect, useState} from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import {Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import AuthContext from "../context/AuthContext";
import Dropdown from "react-bootstrap/Dropdown";


function SortStudioMap () {
    //constructor for your marker
    const [markers, setMarkers] = useState([{
        title: "The marker`s title will appear as a tooltip.",
        name: "Yrll",
        position: { lat: 37.663626, lng: -122.106001 }
    }])
    const {authTokens, logoutUser} = useContext(AuthContext)
    const [lat, setLat] = useState(0)
    const [lng, setLng] = useState(0)
    const [loading, setLoading] = useState(true)
    const [studioList, setStudioList] = useState([])
    const [page_num_post, setPageNumPost] = useState(1)
    const [prev, setPrev] = useState(false)
    const [next, setNext] = useState(true)

    useEffect(() => {
        setPageNumPost(1)
        getPointStudio()
    },[lat, lng])

    const handleNextbtn = () => {
        if(next){
            getPointStudio()
        }
    }
    const handlePrevbtn = () => {
        if (prev && next){
            setPageNumPost(page_num_post => page_num_post - 2)
            getPointStudio()
        }else if (!prev){
            setPageNumPost(1)
        }else {
            setPageNumPost(page_num_post => page_num_post - 1)
            getPointStudio()
        }

    }


    //function for clicking on the map
    const mapClicked = (mapProps, map, clickEvent) => {
        const lat = clickEvent.latLng.lat();
        const lng = clickEvent.latLng.lng();
        setLat(lat)
        setLng(lng)

        setMarkers([
                    {
                        title: "",
                        name: "",
                        position: { lat, lng }
                    }
            ])
    }
    //function to show infoWindow
    const onMarkerClick = (props, marker, e) => {
        //stores the coordinates
        const lat = e.latLng.lat().toString();
        const lng = e.latLng.lat().toString();
        const coordinates = lat + ", " + lng;
        console.log(coordinates);
    };
    let getPointStudio = async()=> {
        let response = await fetch(`http://127.0.0.1:8000/studio/sortby/point/?latitude=${lat}&longitude=${lng}&page=${page_num_post}`, {
            method: "GET",
            headers: {
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
    //renderer
        return (
            <div>
                <div className="studio-upper"><h5 className="h2-text">Find Studios: Pinpoint on Map</h5></div>
{/*                <br/>
            <h1>Find Studios</h1>*/}
                <h6 className="studio-list">Set pinpoint on map to sort studios:</h6>
                <Link to="/studio/filter/" className="studio-list"><Button variant="light">Filter</Button></Link>

            <Map
                google={window.google}
                className="studio-list"
                onClick={mapClicked}
                style={{ width: "70%", height: "50vh" }}
                zoom={12}
                initialCenter={{
                    lat: 43.660928,
                    lng: -79.395899
                }}
            >
                {markers.map((marker, index) => (
                    //marker
                    <Marker
                        key={index}
                        title={marker.title}
                        name={marker.name}
                        position={marker.position}
                        onClick={onMarkerClick}
                    ></Marker>
                ))}
                {/*infoWindow*/}
            </Map>
                <div className="pinpoint-buttons">
                <Dropdown className="studio-list">
                    <Dropdown.Toggle id="dropdown-basic">
                        Sorting by Pinpoint
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} activeStyle={{}} to="/studio/postcode/">Sort By Postal Code</Dropdown.Item>
                        <Dropdown.Item as={Link} activeStyle={{}} to="/studio/sortby/currlocation">Sort By Current Location</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <br/>
                </div>

                <div>

{/*                <Link to="/studio/sortby/currlocation" className="studio-list"><Button variant="light">View All Studios</Button></Link>
                <Link to="/studio/postcode/" className="studio-list"><Button variant="light">Sort By Postal Code</Button></Link>*/}
                </div>
                <div className="map-page">

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
                                        {localStorage.getItem("authTokens") && (
                                            <Link to={"/studio/" + studio.id + "/classes"}><Button variant="primary">Studio Classes</Button></Link>
                                        )}
                                        {!localStorage.getItem("authTokens") && (
                                            <Link to={"/subscriptions"}><Button variant="primary">Studio Classes</Button></Link>
                                        )}
                                    </div>
                                </Card.Body>
                                <Card.Footer className="text-muted" key={studio.phone_num}>Contact at {studio.phone_num}</Card.Footer>
                            </Card>
                            <br/>
                        </>
                    ))}
                </div>
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
        );
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyCYQ9rgbyH2mlOIun5ESSCkOuyjFIDX1NM"
})(SortStudioMap);
/*
import React, {useContext, useState, useEffect, useRef} from "react";
import AuthContext from "../context/AuthContext";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Map from "../components/Map";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Pagination from "react-bootstrap/Pagination";
//is this saved ?
const SortStudioMap = () => {
    const [studioList, setStudioList] = useState([])
    const {authTokens, logoutUser} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    let [postCode, setPostCode] = useState("")
    const [page_num_post, setPageNumPost] = useState(1)
    const [prev, setPrev] = useState(false)
    const [next, setNext] = useState(true)
    let [lat, setLat] = useState(0)
    let [long, setLong] = useState(0)
    const [markers, setMarker] = useState([]);

    const onMapClick = (e) => {
        setMarker((current) => [
            ...current,
            {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            }
        ]);
    };


    useEffect(() => {
        setPageNumPost(1)
        getPointStudio()
    },[lat, long])

    const handleNextbtn = () => {
        if(next){
            getPointStudio()
        }
    }
    const handlePrevbtn = () => {
        if (prev && next){
            setPageNumPost(page_num_post => page_num_post - 2)
            getPointStudio()
        }else if (!prev){
            setPageNumPost(1)
        }else {
            setPageNumPost(page_num_post => page_num_post - 1)
            getPointStudio()
        }

    }


    let getPointStudio = async()=>{
        let response = await fetch(`http://127.0.0.1:8000/studio/sortby/point/?latitude=${lat}&longitude=${long}&page=${page_num_post}`, {
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
            <br/>
            <h1>Find Studios</h1>
            <Map onClick={onMapClick} studios={studioList}/>
            <Form className="post-code-form" onSubmit={e => { e.preventDefault(); }}>
                <label htmlFor="lat">Enter latitude</label>
                <br/>
                <Form.Control type="number"
                              id="lat"
                              placeholder="Latitude"
                              onChange={e => setLat(e.target.value)}/>
                <label htmlFor="long">Enter longitude</label>
                <br/>
                <Form.Control type="number"
                              id="long"
                              placeholder="Longitude"
                              onChange={e => setLong(e.target.value)}/>
            </Form>
            <br/>
            <Link to="/studio/sortby/currlocation" className="studio-list"><Button variant="light">View All Studios</Button></Link>
            <Link to="/studio/postcode/" className="studio-list"><Button variant="light">Sort By Postal Code</Button></Link>

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
                                    <Link to={"/studio/" + studio.id + "/details"}><Button variant="primary">Studio Details</Button></Link>
                                </div>
                            </Card.Body>
                            <Card.Footer className="text-muted" key={studio.phone_num}>Contact at {studio.phone_num}</Card.Footer>
                            {/!*                        {postCode && (
                            <Card.Footer className="text-muted" key={studio.location.distance}>{studio.location.distance} km from {postCode}</Card.Footer>
                        )}*!/}
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

export default SortStudioMap


*/
