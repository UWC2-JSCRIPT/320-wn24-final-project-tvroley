import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Nav from "./Nav";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signUpusername, setSignUpusername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpPasswordConfirm, setSignUpPasswordConfirm] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [token, setToken] = useState("");
  const [resultMessage, setResultMessage] = useState([]);
  const [logoutMessage, setLogoutMessage] = useState(``);
  const [signUpMessage, setSignUpMessage] = useState(``);
  const [agree, setAgree] = useState(false);

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
        setLogoutMessage(``);
      });
    } else {
      setResultMessage(`Invalid login`);
      setLogoutMessage(``);
    }
  };

  const signUp = async (event) => {
    event.preventDefault();
    const userNameRegEx = /^[a-z0-9_]{5,20}$/;
    if (!userNameRegEx.test(signUpusername)) {
      setSignUpMessage(
        "Invalid username: Must use only lowercase letters, numbers, and underscores, and be between 5 and 20 characters in length",
      );
      return;
    }

    const passwordRegEx =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,30}$/;
    if (!passwordRegEx.test(signUpPassword)) {
      setSignUpMessage(
        "Invalid password: Must include a lowercase letter, an uppercase letter, a number, and a special character, and be between 8 and 30 characters in length",
      );
      return;
    }

    if (signUpPassword !== signUpPasswordConfirm) {
      setSignUpMessage("Repeated password does not match");
      return;
    }

    const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegEx.test(signUpPassword)) {
      setSignUpMessage("Invalid email address");
      return;
    }
  };

  const demoLogin = async () => {
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
        body: JSON.stringify({ username: "demo", password: "demo" }),
      },
    );
    if (response.status === 200) {
      response.json().then((data) => {
        setToken(data.token);
        localStorage.setItem("cardsToken", data.token);
        localStorage.setItem("cardsUsername", "demo");
        setResultMessage(`Welcome Demo User`);
        setPassword(``);
        setUsername(``);
        setLogoutMessage(``);
        goCollection();
      });
    } else {
      setResultMessage(`Invalid demo mode login`);
      setLogoutMessage(``);
    }
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

  const goAllCollections = () => {
    navigate("/allcollections");
  };

  const handleAgreeCheck = () => {
    setAgree(!agree);
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
          <label htmlFor="username-input">Username:</label>
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
      <div>
        <p>
          If you would like an account for your trading card collections, sign
          up below
        </p>
        <div className="div-login">
          <div className="div-input-group">
            <div className="div-enter-collection">
              <label htmlFor="signup-username-input">Username:</label>
              <input
                id="signup-username-input"
                type="text"
                min="5"
                max="20"
                onChange={(e) => setSignUpusername(e.target.value)}
                value={signUpusername}
                required
              />
            </div>
            <div className="div-enter-collection">
              <label htmlFor="signup-email-input">Email:</label>
              <input
                id="signup-email-input"
                type="text"
                min="1"
                max="50"
                onChange={(e) => setSignUpEmail(e.target.value)}
                value={signUpEmail}
                required
              />
            </div>
          </div>
          <div className="div-input-group">
            <div className="div-enter-collection">
              <label htmlFor="signup-password-input">Password:</label>
              <input
                id="signup-password-input"
                type="text"
                min="1"
                max="100"
                onChange={(e) => setSignUpPassword(e.target.value)}
                value={signUpPassword}
                required
              />
            </div>
            <div className="div-enter-collection">
              <label htmlFor="signup-password-confirm-input">
                Confirm Password:
              </label>
              <input
                id="signup-password-confirm-input"
                type="text"
                min="1"
                max="100"
                onChange={(e) => setSignUpPasswordConfirm(e.target.value)}
                value={signUpPasswordConfirm}
                required
              />
            </div>
          </div>
        </div>
        <div className="div-agreement">
          <p>
            By checking the box below, you agree to the following statements:
          </p>
          <p>
            I, the user, will only submit trading card information and pictures
            to this website.
          </p>
          <p>
            I will take responsibility for all photos and content I submit to
            this website.
          </p>
          <p>
            I will not submit any photos or writing not suitable for children.
          </p>
          <p>
            If I submit any violent or sexual photos or writing, my account will
            be deleted and I will be banned at the discretion of the website
            administrator.
          </p>
          <p>
            If I submit any content that is not a trading card, the content will
            be deleted, and my account could be deleted and I could be banned at
            the discretion of the website administrator.
          </p>
          <p>
            If I submit photos of trading cards that do not clearly show the
            trading card in the description, the trading card submission could
            be deleted at the discretion of the website administrator.
          </p>
        </div>
        <div className="div-login">
          <div className="div-input-group">
            <div className="div-enter-collection">
              <label
                htmlFor={`agreement-check`}
                id={`agreement-check-label`}
                key={`agreement-check-label`}
              >
                I agree to the above statements
              </label>
              <input
                type="checkbox"
                id={`agreement-check`}
                key={`agreement-check`}
                onChange={handleAgreeCheck}
                checked={agree}
              />
              <div className="div-input-group">
                <input
                  id="signup-btn"
                  className="btn"
                  type="submit"
                  value="Sign Up"
                  onClick={signUp}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p>{signUpMessage}</p>
      <div>
        <p>
          If you don't want to sign up for an account right now, and would like
          to use demo mode of My Collection, click the "Demo Mode" button
        </p>
        <div className="div-home-buttons">
          <button id="demo-button" onClick={demoLogin}>
            Demo Mode
          </button>
        </div>
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
