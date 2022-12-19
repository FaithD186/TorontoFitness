import React, {useContext, useState, useEffect} from "react";
import AuthContext from "../context/AuthContext";
import Form from 'react-bootstrap/Form';
import {Link, useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Alert from "react-bootstrap/Alert";


const EditCardPage = () => {
    // need to use props to pass in initial state as user's existing profile info, allow_blank=True
    // OR: only pass into body non-empty fields, no need for allow_blank - only change fields that are non-empty
    // let [userprofile, setUserProfile] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)

    const [card_num, setCardNum] = useState("")
    const [card_expiry_month, setCardExpiryMonth] = useState("")
    const [card_expiry_year, setCardExpiryYear] = useState("")
    const [card_cvv, setCardCVV] = useState("")
    const [popup, setPopup] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();
        let form_data = new FormData();
        if (card_num !== ''){
            form_data.append('card_num', card_num);
        }
        if (card_expiry_month !== ''){
            form_data.append('card_expiry_month', card_expiry_month);
        }
        if (card_expiry_year !== ''){
            form_data.append('card_expiry_year', card_expiry_year);
        }
        if (card_cvv !== ''){
            form_data.append('card_cvv', card_cvv);
        }

        let url = 'http://127.0.0.1:8000/subscriptions/card/edit/';
        axios.patch(url, form_data, {
            headers: {
                'content-type': 'multipart/form-data',
                "Authorization": "Bearer " + String(authTokens.access)
            }
        })
            .then(res => {
                console.log(res.data);
                setPopup("Succesfully edited the card.")
                navigate("/subscriptions/payments/future/")
            })
            .catch(err => {
                console.log(err)
                setError("You must be subscribed to edit your card.")
            })
    };

/*    useEffect(() => {
        EditProfile(first_name, last_name, email, phone_num, avatar)
    },[])*/

/*    const handleSubmit = async (e) =>{
        e.preventDefault()
        EditProfile()
    }
    const removeEmptyKeys = (item)=>{
        Object.keys(item).map((key)=>{
            if(payload[key]==="" || payload[key]===null){
                delete payload[key]}
        })}
    var payload = {
        "first_name": first_name,
        "last_name": last_name,
        "email":email,
        "phone_num":phone_num,
        "avatar":avatar
    }
    removeEmptyKeys(payload)*/


/*    let EditProfile = async()=>{
        console.log("payload is", payload)
        let response = await fetch("http://127.0.0.1:8000/accounts/profile/edit/", {
            method: "PATCH",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + String(authTokens.access)
            },
            body: JSON.stringify(payload)
        })
        let data = await response.json()
        if (response.status === 200){
            setUserProfile(data)
            navigate("/profile/view");
        }else if(response.statusText==='Unauthorized'){
            logoutUser()
        }
    }*/


    return (
        <section>
            <Form onSubmit={handleSubmit}>
                <h1>Edit Card Info</h1>
                <hr />

                <div className="mb-3">
                    <label htmlFor="card_num">Card Number</label>
                    <Form.Control
                        type="text"
                        id="card_num"
                        onChange={e => setCardNum(e.target.value)}
                        placeholder="Card Num"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="card_expiry_month">Expiry Month</label>
                    <Form.Control
                        type="text"
                        id="card_expiry_month"
                        onChange={e => setCardExpiryMonth(e.target.value)}
                        placeholder="Expiry Month"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="card_expiry_year">Expiry Year</label>
                    <Form.Control
                        type="card_expiry_year"
                        id="card_expiry_year"
                        onChange={e => setCardExpiryYear(e.target.value)}
                        placeholder="Expiry Year"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="card_cvv">CVV</label>
                    <Form.Control
                        type="text"
                        id="card_cvv"
                        onChange={e => setCardCVV(e.target.value)}
                        placeholder="CVV"
                    />
                </div>
                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
                <br></br>
                <br></br>
                <div style={{color: "green"}}>{popup}</div>
                {error && <Alert key="danger" variant="danger">
                    {error}
                </Alert>}
            </Form>
        </section>
    )
}

export default EditCardPage