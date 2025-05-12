import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { NavbarMain } from "./NavbarMain";

export default function Logout() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    Cookies.remove("access_token");
    navigate("/");
    };

  return (
    <div>
        <NavbarMain/>
        <div className="container">
        <h1 className="title">Logout</h1>
        <h1>Are you sure you want to Log out</h1>
        <div>
          <button className="btn-secondary" onClick={handleLogout}>
            Log out
          </button>
        </div>
        </div>
    </div>
  );
}