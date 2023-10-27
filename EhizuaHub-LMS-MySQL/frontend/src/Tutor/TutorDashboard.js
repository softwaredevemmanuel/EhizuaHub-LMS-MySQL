import React, { useState, useEffect } from 'react';
import axios from 'axios';
import  secureLocalStorage  from  "react-secure-storage";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';



function TutorDashboard() {
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [loginData, setLoginData] = useState(false);
  const [error, setError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [tutor, setTutor] = useState('');
  const [tutorEmail, setTutorEmail] = useState('');
  const [content, setContent] = useState([]);


// ..................useEffect for checking localStorage and Verifying Login ..............
useEffect(() => {
  const storedLoginData = JSON.parse(localStorage.getItem('Tutorlogin'));
  if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.tutor_authorization) {
    setLoginData(true);
    setTutor(storedLoginData.tutor);
    setTutorEmail(storedLoginData.email)

  }
}, []);

//............... Login API function that will also store login info in local storage...................
  function login() {
    if (email && id) {

    axios.post('http://localhost:5000/api/tutor/tutor-login', {
      email: email,
      id: id,
    })
    .then(response => {
      localStorage.setItem('Tutorlogin', JSON.stringify({
        login: true,
        token: response.data.token,
        tutor: response.data.tutor,
        tutor_authorization:response.data.tutor_authorization,
        course: response.data.course,
        office: response.data.office,
        email: response.data.email
      }));
      
      setLoginData(true);
      setTutor(response.data.tutor)
      setTutorEmail(response.data.email)

    })

    .catch(error => {
      setLoginError(error.response.data.message);
    });
  } else {
    setError('Please fill in all required fields.');
  }
  }

  return (
    <div className='App'>
      {!loginData ? (
        <div>
          <h1>Tutor Login page</h1>
          <p>michael = miAsVaZxYNIMi</p>
          <label htmlFor='email'>Email</label>
                <input
                type='email'
                id='email'
                autoComplete='new-password'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                />          
          <label> Staff ID</label>
          <input type='password' autoComplete='new-password' onChange={(event) => setId(event.target.value)} /> <br /><br />
          <button onClick={login}>Login</button>
          <div>
          {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
          <Link to="/tutor_forgot_password">Forgot Password?</Link>
        </div>
      ) : (

          <div>
            <h1>Welcome {tutor}</h1>

            <h4> Tutor Dashboard </h4>
            <Link to={`/tutor_details_page/${tutorEmail}`}>My Details</Link>
            <br/>
            <br/>
            <Link to="/create_curriculum">Create Curriculum</Link>
            <br/>
            <br/>
            <Link to="/tutor_student_details">View Student Details</Link>
            <br/>
            <br/>
            <Link to="/create_content">CreateContent</Link>
            <br/>
            <br/>
            <Link to="/leave">Take A Leave</Link>

            
          </div>

          
          
      )}
    </div>
  );
}

export default TutorDashboard;
