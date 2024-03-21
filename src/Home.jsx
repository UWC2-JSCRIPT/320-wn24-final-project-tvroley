import {useNavigate} from "react-router-dom";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from "./firebaseConfig";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function Home() {
    const signin = () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }

    const navigate = useNavigate();

    const goGrandpa = () => {
        navigate('/grandpa');
    }

    const goUncle = () => {
        navigate('/uncle');
    }

    return (
        <>
            <div className="div-home-buttons">
              <button onClick={goGrandpa}>Grandpa's Collection</button>
              <button onClick={goUncle}>Uncle's Collection</button>
            </div>
            <button onClick={signin}>Sign in with Google</button>
        </>
    );
}