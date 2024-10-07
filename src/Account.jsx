import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import firebaseApp from "./firebaseApp";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import Mongo from "./Mongo";
import { doc, setDoc } from "firebase/firestore";
import db from "./db";
import { encrypt } from "sjcl";

export default function Account() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [resultMessage, setResultMessage] = useState(``);
  const server = new Mongo();
  const navigate = useNavigate();
  const secret = import.meta.env.VITE_CRYPTO_SECRET;
  let currentUser;

  onAuthStateChanged(getAuth(firebaseApp), (user) => {
    if (user) {
      currentUser = user;
    } else {
      currentUser = null;
    }
  });

  const changePassword = async (event) => {
    event.preventDefault();
    if (!currentUser) {
      setResultMessage("You need to login to change your password");
      return;
    }
    const passwordRegEx =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&^]{8,30}$/;
    if (!passwordRegEx.test(newPassword)) {
      setResultMessage(
        "Invalid password: Must include a lowercase letter, an uppercase letter, a number, and a special character, and be between 8 and 30 characters in length",
      );
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setResultMessage("Repeated password does not match");
      return;
    }

    const auth = getAuth();
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      oldPassword,
    );
    reauthenticateWithCredential(currentUser, credential)
      .then(() => {
        updatePassword(currentUser, newPassword)
          .then(async () => {
            const responsePassword = await server.changePassword(newPassword);
            if (responsePassword.status === 200) {
              const codedObj = encrypt(secret, newPassword);
              setDoc(doc(db, "users", currentUser.uid), {
                mongoPassword: codedObj,
              })
                .then(() => {
                  signInWithEmailAndPassword(
                    auth,
                    currentUser.email,
                    newPassword,
                  )
                    .then(async (userCredential) => {
                      const response = await server.login(
                        currentUser.email,
                        newPassword,
                      );
                      if (response.status === 200) {
                        response.json().then((data) => {
                          sessionStorage.setItem("cardsToken", data.token);
                          sessionStorage.setItem(
                            "cardsUsername",
                            data.username,
                          );
                          setResultMessage("Password successfully changed");
                        });
                      } else {
                        setResultMessage(
                          `Error singing in with new password: ${response.status} ${response.statusText}`,
                        );
                      }
                    })
                    .catch((error) => {
                      setResultMessage(
                        `Error logging in with new password: ${error.code} ${error.message}`,
                      );
                    });
                })
                .catch((error) => {
                  setResultMessage(
                    `Error setting new password: ${error.code} ${error.message}`,
                  );
                });
            } else {
              setResultMessage(
                `Error changing password, please try again or contact website admin ${responsePassword.status} ${responsePassword.statusText}`,
              );
            }
          })
          .catch((error) => {
            setResultMessage(
              `Error changing password: ${error.code} ${error.message}`,
            );
          });
      })
      .catch((error) =>
        setResultMessage(
          `Error signing in with old password ${error.code} ${error.message}`,
        ),
      );
  };

  const goDeleteAccount = (event) => {
    if (!currentUser) {
      setResultMessage("You need to login to delete your account");
      return;
    }
    navigate("/deleteaccount");
  };

  return (
    <>
      <h1>Account</h1>
      <div>
        <h2>Change Password</h2>
        <form id="password-form" className="form-card">
          <div className="div-login">
            <div className="div-input-group">
              <label htmlFor="old-password-input">Old Password:</label>
              <input
                id="old-password-input"
                type="password"
                autoComplete="false"
                min="1"
                max="100"
                onChange={(e) => setOldPassword(e.target.value)}
                value={oldPassword}
                required
              />
              <label htmlFor="new-password-input">New Password:</label>
              <input
                id="new-password-input"
                type="password"
                autoComplete="false"
                min="1"
                max="100"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
              />
              <label htmlFor="new-password-confirm-input">
                New Password Confirm:
              </label>
              <input
                id="new-password-confirm-input"
                type="password"
                autoComplete="false"
                min="1"
                max="100"
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                value={newPasswordConfirm}
                required
              />
              <input
                id="change-password-btn"
                className="btn"
                type="submit"
                value="Change Password"
                onClick={changePassword}
              />
            </div>
          </div>
          <div className="div-enter-collection">
            <p>{resultMessage}</p>
          </div>
        </form>
        <h2>Delete Account</h2>
        <div className="div-delete-account">
          <div className="div-input-group">
            <button id="delete-account-btn" onClick={goDeleteAccount}>
              Go Delete Account
            </button>
          </div>
        </div>
      </div>
      <Nav />
    </>
  );
}
