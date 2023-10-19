import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';




const TutorForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');





    const verifyEmail = () => {
        if (email) {
          setLoading(true);
    
          axios.post("http://localhost:5000/api/auth/tutor_forgot_password", {
            email: email,
           
          })
          .then(response => {
            console.log(response)
            setSuccess(response.data)

          })
          .catch(error => {
            setError(error.response.data.error);
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
        <h1>Tutor forgot password page </h1>


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

        </form>

        {loading && <p>Loading...</p>}

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <Link to="/tutor_dashboard">Login Here</Link>



    </div>
  )
}

export default TutorForgotPassword
