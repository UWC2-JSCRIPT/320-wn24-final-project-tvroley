import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import firebaseApp from "./firebaseApp";
import {
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import Mongo from "./Mongo";

export default function DeleteAccount() {
  const [deletePassword, setDeletePassword] = useState("");
  const [resultMessage, setResultMessage] = useState(``);
  const server = new Mongo();
  const navigate = useNavigate();
  let currentUser;

  onAuthStateChanged(getAuth(firebaseApp), (user) => {
    if (user) {
      currentUser = user;
    }
  });

  const deleteAccount = (event) => {
    event.preventDefault();

    if (!deletePassword) {
      setResultMessage(
        `Please enter your password in order to delete your account`,
      );
      return;
    }
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      deletePassword,
    );
    reauthenticateWithCredential(currentUser, credential)
      .then(() => {
        deleteUser(currentUser)
          .then(async () => {
            const deleteResponse = await server.deleteAccount();
            if (deleteResponse.status === 200) {
              setResultMessage("Your account was successfully deleted");
              localStorage.removeItem("cardsToken");
              localStorage.removeItem("cardsUsername");
              navigate("/");
            } else {
              setResultMessage(
                "Error deleting your account: contact website admin",
              );
            }
          })
          .catch((error) => {
            setResultMessage(
              `Error deleting account: ${error.code} ${error.message}`,
            );
          });
      })
      .catch((error) => {
        setResultMessage(
          `Error authenticating account: ${error.code} ${error.message}`,
        );
      });
  };

  return (
    <>
      <h1>Delete Account</h1>
      <div>
        <p>Are you sure you want to delete your account?</p>
        <p>All of your cards and collections will be deleted as well</p>
        <p>This action cannot be undone</p>
        <form id="delete-form" className="form-card">
          <div className="div-delete-account">
            <div className="div-input-group">
              <label htmlFor="delete-password-input">Password:</label>
              <input
                id="delete-password-input"
                type="password"
                autoComplete="false"
                min="1"
                max="100"
                onChange={(e) => setDeletePassword(e.target.value)}
                value={deletePassword}
                required
              />
              <input
                id="delete-account-btn"
                className="btn"
                type="submit"
                value="Delete Account"
                onClick={deleteAccount}
              />
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
