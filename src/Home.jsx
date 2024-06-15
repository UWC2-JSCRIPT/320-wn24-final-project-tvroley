import {useNavigate} from "react-router-dom";
import 'firebase/compat/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState, useEffect } from 'react';

export default function Home() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

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

    //https://trading-cards-backend-production.up.railway.app/auth/login
    //http://localhost:3000/auth/login
    const login = async (event) => {
        event.preventDefault();
        const response = await fetch(`https://trading-cards-backend-production.up.railway.app/auth/login`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {"Content-Type": "application/json",},
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({"username": username, "password": password},),
        });
        if(response.status === 200) {
            response.json().then((data) => {
                setToken(data.token);
                console.log(data.token);
                localStorage.setItem('cardsToken', data.token);
                localStorage.setItem('cardsUsername', username);
            });
        }
    }

    const navigate = useNavigate();

    const goCollection = () => {
        navigate('/collection');
    }

    return (
        <>
            <div className="div-home-buttons">
              <button onClick={goCollection}>My Collection</button>
            </div>
            <button onClick={signin}>Sign in with Google</button>
            <div className='div-input-label'>
                    <label htmlFor="username-input">Username</label>
                    <input
                      id="username-input"
                      type="text"
                      min="1"
                      max="50"
                      onChange={e => setUsername(e.target.value)} 
                      value={username}
                      required
                    />
            </div>
            <div className='div-input-label'>
                    <label htmlFor="password-input">Password</label>
                    <input
                      id="password-input"
                      type="text"
                      min="1"
                      max="100"
                      onChange={e => setPassword(e.target.value)} 
                      value={password}
                      required
                    />
            </div>
            <div className='div-input-group'>
                <input className="btn" type="submit" value="Login" onClick={login} />
            </div>
        </>
    );
}