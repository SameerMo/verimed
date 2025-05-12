import { Link } from 'react-router-dom'

export function NavbarMain() {
  return (
    <nav>
        <ul>
            <li>
                <Link to ="/Home">Home</Link>
            </li>
            <li>
                <Link to="/Records">Records</Link>
            </li>
            <li>
                <Link to="/Profile">Profile</Link>
            </li>
            <li>
                <Link to="/Chatbot">Chatbot</Link>
            </li>
            <li>
                <Link to="/Logout">Logout</Link>
            </li>
        </ul>
    </nav>
  )
}
