import React from "react";
import GoogleMapReact from 'google-map-react';
import Marker from './Marker.jsx';

//const Marker = ({ text }) => <div>{text}</div>;

export default function Map(studios){
    const defaultProps = {
        center: {
            lat: 43.813178,
            lng: -79.341213
        },
        zoom: 10
    };


    return (
        // Important! Always set the container height explicitly
        <div className="map" style={{ height: '50vh'}}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyCYQ9rgbyH2mlOIun5ESSCkOuyjFIDX1NM" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
            >
                {studios.studios.map(studio => (
                    <Marker
                        lat = {studio.location.latitude}
                        lng = {studio.location.longitude}
                        text = {studio.name}
                        color="blue"
                    />

                ))}


            </GoogleMapReact>
        </div>
    );
}