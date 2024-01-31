import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StaffLogin from '../../Staff/StaffLogin';
import { useParams } from 'react-router-dom';


function ViewHubCurriculum() {
  const [loginData, setLoginData] = useState(null);
  const [error, setError] = useState(null);
  const [content, setContent] = useState([]);
  const [course, setCourse] = useState('');
  const { course: contentParam } = useParams();




  // ..................useEffect for checking localStorage and Verifying Login ..............
  useEffect(() => {
    const storedLoginData = JSON.parse(localStorage.getItem('Stafflogin'));
    if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.staff_authorization) {
      setLoginData(true);
      setCourse(storedLoginData.hubCourse);

    }
  }, []);

  const coursesArray = course.split(', ');
  // Locate the Curriculum based on the course parameter
  const contentCourse = coursesArray.find((contentCourse) => contentCourse === contentParam);



  useEffect(() => {
    async function fetchCourseContent() {
        try {

          let storedData = JSON.parse(localStorage.getItem('Stafflogin'));

          const response = await axios.get('http://localhost:5000/api/hub-tutor/course-curriculum', {
            headers: {
              authHeader: storedData.staff_authorization,
              course : contentCourse
            },
          });

          setLoginData(true);
          setContent(response.data.content);

        } catch (error) {
          setError('Error retrieving content');
        }
      }


      fetchCourseContent();
  }, [contentCourse]);

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
                    {subContent.subTopic.split(', ').map((topic, topicIndex) => (
                      <p key={topicIndex}>{topic}</p>
                    ))}
                  </div>
                ))}
            </div>
          ))}


        </div>
      )}
    </div>
  );
}

export default ViewHubCurriculum;

