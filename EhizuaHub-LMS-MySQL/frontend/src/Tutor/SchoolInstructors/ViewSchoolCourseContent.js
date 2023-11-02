import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StaffLogin from '../../Staff/StaffLogin';
import { useParams } from 'react-router-dom';


function ViewSchoolCourseContent() {
  const [loginData, setLoginData] = useState(null);
  const [error, setError] = useState(null);
  const [content, setContent] = useState([]);
  const { id: contentParam } = useParams();




  // ..................useEffect for checking localStorage and Verifying Login ..............
  useEffect(() => {
    const storedLoginData = JSON.parse(localStorage.getItem('Stafflogin'));
    if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.staff_authorization) {
      setLoginData(true);
    }
  }, []);



  useEffect(() => {
    async function fetchCourseContent() {
        try {

          let storedData = JSON.parse(localStorage.getItem('Stafflogin'));

          const response = await axios.get('http://localhost:5000/api/tutor/school-course-content', {
            headers: {
              authHeader: storedData.staff_authorization,
              id : contentParam
            },
          });

          setLoginData(true);
          setContent(response.data.content);

        } catch (error) {
          setError('Error retrieving content');
        }
      }


      fetchCourseContent();
  }, [contentParam]);

  const uniqueMainTopics = [...new Set(content.map((item) => item.mainTopic))];


  return (
    <div>
      {!loginData ? (
        <div>
            <StaffLogin/>
        </div>
      ) : (
       
        <div>
        {uniqueMainTopics.map((mainTopic, mainIndex) => (
          <div key={mainIndex}>
            <p>{mainTopic}</p>
            {content
              .filter((item) => item.mainTopic === mainTopic)
              .map((subContent, subIndex) => (
                <div key={subIndex}>
                    <p>{subContent.subTopic}</p>
                    <p>{subContent.content}</p>


                </div>
                
              ))}
            
          </div>
        ))}

        </div>
      )}
    </div>
  );
}

export default ViewSchoolCourseContent;

