import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PupilsDashboard from './PupilsDashboard';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';



function CourseCurriculum() {
  const [loginStudent, setLoginStudent] = useState(false); // Initialize with false
  const [error, setError] = useState(null);
  const [courses, setCourse] = useState([]);
  const { course: contentParam } = useParams();



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

        const response = await axios.get('http://localhost:5000/api/school_pupils/course-curriculum', {
          headers: {
            course : contentParam,
            email: login.email,
            school: login.school
          },
        });
        setCourse(response.data.message)

    
      } catch (error) {
        setError('Error retrieving content');
      }
    }

    fetchCourseContent();

  }, []);

  const uniqueMainTopics = [...new Set(courses.map((item) => item.mainTopic))];



  return (
    <div>
      {!loginStudent ? (
        <div>
          <PupilsDashboard />
        </div>
      ) : (

        <div>
          <h2>Course Curriculum</h2>

          <div>

            {uniqueMainTopics.map((mainTopic, mainIndex) => (
                <div key={mainIndex}>
                <p>{mainTopic}</p>
                {courses
                    .filter((item) => item.mainTopic === mainTopic)
                    .map((subContent, subIndex) => (
                    <div key={subIndex}>
                        {subContent.subTopic.split(', ').map((topic, topicIndex) => (
                        <p key={topicIndex}><Link to={`/school-student-dashboard/${topic}/${mainTopic}`}> {topic}</Link>
                        </p>
                        
                        ))}
                    </div>
                    ))}
                </div>
            ))}
    
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}


        </div>
      )}
    </div>
  );
}

export default CourseCurriculum;
