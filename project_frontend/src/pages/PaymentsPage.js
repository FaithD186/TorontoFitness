import React, {useContext, useState, useEffect, useRef} from "react";
import AuthContext from "../context/AuthContext";
import Card from 'react-bootstrap/Card';
import Pagination from "react-bootstrap/Pagination";
//is this saved ?
const PaymentsPage = () => {
    const [paymentsList, setPaymentsList] = useState([])
    const {authTokens, logoutUser} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [page_num_post, setPageNumPost] = useState(1)
    const [page_num_curr, setPageNumCurr] = useState(1)
    const [getcurr, setGetCurr] = useState(false)
    const [getpost, setGetPost] = useState(true)
    const [prev, setPrev] = useState(false)
    const [next, setNext] = useState(true)


    useEffect(() => {
        getPayments()
    },[])

    const handleNextbtn = () => {
        if(next){
            getPayments()
        }
    }
    const handlePrevbtn = () => {
        if (prev && next){
            setPageNumPost(page_num_post => page_num_post - 2)
            getPayments()
        }else if (!prev){
            setPageNumPost(1)
        }else {
            setPageNumPost(page_num_post => page_num_post - 1)
            getPayments()
        }

    }
    let getPayments = async()=>{
        setGetCurr(true)
        setGetPost(false)

        let response = await fetch(`http://127.0.0.1:8000/subscriptions/payments/history/`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + String(authTokens.access)
            }
        })
        let data = await response.json()
        if (response.status === 200){
            setPaymentsList(data.payments)
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

    return (
        <div>
            <div className="studio-upper"><h5 className="h2-text">Payment History</h5></div>
           <br/>
            {/* <h1>TESTTTTT</h1> */}
            {/* <h6 className="studio-list">Viewing All Studios</h6> */}
            <br/>
            <div className="studio-list">
                {paymentsList.map(transaction => (
                    <>
                    <Card>
                        <Card.Body>
                            <div key={transaction.id}>
                            <div key={transaction.payment_date}><Card.Title>{transaction.payment_date.split("T")[0]}</Card.Title></div>
                            <div key={transaction.payment_date}><p className="mb-2 text-muted">{transaction.payment_date.split("T")[1].split(".")[0]}</p></div>
                            <br />
                            <div key={transaction.amount}><Card.Subtitle>${transaction.amount}</Card.Subtitle></div>
                            <Card.Text>
                            <div key={transaction.card.card_num}>Card: {transaction.card.card_num}</div>
                            </Card.Text>
                             </div>
                        </Card.Body>
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

export default PaymentsPage
