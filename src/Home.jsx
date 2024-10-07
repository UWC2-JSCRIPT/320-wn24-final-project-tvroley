import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Nav from "./Nav";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import Mongo from "./Mongo";
import firebaseApp from "./firebaseApp";
import db from "./db";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { encrypt, decrypt } from "sjcl";

export default function Home() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [resultMessage, setResultMessage] = useState([]);
  const [logoutMessage, setLogoutMessage] = useState(``);
  const [passwordResetMessage, setPasswordResetMessage] = useState(``);
  const [passwordResetEmail, setPasswordResetEmail] = useState(``);
  const mongo = new Mongo();
  const secret = import.meta.env.VITE_CRYPTO_SECRET;

  const login = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const response = await mongo.login(email, password);
        if (response.status === 200) {
          response.json().then((data) => {
            setToken(data.token);
            sessionStorage.setItem("cardsToken", data.token);
            sessionStorage.setItem("cardsUsername", data.username);
            setResultMessage(`Welcome ${data.username}`);
            setPassword(``);
            setUsername(``);
            setLogoutMessage(``);
            setEmail(``);
            goCollection();
          });
        } else if (response.status === 401) {
          if (auth.currentUser.emailVerified) {
            const username = userCredential.user.displayName;
            const signUpResponse = await mongo.signup(
              email,
              username,
              password,
            );
            if (signUpResponse.status === 200) {
              signUpResponse.json().then(async (signUpData) => {
                const codedObj = encrypt(secret, password);
                setDoc(doc(db, "users", userCredential.user.uid), {
                  mongoPassword: codedObj,
                })
                  .then(async () => {
                    const loginResponse = await mongo.login(email, password);
                    if (loginResponse.status === 200) {
                      loginResponse.json().then((data) => {
                        setToken(data.token);
                        sessionStorage.setItem("cardsToken", data.token);
                        sessionStorage.setItem("cardsUsername", data.username);
                        setResultMessage(`Welcome ${data.username}`);
                        setPassword(``);
                        setUsername(``);
                        setLogoutMessage(``);
                        setEmail(``);
                        goCollection();
                      });
                    } else {
                      setResultMessage(
                        `Error logging in for the first time: ${signUpResponse.status} ${signUpResponse.statusText}`,
                      );
                    }
                  })
                  .catch((error) => {
                    setResultMessage(
                      `Error logging in for the first time.  Please try again or contact website admin ${error.status} ${error.statusText}`,
                    );
                  });
              });
            } else {
              let mongoPassword;
              const docref = doc(db, "users", auth.currentUser.uid);
              const docsnap = await getDoc(docref);
              if (docsnap.exists()) {
                const coded = docsnap.data().mongoPassword;
                mongoPassword = decrypt(secret, coded);
              } else {
                setResultMessage(`Error logging in with new password`);
              }
              if (mongoPassword) {
                const mongoLoginResponse = await mongo.login(
                  email,
                  mongoPassword,
                );
                if (mongoLoginResponse.status === 200) {
                  mongoLoginResponse.json().then(async (data) => {
                    const mongoToken = data.token;
                    const changePasswordResp =
                      await mongo.changePasswordWithToken(password, mongoToken);
                    if (changePasswordResp.status === 200) {
                      const codedObj = encrypt(secret, password);
                      setDoc(doc(db, "users", auth.currentUser.uid), {
                        mongoPassword: codedObj,
                      })
                        .then(() => {})
                        .catch((error) => {
                          setResultMessage(
                            `Error logging in with new password: ${error.message}`,
                          );
                        });
                      const secondLoginResponse = await mongo.login(
                        email,
                        password,
                      );
                      if (secondLoginResponse.status === 200) {
                        secondLoginResponse.json().then((data) => {
                          setToken(data.token);
                          sessionStorage.setItem("cardsToken", data.token);
                          sessionStorage.setItem(
                            "cardsUsername",
                            data.username,
                          );
                          setResultMessage(`Welcome ${data.username}`);
                          setPassword(``);
                          setUsername(``);
                          setLogoutMessage(``);
                          setEmail(``);
                          goCollection();
                        });
                      } else {
                        setResultMessage(
                          `Error logging in: ${secondLoginResponse.status} ${secondLoginResponse.statusText}`,
                        );
                      }
                    } else {
                      setResultMessage(
                        `Error logging in with new password: ${changePasswordResp.status}`,
                      );
                    }
                  });
                } else {
                  setResultMessage(
                    `Error logging in: ${signUpResponse.status} ${signUpResponse.statusText}`,
                  );
                }
              }
            }
          } else {
            sendEmailVerification(userCredential.user)
              .then(() => {
                setResultMessage(
                  `Please confirm your email.  Another confirmation email was sent to ${email}`,
                );
              })
              .catch((err) => {
                setResultMessage(
                  `Your email is not confirmed and there was an error sending another confirmation email to ${email}  Error: ${err.code} ${err.message}`,
                );
              });
          }
        } else {
          setResultMessage(`Error: ${response.statusText}`);
        }
      })
      .catch((error) => {
        setResultMessage(`Error logging in: ${error.code} ${error.message}`);
      });
    setLogoutMessage(``);
  };

  const logout = () => {
    sessionStorage.removeItem("cardsToken");
    sessionStorage.removeItem("cardsUsername");
    const auth = getAuth(firebaseApp);
    signOut(auth)
      .then((result) => {
        setLogoutMessage(`You logged out`);
      })
      .catch((error) => {
        setLogoutMessage(`Error while logging out`);
      });
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

  const sendPasswordEmail = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, passwordResetEmail)
      .then(() => {
        setPasswordResetMessage(
          `Password reset email sent to ${passwordResetEmail}`,
        );
      })
      .catch((error) => {
        setPasswordResetMessage(`Error sending password reset`);
      });
  };

  return (
    <>
      <h2>Welcome To Card Show Off!</h2>
      <h3>Log In</h3>
      <p>
        If you have an account, login and go to "My Collection" to manage and
        view your collection
      </p>
      <form id="login-form" className="form-card">
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
              type="password"
              autoComplete="false"
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
      </form>
      <p>{resultMessage}</p>
      <h3>Forgot Password?</h3>
      <div className="div-login">
        <div className="div-enter-collection">
          <label htmlFor="password-reset-email-input">Email:</label>
          <input
            id="password-reset-email-input"
            type="text"
            min="1"
            max="50"
            onChange={(e) => setPasswordResetEmail(e.target.value)}
            value={passwordResetEmail}
            required
          />
        </div>
        <div className="div-input-group">
          <button id="password-reset-email-btn" onClick={sendPasswordEmail}>
            Send Reset Password Email
          </button>
        </div>
      </div>
      <p>{passwordResetMessage}</p>
      <h3>Sign Up</h3>
      <p>
        If you would like an account for your trading card collections, sign up
        below
      </p>
      <div className="div-home-buttons">
        <button id="signup-button" onClick={goSignUp}>
          Sign Up
        </button>
      </div>
      <div className="div-logout">
        <button onClick={logout} id="logout-btn">
          Logout
        </button>
      </div>
      <p>{logoutMessage}</p>
      <Nav />
    </>
  );
}
