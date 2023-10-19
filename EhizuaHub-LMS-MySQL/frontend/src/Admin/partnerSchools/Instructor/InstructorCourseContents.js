import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TutorDashboard from './TutorDashboard';


function TutorCourseContents() {
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

          const response = await axios.get('http://localhost:5000/api/tutor-course-content', {
            headers: {
              authHeader: storedData.tutor_authorization,
              course : storedData.course
            },
          });
          console.log(response)
          setLoginData(true);
          setContent(response.data.content);

        } catch (error) {
          setError('Error retrieving content');
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
                <p>{content.subTopic}</p>
                <p>{content.content}</p>
             
            </div>

          ))}
        </div>
      )}
    </div>
  );
}

export default TutorCourseContents;

