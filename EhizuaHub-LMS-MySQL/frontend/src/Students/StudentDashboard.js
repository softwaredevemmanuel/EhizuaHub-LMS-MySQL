import React, { useState, useEffect } from 'react';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import CourseTopic from './CourseTopic';
import Question from './Question';
import DetailsPage from './DetailsPage';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';




function StudentDashboard() {
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [loginStudent, setLoginStudent] = useState(null);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState('');


  useEffect(() => {
    let login = JSON.parse(localStorage.getItem('Studentlogin'));
    let Studentlogin = login
    if (Studentlogin && Studentlogin.login && Studentlogin.token && Studentlogin.authHeader) {
      setLoginStudent(true);
      setStudent(Studentlogin.user)
    }
  }, []);

  function login() {
    if (email && id) {
      axios.post('http://localhost:5000/api/students/student-login', {
        email: email,
        id: id,
      })
        .then(response => {
          localStorage.setItem('Studentlogin', JSON.stringify({
            login: true,
            token: response.data.token,
            user: response.data.user,
            authHeader: response.data.authHeader,
            email : email,
            course : response.data.course

          }));
          setLoginStudent(true);
          setStudent(response.data.user);          

        })
        .catch(error => {
          setError(error.response.data.message);
        });
    }else {
      setError('Please fill in all required fields.');
    }
  }



  return (
    <div className='App'>
      {!loginStudent ? (
        <div>
          <h1>Student Login page</h1>
          <label>Email</label>
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
          <p>Welcome {student}</p>
          <CourseTopic />
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
