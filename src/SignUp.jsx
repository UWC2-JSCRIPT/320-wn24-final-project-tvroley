import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Nav from "./Nav";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function SignUp() {
  const [signUpusername, setSignUpusername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpPasswordConfirm, setSignUpPasswordConfirm] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpMessage, setSignUpMessage] = useState(``);
  const [agree, setAgree] = useState(false);

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
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&^]{8,30}$/;
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

    const emailRegEx =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (!emailRegEx.test(signUpEmail)) {
      setSignUpMessage("Invalid email address");
      return;
    }

    if (!agree) {
      setSignUpMessage(
        "You must agree to the user agreement before signing up",
      );
      return;
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
      .then((userCredential) => {
        signInWithEmailAndPassword(
          auth,
          userCredential.user.email,
          signUpPassword,
        )
          .then((userCredential) => {
            sendEmailVerification(userCredential.user).then(() => {
              setSignUpMessage(
                `Check ${userCredential.user.email} for confirmation email, and then sign in for the first time to create your collection`,
              );
            });
          })
          .catch((error) => {
            setSignUpMessage(
              `Error setting up user account: ${error.code} ${error.message}`,
            );
          });
      })
      .catch((error) => {
        setSignUpMessage(
          `Error creating user account: ${error.code} ${error.message}`,
        );
      });
  };

  const handleAgreeCheck = () => {
    setAgree(!agree);
  };

  return (
    <>
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
          <div className="div-enter-collection">
            <p>{signUpMessage}</p>
          </div>
        </div>
      </div>
      <Nav />
    </>
  );
}
