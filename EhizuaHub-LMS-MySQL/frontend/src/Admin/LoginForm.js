
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard'

function LoginForm() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loginData, setLoginData] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    let login = JSON.parse(localStorage.getItem('Adminlogin'));
    let admin = login
  
    if ((login && admin.login && admin.admin && admin.admin_authorization)) {
      setLoginData(true);
    }  
  }, []);





  function login() {
    if (email && password) {

        axios.post('http://localhost:5000/api/auth/login', {
          email: email,
          password: password,
        })
        .then(response => {
          localStorage.setItem('Adminlogin', JSON.stringify({
            login: true,
            token: response.data.token,
            admin: true,
            admin_authorization: response.data.admin_authorization.id
          }));
          setLoginData(true);

            
        })
        .catch(error => {
          setError(error.response.data.error)

        });
      }else {
        setError('Please fill in all required fields.');
      }
  }
  



  return (
    <div className='App'>
     {!loginData ? (
        <div>
          <h1>Admin Login page</h1>
          <input type='email' id="email" autoComplete='new-password' onChange={(event) => setEmail(event.target.value)} /> <br /><br />
          <input type='password' autoComplete='new-password' onChange={(event) => setPassword(event.target.value)} /> <br /><br />
          <button onClick={login}>Login</button>

          {error && <p style={{ color: 'red' }}>{error}</p>}

        </div>
       ) : (

        <Dashboard/>

      )}
    </div>
  );
}

export default LoginForm;