import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { NavbarMain } from "./NavbarMain";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";

export default function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [previousResponses, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();

  const generativeAI = new GoogleGenerativeAI("AIzaSyB1SdBjXOBqRaQHiYgcdmbCcFQLB_mqkds");
  const model = generativeAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      navigate("/");
    } else {
      getUserDetails(accessToken);
    }
  }, [navigate]);

  const getUserDetails = async (accessToken) => {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
    );
    const data = await response.json();
    setUserDetails(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    await sendMessage(userInput.trim());
    setUserInput("");
  };

  const sendMessage = async (message) => {
    setLoading(true);
    setResponse((prev) => [...prev, { type: "user", msg: message }]);
  
    try {
      const response = await fetch('https://verimed-backend-d97h.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
  
      if (!response.ok) throw new Error('API request failed');
  
      const data = await response.json();
      
      if (data.success) {
        setResponse((prev) => [...prev, { type: "bot", msg: data.text }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse((prev) => [...prev, { 
        type: "bot", 
        msg: "Sorry, I'm having trouble responding right now. Please try again later."
      }]);
    } finally {
      setLoading(false);
    }
  };
  
  const clearChat = () => {
    setResponse([]);
  };

  return (
    <>
      <NavbarMain />
        <div className="container">
      <h1 className="title">Chatbot</h1>
      <p>Disclaimer: all responses are merely suggestions please consult a medical professional if any medicine is required</p>
      <div>
        <div>
          {previousResponses.map((message, index) => (
            <div key={index} className={message.type === "user" ? "user-message" : "bot-message"}>
                <div>
                    {message.type === "bot" && <p>Bot:</p>}
                </div>
                <div>
                    {message.type === "user" && <p>{userDetails.name}:</p>}
                    <ReactMarkdown>{message.msg}</ReactMarkdown>
                </div>
            </div>
          ))}

          {loading && (
            <div>I am Thinking...</div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Enter your query here" value={userInput} onChange={(e) => setUserInput(e.target.value)}/>
          <button type="submit" className="btn-primary" disabled={loading}>
            Send
          </button>
        </form>
        <button className="btn-secondary" onClick={clearChat}>
          Clear Chat
        </button>
      </div>
      </div>
    </>
  );
}
