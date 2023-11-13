import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentDashboard from './StudentDashboard';
import { useParams } from 'react-router-dom';


function CourseTopic() {
  const [loginStudent, setLoginStudent] = useState(false); // Initialize with false
  const [error, setError] = useState(null);
  const [content, setContent] = useState([]);

  const {course: courseParams} = useParams()
  


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
              courses : courseParams
            },
          });
          setLoginStudent(true);
          setContent(response.data.content);
        } catch (error) {
          setError('Error retrieving content');
        }
      }

      fetchCourseContent();
      
  }, [courseParams]);

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
          <a href={`/${courseParams}/details/${subContent.id}`}>
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
