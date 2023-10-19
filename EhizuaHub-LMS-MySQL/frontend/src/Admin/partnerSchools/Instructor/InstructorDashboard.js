import React, { useState, useEffect } from 'react';
import axios from 'axios';
import  secureLocalStorage  from  "react-secure-storage";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';



function InstructorDashboard() {
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [loginData, setLoginData] = useState(false);
  const [error, setError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [instructor, setInstructor] = useState('');
  const [instructorEmail, setInstructorEmail] = useState('');


// ..................useEffect for checking localStorage and Verifying Login ..............
useEffect(() => {
  const storedLoginData = JSON.parse(localStorage.getItem('InstructorLogin'));
  if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.instructor_authorization) {
    setLoginData(true);
    setInstructor(storedLoginData.instructor);
    setInstructorEmail(storedLoginData.email)

  }
}, []);

//............... Login API function that will also store login info in local storage...................
  function login() {
    if (email && id) {

    axios.post('http://localhost:5000/api/instructor/instructor-login', {
      email: email,
      id: id,
    })
    .then(response => {
      localStorage.setItem('InstructorLogin', JSON.stringify({
        login: true,
        token: response.data.token,
        instructor: response.data.instructor,
        instructor_authorization:response.data.instructor_authorization,
        course: response.data.course,
        office: response.data.office,
        email: response.data.email
      }));
      
      setLoginData(true);
      setInstructor(response.data.instructor)
      setInstructorEmail(response.data.email)

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
          <h1>Instructors Login page </h1>
          <label htmlFor='email'>Email</label>
                <input
                type='email'
                id='email'
                autoComplete='new-password'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                />          
          <label> Staff ID abTO8sD_jyfEm</label>
          <input type='password' autoComplete='new-password' onChange={(event) => setId(event.target.value)} /> <br /><br />
          <button onClick={login}>Login</button>
          <div>
          {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
          <Link to="/instructor_forgot_password">Forgot Password?</Link>
        </div>
      ) : (

          <div>
            <h1>Welcome {instructor}</h1>

            <h4> Instructor Dashboard </h4>
            <Link to={`/instructor_details_page/${instructorEmail}`}>My Details</Link>
            <br/>
            <br/>
            <Link to="/instructor_create_curriculum">Create Curriculum</Link>
            <br/>
            <br/>
            <Link to="/instructor_student_details">View Student Details</Link>
            <br/>
            <br/>
            <Link to="/instructor_create_content">CreateContent</Link>
            <br/>
            <br/>
            <Link to="/instructor_leave">Take A Leave</Link>

            
          </div>

          
          
      )}
    </div>
  );
}

export default InstructorDashboard;
