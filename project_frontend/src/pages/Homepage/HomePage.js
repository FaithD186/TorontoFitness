import React, { useEffect } from 'react'
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import './Homepage.css'
import Nav from "react-bootstrap/Nav";
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import Slider from "react-slick";
import CardContainer from "react-card-container";
import { propTypes } from 'react-bootstrap/esm/Image';
import {Link} from "react-router-dom";



const HomePage = () => {
    const {user} = useContext(AuthContext);

    return (
        <>
        <div className="hero">
            <div className="hero-text">
                <div className="main-text">Your Fitness Journey Begins Here</div>
                <div className="subtext">Join us at The Toronto Fitness Club, at a location near you.</div>
                {!localStorage.getItem("authTokens") && (
                    <div className="button"><Link to="/login">Begin your Journey</Link></div>
                )}
                {localStorage.getItem("authTokens") && (
                    <div className="button"><Link to="/studio/postcode/">Find Studios Near You</Link></div>
                )}
            </div>
        </div>
        <div className="second-section">
            <div className="gym-img box"></div>
            <div className="hero-text">
            <div className="subtext-second">
                You’ve probably heard this before – motivation doesn’t last.
                It comes and goes, and when you need it most, it can be the hardest to find.
                Here at TFC, we help you to stay on track with your fitness goals – and even reach beyond them.
            </div>
                <div className="subtext-second"> We offer classes ranging from HIIT to yoga, to spin, in studios all across Toronto.
                </div>
                <div className="button" style={{marginLeft: "-70px"}}><Link to="/studio/postcode/">Find Studios Near You</Link></div>
            </div>

        </div>
            <div className="third-section">
                <div className="hero-text">
                    <div className="main-text-third">Explore Our Subscription Plans</div>
                    <div className="subtext-second-wide">
                        TFC offers multiple subscription plans to suit your needs and keep you motivated.
                    </div>
                    <div className="subtext-second-wide">
                        Come, make Toronto fit!
                    </div>
                    <div className="button" style={{marginLeft: "-70px"}}><Link to="/subscriptions">View Subscription Plans</Link></div>

                    
                </div>
            </div>
        </>
    )
}

export default HomePage