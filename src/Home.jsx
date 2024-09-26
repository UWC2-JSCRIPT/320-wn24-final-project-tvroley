import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Nav from "./Nav";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Home() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [resultMessage, setResultMessage] = useState([]);
  const [logoutMessage, setLogoutMessage] = useState(``);

  const login = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
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
            body: JSON.stringify({
              email: userCredential.user.email,
              password: password,
            }),
          },
        );
        if (response.status === 200) {
          response.json().then((data) => {
            setToken(data.token);
            localStorage.setItem("cardsToken", data.token);
            localStorage.setItem("cardsUsername", data.username);
            setResultMessage(`Welcome ${data.username}`);
            setPassword(``);
            setUsername(``);
            setLogoutMessage(``);
            setEmail(``);
            goCollection();
          });
        } else if (response.status === 401) {
        } else {
          setResultMessage(`Invalid login`);
          setLogoutMessage(``);
        }
      })
      .catch((error) => {
        setResultMessage(`Error logging in: ${error.code} ${error.message}`);
      });
  };

  const logout = () => {
    localStorage.removeItem("cardsToken");
    localStorage.removeItem("cardsUsername");
    setLogoutMessage(`You logged out`);
  };

  const navigate = useNavigate();

  const goCollection = () => {
    navigate("/collection");
  };

  const goSignUp = () => {
    navigate("/signup");
  };

  const goAllCollections = () => {
    navigate("/allcollections");
  };

  return (
    <>
      <h2>Welcome To Card Collections!</h2>
      <p>
        If you have an account, login and go to "My Collection" to manage and
        view your collection
      </p>
      <div className="div-login">
        <div className="div-enter-collection">
          <label htmlFor="email-input">Email:</label>
          <input
            id="email-input"
            type="text"
            min="1"
            max="50"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="div-enter-collection">
          <label htmlFor="password-input">Password:</label>
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
          <input
            id="login-btn"
            className="btn"
            type="submit"
            value="Login"
            onClick={login}
          />
        </div>
      </div>
      <p>{resultMessage}</p>
      <div className="div-home-buttons">
        <button id="collection-button" onClick={goCollection}>
          My Collection
        </button>
      </div>
      <p>
        If you would like an account for your trading card collections, sign up
        below
      </p>
      <div className="div-home-buttons">
        <button id="signup-button" onClick={goSignUp}>
          Sign Up
        </button>
      </div>
      <div>
        <p>
          If you don't have an account, and would like to view collections, go
          to "All Collections"
        </p>
        <div className="div-home-buttons">
          <button id="all-collections-button" onClick={goAllCollections}>
            All Collections
          </button>
        </div>
      </div>
      <div className="div-logout">
        <button onClick={logout}>Logout</button>
      </div>
      <p>{logoutMessage}</p>
      <Nav />
    </>
  );
}
