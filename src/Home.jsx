import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Nav from "./Nav";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [resultMessage, setResultMessage] = useState([]);

  const login = async (event) => {
    event.preventDefault();
    const response = await fetch(
      `https://trading-cards-backend-production.up.railway.app/auth/login`,
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ username: username, password: password }),
      },
    );
    if (response.status === 200) {
      response.json().then((data) => {
        setToken(data.token);
        localStorage.setItem("cardsToken", data.token);
        localStorage.setItem("cardsUsername", username);
        setResultMessage(`Welcome ${username}`);
        setPassword(``);
        setUsername(``);
      });
    } else {
      setResultMessage(`Invalid login`);
    }
  };

  const navigate = useNavigate();

  const goCollection = () => {
    navigate("/collection");
  };

  return (
    <>
      <div className="div-home-buttons">
        <button onClick={goCollection}>My Collection</button>
      </div>
      <div className="div-add-collection">
        <div className="div-enter-collection">
          <label htmlFor="username-input">Username</label>
          <input
            id="username-input"
            type="text"
            min="1"
            max="50"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          />
        </div>
        <div className="div-enter-collection">
          <label htmlFor="password-input">Password</label>
          <input
            id="password-input"
            type="text"
            min="1"
            max="100"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <div className="div-input-group">
          <input className="btn" type="submit" value="Login" onClick={login} />
        </div>
      </div>
      <p>{resultMessage}</p>
      <Nav />
    </>
  );
}
