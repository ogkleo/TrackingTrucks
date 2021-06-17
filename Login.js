import React, { createContext, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './Login.css';
import LoginAppBar from './LoginAppBar';
import { Route, Redirect, useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
}));

async function doLogin(username, password, successCallback, failureCallback) {

    const response = await fetch('/login', 
        {
            method: 'POST', 
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({'username': username, 'password': password})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let status = data.status;
            if (status === 'success') {
                successCallback(data.data);
            } else {
                failureCallback(data.data);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

let UserToken = localStorage.getItem('authToken');
  
function LoginScreen() {
    let history = useHistory();
    let location = useLocation();
    let auth = useAuth();
  
    let { from } = location.state || { from: { pathname: "/listings" } };

    const listings = useStyles();
  
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onSuccess = (data) => {
        console.log(data.authToken);
        UserToken = data.authToken;
        auth.signin(username, data.authToken, () => {
            localStorage.setItem('username', username);
            localStorage.setItem('authToken', data.authToken);
            history.replace(from);
          });
    }

    const onFailure = (data) => {
        let reason = data.reason;
        if (reason === 'PASSWORD_MISMATCH') {
            alert("You entered an incorrect password. Please try again.");
        } else if (reason === 'USERNAME_NOT_FOUND') {
            alert("You entered an unknown username. Please try again.");
        } else {
            alert("Unknown reason code: " + reason);
        }
    }

    const clickHandler = () => {
        doLogin(username, password, onSuccess, onFailure);
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    return (
        <div>
            <LoginAppBar />
            <div>
                <TextField id="username" label="Username" value={username} onChange={handleUsernameChange}/>
            </div>        
            <div>
                <TextField id="password" type="password" label="Password" value={password} onChange={handlePasswordChange}/>
            </div>
            <div>
                <Button onClick={clickHandler} variant="contained" color="primary" className="loginBtn">
                    Login
                </Button>
            </div>  
        </div>
    );
}
  
const AuthContext = createContext();

function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return (
        <AuthContext.Provider value={auth}>
        {children}
        </AuthContext.Provider>
    );
}

function authHeader() {
    return {'Authorization':'Bearer ' + UserToken};
}


function handleResponse(response, func) {
    let status = response.status;
    if (status === 'success') {
        func(response.data);
    } else {
        let reason = response.data.reason;
        if (reason === 'EXPIRED_TOKEN') {
            alert("The authentication token has expired. Please sign out and sign back in.");
        } else {
            alert("The authentication token failed validation. You will need to sign out and then sign back in again.");
        }
    }
}

function useAuth() {
    return useContext(AuthContext);
}

function useProvideAuth() {
    let localUsername = localStorage.getItem('username');
    let localAuthToken = localStorage.getItem('authToken');
    console.log(localUsername);
    console.log(localAuthToken);
    const [user, setUser] = useState(localUsername);
    const [token, setToken] = useState(localAuthToken);
    // const [user, setUser] = useState(
    //     localStorage.getItem('username') || null);
    // const [token, setToken] = useState(
    //     localStorage.getItem('authToken') || null);

    const signin = (user, token, cb) => {
        console.log('set user to ' + user);
        setUser(user);
        setToken(token);
        cb();
    };

    const signout = cb => {
        setUser(null);
        setToken(null);
        cb();
    };

    return {
        user,
        token,
        signin,
        signout
    };
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    console.log("Rendering PrivateRoute");
    let auth = useAuth();
    return (
        <Route
        {...rest}
        render={({ location }) =>
            auth.user ? (
            children
            ) : (
            <Redirect
                to={{
                pathname: "/login",
                state: { from: location }
                }}
            />
            )
        }
        />
    );
}

export { ProvideAuth, PrivateRoute, LoginScreen, AuthContext, handleResponse, authHeader, UserToken };