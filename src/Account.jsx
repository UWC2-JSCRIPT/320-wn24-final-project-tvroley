import { useState } from "react";
import Nav from "./Nav";
import firebaseApp from "./firebaseApp";
import {
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import Mongo from "./Mongo";

export default function Account() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [resultMessage, setResultMessage] = useState(``);
  const server = new Mongo();
  let currentUser;

  onAuthStateChanged(getAuth(firebaseApp), (user) => {
    if (user) {
      currentUser = user;
    }
  });

  const changePassword = async (event) => {
    event.preventDefault();
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
              signInWithEmailAndPassword(auth, currentUser.email, newPassword)
                .then(async (userCredential) => {
                  const response = await server.login(
                    currentUser.email,
                    newPassword,
                  );
                  if (response.status === 200) {
                    response.json().then((data) => {
                      localStorage.setItem("cardsToken", data.token);
                      localStorage.setItem("cardsUsername", data.username);
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

  return (
    <>
      <h1>My Account</h1>
      <div>
        <p>Change Password</p>
        <form id="card-form" className="form-card">
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
                <div className="div-input-group">
                    <div className="div-input-group">
                      <input
                        id="change-password-btn"
                        className="btn"
                        type="submit"
                        value="Change Password"
                        onClick={changePassword}
                      />
                    </div>
                </div>
            </div>
          </div>
        </form>
        <div className="div-enter-collection">
          <p>{resultMessage}</p>
        </div>
      </div>
      <Nav />
    </>
  );
}
