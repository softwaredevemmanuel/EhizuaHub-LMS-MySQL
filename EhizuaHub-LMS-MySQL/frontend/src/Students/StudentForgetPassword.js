import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';




const StudentForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');





    const verifyEmail = () => {
        if (email) {
          setLoading(true);
    
          axios.post("http://localhost:5000/api/students/student_forgot_password", {
            email: email,
           
          })
          .then(response => {
            setSuccess(response.data)

          })
          .catch(error => {
            setError(error.response.data);
          })
          .finally(() => {
            setLoading(false); // Stop loading indicator
          });
        } else {
          setError('Please enter your email.');
        }
      };


    const handleSubmit = event => {
        event.preventDefault();
        verifyEmail();
      };

  return (
    <div>
        <form onSubmit={handleSubmit}>

          <h1>Student forgot password page </h1>

            <label>Verify Your Email</label> <br/>
            <input
                type='email'
                id='email'
                autoComplete='new-password'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                />
                <br /><br />

            <button type='submit'>Submit</button>
            <br/>
          <br/>
            <Link to="/student_dashboard">Log in</Link>

        </form>

        {loading && <p>Loading...</p>}

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}


    </div>
  )
}

export default StudentForgotPassword
