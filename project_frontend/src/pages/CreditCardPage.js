import React, {useContext, useState, useEffect} from "react";
import AuthContext from "../context/AuthContext";
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {Link, useParams} from "react-router-dom";
import Alert from "react-bootstrap/Alert";


const CreditCardPage = () => {
    const {id} = useParams();
    const [membership, setMembership] = useState(0)
    const [card_num, setCardNum] = useState("")
    const [card_expiry_month, setExpiryMonth] = useState("")
    const [card_expiry_year, setExpiryYear] = useState("")
    const [card_cvv, setCardCvv] = useState("")
    let {authTokens, logoutUser} = useContext(AuthContext)
    const [error, setError] = useState("")
    const [popup, setPopup] = useState("")

/*    useEffect(() => {
        setCard()
    },[])*/

    const handleSubmit = (e) => {
        e.preventDefault();
        setCard()
    }

    let setCard = async()=>{
        // setMembership(1)
        let response = await fetch(`http://127.0.0.1:8000/subscriptions/${id}/subscribe/`, {
            method: "POST",
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + String(authTokens.access)
            },
            body:JSON.stringify({
                membership: id,
                card_num: card_num,
                card_expiry_month: card_expiry_month,
                card_expiry_year: card_expiry_year,
                card_cvv: card_cvv
            })
        })
        let data = await response.json()
        console.log(data)
        if (response.status === 200){
            //navigate so some page
            console.log(data)
            setPopup("Successfully subscribed to the membership. Find studios near you to book a class!")

        }else if(response.status === 403){
            console.log(data)
            setError("You are already subscribed to a membership")
        }

    }
    return (
        <>
            <Form onSubmit={handleSubmit}>
                <h1>Enter your Card Information</h1>
                <hr />
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="card_num">Card Number</Form.Label>
                    <Form.Control type="text" id="card_num" onChange={e => setCardNum(e.target.value)} placeholder="Card number"/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="card_expiry_month">Expiry Month</Form.Label>
                    <Form.Control type="text" id="card_expiry_month" onChange={e => setExpiryMonth(e.target.value)} placeholder="Expiry Month"/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="card_expiry_year">Expiry Year</Form.Label>
                    <Form.Control type="text" id="card_expiry_year" onChange={e => setExpiryYear(e.target.value)} placeholder="Expiry Year"/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="card_cvv">CVV</Form.Label>
                    <Form.Control type="text" id="card_cvv" onChange={e => setCardCvv(e.target.value)} placeholder="CVV"/>
                </Form.Group>
                <Button variant="primary" type="submit">Register</Button>
                <br/>
                <br/>
                {error && <Alert key="danger" variant="danger">
                    {error}
                </Alert>}
                {popup && <Alert style={{width: "70%", marginLeft: "10vh"}} variant="success">
                    {popup}
                </Alert>}

            </Form>
        </>
    )

}
export default CreditCardPage