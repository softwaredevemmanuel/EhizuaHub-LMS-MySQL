import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


function VerifyStudentEmail() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const emailToken = searchParams.get('emailToken');
    const email = searchParams.get('email');
    const [verificationSuccess, setVerificationSuccess] = useState(null);
    const [verificationError, setVerificationError] = useState(null);
 


    useEffect(() => {
        // Make API request to verify email
        const verifyEmail = async () => {
            const searchParams = new URLSearchParams(location.search);
            const emailToken = searchParams.get('emailToken');
            const email = searchParams.get('email');

            try {
                axios.post('http://localhost:5000/api/students/verify-student-email', {
                    emailToken: emailToken,
                    email: email,
            })
            .then(response => {
                console.log(response.data);
                setVerificationSuccess(response.data)
                
            })
            .catch(error => {
                console.log(error.response.data);
                setVerificationError(error.response.data)

                
            }); 
        
          } catch (error) {
            console.error('Error verifying email:', error);
          }
        };
        verifyEmail()
    }, [emailToken, email]);

        

        

  return (
    <div className="App">
        {verificationError && <p style={{ color: 'red' }}>{verificationError}</p>}
        {verificationSuccess && <p style={{ color: 'green' }}>{verificationSuccess}</p>}

        <a href='http://localhost:3000/student_dashboard'> Click To Log In</a>

    </div>
  );
}

export default VerifyStudentEmail;
