import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TutorDashboard from './TutorDashboard';


function StudentDetails() {
  const [loginData, setLoginData] = useState(null);
  const [error, setError] = useState(null);
  const [content, setContent] = useState([]);



  useEffect(() => {
    let store = JSON.parse(localStorage.getItem('Tutorlogin'));
    if (store && store.login && store.token && store.tutor_authorization) {
      setLoginData(true);

    }
  }, []);

  useEffect(() => {
    async function fetchCourseContent() {
        try {

          let storedData = JSON.parse(localStorage.getItem('Tutorlogin'));

          const response = await axios.get('http://localhost:5000/api/tutor/students', {
            headers: {
              authHeader: storedData.tutor_authorization,
              course : storedData.course

            },
          });
          setLoginData(true);
          setContent(response.data.students);

        } catch (error) {
          setError(error.response.data.error);
          if(error.response.data.error === "Your account has been suspended. Please contact Ehizua Hub Admin." ){
            localStorage.setItem('Tutorlogin', JSON.stringify({
                login: false,
              }));    
        }
        }
      }

      fetchCourseContent();
  }, []);

  return (
    <div>
      {!loginData ? (
        <div>
            <TutorDashboard/>
        </div>
      ) : (
       
        <div>
          {content.map((content, index) => (
            <div key={index}>
                <p>{content.firstName} {content.lastName} {content.email}</p>
             
            </div>

          ))}
      {error && <p style={{ color: 'red' }}>{error}</p>}

        </div>
      )}
    </div>
  );
}

export default StudentDetails;
