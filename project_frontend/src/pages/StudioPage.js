import React, {useContext, useState, useEffect} from "react";
import AuthContext from "../context/AuthContext";
import Button from "react-bootstrap/Button";
import {Link, useParams} from "react-router-dom";
import Map from "../components/Map";
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';

const StudioPage = () => {
    const {id} = useParams();
    let [studio, setStudio] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getStudioInfo()
    },[])


    let getStudioInfo = async()=>{
        let response = await fetch(`http://127.0.0.1:8000/studio/${id}/details/`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            }
        })
        let data = await response.json()
        if (response.status === 200){
            console.log(data)
            setStudio(data)
            setLoading(false)
        }else if(response.statusText==='Unauthorized'){
            logoutUser()
        }

    }
    if (loading){
        return (
            <div></div>
        )
    }
    return (
        <div className="studio-background">
            <div key={studio.name} className="studio-name"><h1 className="studio-text">{studio.name}</h1>
                <br/>
            <Link to={"/studio/" + studio.id + "/classes"}><Button variant="primary">View Classes for this Studio</Button></Link>
            </div>
        <div className="studio-list">
{/*            <h1 key={studio.name}>key={studio.name}</h1>
            <br/>*/}
            <div className="card-map">
                <div className="d-grid gap-2">
                </div>
                <br/>
            <Card>
                <Card.Header style={{backgroundColor: '#3F383F', color: 'white'}}>General Info</Card.Header>
                <Card.Body>
                <div>
                <div key={studio.phone_num}>Phone Number: {studio.phone_num}</div>
                {studio.location && <div key={studio.location.address}>Address: {studio.location.address}</div>}
                {studio.location && <div key={studio.location.post_code}>Postal Code: {studio.location.post_code}</div>}
                {studio.location && <div key={studio.location.directions}><a href={studio.location.directions} target="_blank">Get Directions</a></div>}
                </div>
            </Card.Body>
            </Card>
            </div>
            <br/>
            <Card>
                <Card.Header style={{backgroundColor: '#3F383F', color: 'white'}}>Amenities</Card.Header>
                <Card.Body>
                    <div>
                        {studio.amenities?.map(amenity => (
                            <>
                                <div key={amenity.type}>{amenity.type}: {amenity.quantity}</div>
                            </>
                        ))}
                    </div>
                </Card.Body>
            </Card>
        </div>

            <Map studios={[studio]}/>
            <h5 className="studio-list">Photos</h5>
            <div className="studio-list">
                { studio.photos.length? (
                    <Carousel variant="dark" className="studio-list">
                        {studio.photos?.map(photo => (
                            <Carousel.Item>
                                <img src={`http://localhost:8000${photo.photo}`} alt="studio-photo" className="d-block w-100"/>
                            </Carousel.Item>

                        ))}
                    </Carousel>
                ):""}

            <br/>
            </div>
        </div>

    )
}

export default StudioPage