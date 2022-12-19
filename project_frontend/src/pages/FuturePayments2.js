import React, {useContext, useState, useEffect} from "react";
import AuthContext from "../context/AuthContext";
import {Link} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


const FuturePayments2 = () => {
    const [payment, setPayment] = useState([])
    const {authTokens, logoutUser} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState([])


    useEffect(() => {
        getPayment()
    },[])

    let getPayment = async() => {
        let response = await fetch("http://127.0.0.1:8000/subscriptions/payments/future/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + String(authTokens.access)
            }  
        })
        let data = await response.json()
        if (response.status === 200){
            console.log(data)
            setPayment(data.future_payment)
            setLoading(false)
        }else if(response.statusText==='Unauthorized'){
            logoutUser()
        }else{
            setError("No Upcoming payments. Subscribe to one of our options to start booking classes!")
        }
    }
    if (loading){
        return (
            <div></div>
        )
    }

    return (
        <div>
            <div className="studio-upper"><h5 className="h2-text">Upcoming Payment</h5></div>
            <br/>
            <p className="studio-list">Your upcoming payment bill:</p>
            <div>{error}</div>
            <Card className="studio-list">
                <Card.Body>
                    <div><Card.Title>{payment.next_payment_date.split("T")[0]}</Card.Title></div>
                    <div><p className="mb-2 text-muted">{payment.next_payment_date.split("T")[1].split(".")[0]}</p></div>
                    <Card.Subtitle>${payment.amount}</Card.Subtitle>
                    <Card.Text>
                    <div>Card: {payment.card.card_num}</div>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )

}

export default FuturePayments2