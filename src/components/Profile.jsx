import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { NavbarMain } from "./NavbarMain";

export default function Profile() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});

  const getUserDetails = async (accessToken) => {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
    );
    const data = await response.json();
    setUserDetails(data);
  };

  useEffect(() => {
    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      navigate("/");
    }

    getUserDetails(accessToken);
  }, [navigate]);

  return (
    <>
      {userDetails ? (
        <div>
            <NavbarMain/>
            <div className="container">
            <h1 className="title">Profile</h1>  
            <img
              src={userDetails.picture}
              alt={`${userDetails.given_name}'s profile`}
              className="profile-picture"
            />
            <p>Here are your details:</p>
            <h1>{userDetails.name}</h1>
            <p>{userDetails.email}</p>
            </div>
        </div>
      ) : (
        <div>
          <h1>Issue with User Details</h1>
        </div>
      )}
    </>
  );
}