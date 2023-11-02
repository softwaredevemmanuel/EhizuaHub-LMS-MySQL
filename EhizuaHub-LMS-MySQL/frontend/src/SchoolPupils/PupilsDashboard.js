import React, { useState, useEffect } from 'react';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import CourseSection from './CourseSection';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';




function PupilsDashboard() {
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [loginPupils, setLoginPupil] = useState(null);
  const [error, setError] = useState(null);
  const [pupil, setPupil] = useState('');
  const [schools, setSchools] = useState([]);
  const [selectSchool, setSelectSchool] = useState('');


  useEffect(() => {
    let login = JSON.parse(localStorage.getItem('Pupilslogin'));
    let Pupilslogin = login
    if (Pupilslogin && Pupilslogin.login && Pupilslogin.token && Pupilslogin.authHeader && Pupilslogin.school) {
      setLoginPupil(true);
      setPupil(Pupilslogin.user)
    }
  }, []);

  useEffect(() => {
    async function fetchSchools() {

      try {

        const response = await axios.get('http://localhost:5000/api/auth/partner-schools', {

        });
        setSchools(response.data.message)

      } catch (error) {
        setError('Error fetching schools data');
      }
    }

    fetchSchools();

  }, []);

  function login() {
    if (email && id && selectSchool) {
      axios.post('http://localhost:5000/api/school_pupils/login', {
        email: email,
        id: id,
        selectSchool : selectSchool

      })
        .then(response => {
          localStorage.setItem('Pupilslogin', JSON.stringify({
            login: true,
            token: response.data.token,
            user: response.data.user,
            authHeader: response.data.authHeader,
            email : email,
            course1 : response.data.course1,
            course2 : response.data.course2,
            course3 : response.data.course3,
            course4 : response.data.course4,
            course5 : response.data.course5,
            school : selectSchool

          }));
          setLoginPupil(true);
          setPupil(response.data.user);          

        })
        .catch(error => {
          setError(error.response.data.message);
        });
    }else {
      setError('Please fill in all required fields.');
    }
  }



  return (
    <div>
      {!loginPupils ? (
        <div>
          <h1>School Student Login page</h1>
          <label htmlFor='selectSchool'>Select School</label>

          <select
            id='selectSchool'
            value={selectSchool}
            onChange={(event) => setSelectSchool(event.target.value)}
          >
            <option value=''>Choose a School</option>
            {schools.map((schools, index) => (
              <option key={index} value={schools.schoolName}>
                {schools.schoolName}
              </option>
            ))}
          </select>

          <br />
          <br />
          <label>Username</label>
          <input type='email' id='email' autoComplete='new-password' onChange={(event) => setEmail(event.target.value)} /> <br /><br />

          <label> Students ID</label>
          <input type='password' autoComplete='new-password' onChange={(event) => setId(event.target.value)} /> <br /><br />
          <button onClick={login}>Login</button>

          <br/>
          <br/>
            <Link to="/student_forgot_password">forgot password?</Link>
          <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
      ) : (

        <div>
          <p>Welcome {pupil}</p>
          <CourseSection />
        </div>
      )}
    </div>
  );
}

export default PupilsDashboard;
