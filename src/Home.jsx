import {useNavigate} from "react-router-dom";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from "./firebaseConfig";

export default function Home() {
    // Configure FirebaseUI.
    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
        signInSuccessUrl: '/',
        // We will display Google as auth provider.
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ]
    };

    firebase.initializeApp(firebaseConfig);

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
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </>
    );
}