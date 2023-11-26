
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';



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
    console.log("heheheheh")
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

  const handleSubmit=(event)=>{
    event.preventDefault()
    login()
  }
  



  return (
    <div>
     {!loginData ? (
        <div>
          <Form className='container'>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={(event) => setEmail(event.target.value)}/>
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
              </Form.Group>
            
              <Button variant="primary" type="submit" onClick={handleSubmit}>
                Submit
              </Button>
          </Form>
    
          
       

          {error && <p style={{ color: 'red' }}>{error}</p>}

    </div>
       ) : (

        <Dashboard/>

      )}
    </div>
  );
}

export default LoginForm;