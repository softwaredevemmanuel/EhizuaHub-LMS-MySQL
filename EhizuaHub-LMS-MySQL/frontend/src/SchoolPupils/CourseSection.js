import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PupilsDashboard from './PupilsDashboard';
import { Link } from 'react-router-dom';


function CourseSection() {
  const [loginStudent, setLoginStudent] = useState(false); // Initialize with false
  const [error, setError] = useState(null);
  const [courses, setCourse] = useState([]);



  useEffect(() => {
    const storedLoginData = JSON.parse(localStorage.getItem('Pupilslogin'));

    if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.user) {
      setLoginStudent(true);
    }

  }, []);



  useEffect(() => {
    async function fetchCourseContent() {

      try {
        let login = JSON.parse(localStorage.getItem('Pupilslogin'));

        const response = await axios.get('http://localhost:5000/api/school_pupils/course-section', {
          headers: {
            email: login.email,
            school: login.school,
          },
        });
        setCourse(response.data.message)

    
      } catch (error) {
        setError('Error retrieving content');
      }
    }

    fetchCourseContent();

  }, []);


  return (
    <div>
      {!loginStudent ? (
        <div>
          <PupilsDashboard />
        </div>
      ) : (

        <div>
          <h2>Course Dashboard</h2>

          <div>
             Course Section
            {courses.map((course, index)=>(
              <div key={index}>
                
                <Link to={`${course}/curriculum`}>{course}</Link>
              
             </div>
            ))}
    
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}


        </div>
      )}
    </div>
  );
}

export default CourseSection;
