import React, {useContext, useState, useEffect} from "react";
import AuthContext from "../context/AuthContext";
import Button from "react-bootstrap/Button";
import {Link, useParams, useLocation, NavLink} from "react-router-dom";
import CardContainer from "react-card-container";
import Map from "../components/Map";
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import './SubscriptionsPage.css'
import Alert from "react-bootstrap/Alert";

const EditSubscriptionPage = () => {
    const {id} = useParams();
    let [subscriptionsList, setSubscriptions] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)
    const [authenticated, setauthenticated] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [popup, setPopup] = useState("")
    const [error, setError] = useState("")
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

    let getSubscriptionStatus = async() => {
        let response = await fetch(`http://127.0.0.1:8000/future/`, {
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

    const editSubscription = async(membership_id) => {
        let response = await fetch(`http://127.0.0.1:8000/subscriptions/edit/`, {
            method: "PATCH",
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + String(authTokens.access)
            },
            body:JSON.stringify({
                membership: membership_id
            })
        })
        let data = await response.json()
        console.log(data)
        if (response.status === 200){
            console.log(data)
            setPopup("Successfully edited the membership")
        } else if (response.status === 403) {
            setError("You are not currently subscribed to any subscription.")
        }
    }

    const cancelSubscription = async() => {
        let response = await fetch(`http://127.0.0.1:8000/subscriptions/cancel/`, {
            method: "DELETE",
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + String(authTokens.access)
            }
        })
        let data = await response.json()
        console.log(data)
        if (response.status === 200){
            console.log(data)
            setPopup("Successfully cancelled the current subscription. All future enrolled classes have been dropped.")
        } else if (response.status === 403) {
            setError("You are not currently subscribed to any subscription.")
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
                                <Button class="subscribe_button" onClick={() => editSubscription(props.id)}>Subscribe</Button>
                            )}
                            {!localStorage.getItem("authTokens") && (
                                // <NavLink to="/login" state={{ prev: location.pathname }}><Button variant="primary">Subscribe</Button></NavLink>
                                // <Link to={ redirect_path }><Button class="subscribe_button">Subscribe</Button></Link>
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

    // if (isSubscribed) {
        return (
            <div className="background">
                <br/>
                <h1 style={{color: "white"}}>Edit Subscriptions</h1>
                <br/>
                <div style={{textAlign:"center", color: "whitesmoke"}}>Explore other plans or cancel your existing plan</div>
                <CardContainer cards={ subscriptionsList }/>
                {popup && <Alert style={{width: "43%", marginLeft: "55vh"}} variant="success">
                    {popup}
                </Alert>}
                {error && <Alert style={{width: "30%", marginLeft: "64vh"}} key="danger" variant="danger">
                    {error}
                </Alert>}
                <span style={{margin:"auto", display:"table"}}><Button class="subscribe_button" onClick={() => cancelSubscription()} style={{float:"center", margin:"auto"}}>Cancel Subscription</Button></span>
                {/* <Link to={ `/subscriptions/subscribe` }><Button class="subscribe_button" style={{float:"center", margin:"auto"}}>Cancel Subscription</Button></Link> */}
            </div>
    
        )
    // } 

    // return (
    //     <div className="background">
    //         <br/>
    //         <h1 style={{color: "white"}}>Subscriptions</h1>
    //         <br/>
    //         <div style={{textAlign:"center", color: "whitesmoke"}}>Explore other plans, or cancel your existing plan</div>
    //         <CardContainer cards={ subscriptionsList }/>
    //     </div>
    // )
}

export default EditSubscriptionPage


