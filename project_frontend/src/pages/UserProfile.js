import React, {useContext, useState, useEffect} from "react";
import AuthContext from "../context/AuthContext";
import {Link} from "react-router-dom";
import Button from 'react-bootstrap/Button';



const UserProfile = () => {
    let [userprofile, setUserProfile] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)

    useEffect(() => {
        getProfile()
    },[])

    let getProfile = async()=>{
        let response = await fetch("http://127.0.0.1:8000/accounts/profile/view/", {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + String(authTokens.access)
            }
        })
        let data = await response.json()
        if (response.status === 200){
            setUserProfile(data)
        }else if(response.statusText==='Unauthorized'){
            logoutUser()
        }


    }
    // `http://localhost:8000/media/avatars/${userprofile.avatar}`
    return (
        <div className="profile-container">
            {/*<h1>Your Profile Page</h1>*/}
            <div className="background-photo"></div>
            <br/>
            <div className="profile">
                <p>First name: {userprofile.first_name}</p>
                <p>Last name: {userprofile.last_name}</p>
                <p>Email: {userprofile.email}</p>
                <p>Phone Number: {userprofile.phone_num}</p>
  {/*              <p>Avatar:</p>*/}
                <div className="avatar-box">{ userprofile.avatar?
                    (<img src={`http://localhost:8000${userprofile.avatar}`} className="avatar" alt="profile-pic"/>)
                    :(<img src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"} className="avatar" alt="profile-pic"/>)}</div>
                <br/>
                <br/>
                <br/>
            </div>
            <div className="edit-button"><Link to="/profile/edit"><Button variant="light">Edit Profile</Button></Link></div>

        </div>
    )
}

export default UserProfile