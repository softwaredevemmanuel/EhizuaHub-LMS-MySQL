import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentDashboard from './StudentDashboard';


function CourseTopic() {
  const [loginStudent, setLoginStudent] = useState(false); // Initialize with false
  const [error, setError] = useState(null);
  const [content, setContent] = useState([]);
  


  useEffect(() => {
    const storedLoginData = JSON.parse(localStorage.getItem('Studentlogin'));
    
    if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.user) {
      setLoginStudent(true);
    }
    
  }, []);

    

  useEffect(() => {
    async function fetchCourseContent() {

        try {
          let login = JSON.parse(localStorage.getItem('Studentlogin'));

          const response = await axios.get('http://localhost:5000/api/students/student-course-content', {
            headers: {
              authHeader: login.authHeader,
            },
          });
          setLoginStudent(true);
          setContent(response.data.content);
        } catch (error) {
          setError('Error retrieving content');
        }
      }

      fetchCourseContent();
      
  }, []);

  const uniqueMainTopics = [...new Set(content.map((item) => item.mainTopic))];


  return (
    <div>
      {!loginStudent? (
        <div>
        <StudentDashboard /> 
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
          <a href={`/details/${subContent.id}`}>
            <p>{subContent.subTopic}</p>
          </a>
        </div>
        
      ))}
     
  </div>
))}

      </div>
      )}
    </div>
  );
}

export default CourseTopic;
