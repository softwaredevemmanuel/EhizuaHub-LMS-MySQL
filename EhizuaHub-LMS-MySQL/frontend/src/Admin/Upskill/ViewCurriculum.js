import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoginForm from '../LoginForm';


function ViewCurriculum() {
  const [error, setError] = useState(null);
  const [content, setContent] = useState([]);
  const [login, setLogin] = useState(null);
  const [admin, setAdmin] = useState(null);

  const { course: contentParam } = useParams();


  useEffect(() => {
    let login = JSON.parse(localStorage.getItem('Adminlogin'));
    let admin = login
  

    if ((login && admin.login && admin.admin && admin.admin_authorization)) {
      setLogin(true);
      setAdmin(true);
    }  
  }, []);




  useEffect(() => {
    async function fetchCurriculum() {
        try {

          const response = await axios.get('http://localhost:5000/api/auth/upskill-course-curriculum', {
            headers: {
              course : contentParam
            },
          });

          setContent(response.data.content);

        } catch (error) {
          setError('Error retrieving curriculum');
        }
      }


      fetchCurriculum();
  }, []);

  const uniqueMainTopics = [...new Set(content.map((item) => item.mainTopic))];


  return (
    <div>
     {!login && !admin? (
        <LoginForm/>
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
      {error}
    </div>
  );
}

export default ViewCurriculum;

