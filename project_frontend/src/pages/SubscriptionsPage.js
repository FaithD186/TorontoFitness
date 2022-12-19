import React, {useContext, useState, useEffect} from "react";
import AuthContext from "../context/AuthContext";
import Button from "react-bootstrap/Button";
import {Link, useParams, useLocation, NavLink} from "react-router-dom";
import CardContainer from "react-card-container";
import Map from "../components/Map";
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import './SubscriptionsPage.css'

const SubscriptionsPage = () => {
    const {id} = useParams();
    let [subscriptionsList, setSubscriptions] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)
    const [authenticated, setauthenticated] = useState(null);
    const [loginError, setLoginError] = useState(false)
    const location = useLocation();

    useEffect(() => {
        getSubscriptionInfo()
    },[]);

    let getSubscriptionInfo = async() => {
        let response = await fetch(`http://127.0.0.1:8000/subscriptions/memberships/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        let data = await response.json()
        if (response.status === 200){
            console.log(data)
            setSubscriptions(data.results)
        }else if (response.status === 401){
            setLoginError("You must be logged in to subscribe")
        }
    }


    var frequency_dict = {1: "Daily", 7: "Weekly", 30: "Monthly", 365: "Yearly"};
    var redirect_path = "/login?redirect=subscriptions"


    const Card = (props) => (
        <div>
                <div className="subscription_card">
                    <div className="card_data">
                        <div key={ props.id }>
                            <div key={ props.membership }><h3>{ frequency_dict[props.membership] }</h3></div>
                            <div key={ props.membership }><h5>${ props.price }/{ props.membership } days</h5></div>
                            <br />
                            <br/>
                            <br/>
                            <hr />
                            {localStorage.getItem("authTokens") && (
                                <Link to={ `/subscriptions/${props.id}/subscribe` }><Button class="subscribe_button">Subscribe</Button></Link>
                            )}
                            {!localStorage.getItem("authTokens") && (
                                // <NavLink to="/login" state={{ prev: location.pathname }}><Button variant="primary">Subscribe</Button></NavLink>
                                <Link to={ redirect_path }><Button class="subscribe_button">Subscribe</Button></Link>

                            )}
                        </div>
                    </div>
                </div>
        </div>
    );


    const CardContainer = (props) => (
        <div className="subscription_container">
          {
            props.cards.map((card) => (
              <Card membership={ card.membership }
                price={ card.price }
                id={ card.id } />
            ))
          }
        </div>
      );



    return (
        <div className="background">
            <br/>
            <h1 style={{color: "white"}}>Subscriptions</h1>
            <br/>
            <div style={{textAlign:"center", color: "whitesmoke"}}>Subscribe to one of our plans to book your first class!</div>
            {/* <div style={{textAlign:"center", color: "whitesmoke"}}>Or if you're already subscribed, explore other plans:</div>            */}
            <CardContainer cards={ subscriptionsList }/>
        </div>
    )
}

export default SubscriptionsPage


