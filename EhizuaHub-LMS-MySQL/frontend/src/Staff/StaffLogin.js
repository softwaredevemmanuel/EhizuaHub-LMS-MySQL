import React, { useState, useEffect } from 'react';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import HubTutorSection from '../Tutor/HubInstructors/HubTutorSection';
import SchoolTutorSection from '../Tutor/SchoolInstructors/SchoolTutorSection';
import StaffDashboard from './StaffDashboard';
import HomeDashboard from './HomeDashboard';



function StaffLogin() {
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [loginData, setLoginData] = useState(false);
  const [error, setError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [staff, setStaff] = useState('');
  const [instructor, setInstructor] = useState('');



  // ..................useEffect for checking localStorage and Verifying Login ..............
  useEffect(() => {
    const storedLoginData = JSON.parse(localStorage.getItem('Stafflogin'));
    if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.staff_authorization) {
      setLoginData(true);
      setStaff(storedLoginData.staff);
      setInstructor(storedLoginData.instructor)


    }
  }, []);


  //............... Login API function that will also store login info in local storage...................
  function login() {
    if (email && id) {

      axios.post('http://localhost:5000/api/staff/login', {
        email: email,
        id: id,
      })
        .then(response => {
          localStorage.setItem('Stafflogin', JSON.stringify({
            login: true,
            token: response.data.token,
            staff: response.data.staff,
            staff_authorization: response.data.staff_authorization,
            hubCourse: response.data.hubCourse,
            schoolCourse: response.data.schoolCourse,
            office: response.data.office,
            email: response.data.email,
            instructor: response.data.instructor
          }));

          setLoginData(true);
          setStaff(response.data.staff)
          setInstructor(response.data.instructor)
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
          <h1>Staff Login page</h1>
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
          <Link to="/staff_forgot_password">Forgot Password?</Link>
        </div>
      ) : (

        <HomeDashboard/>
      )}
    </div>
  );
}

export default StaffLogin;
