import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { NavbarMain } from "./NavbarMain";

export default function Home() {
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
    <NavbarMain/>
    <div className="container">
        <h1 className="title">Welcome to Verimed</h1>
        <p>Verimed is a Blockchain based medical record system</p>
        <img src="verimed.png" alt="verimedlogo"></img>
    </div>
    </>
  );
}
