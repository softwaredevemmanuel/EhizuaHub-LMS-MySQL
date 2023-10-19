import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PupilsDashboard from './PupilsDashboard';


function CourseSection() {
  const [loginStudent, setLoginStudent] = useState(false); // Initialize with false
  const [error, setError] = useState(null);
  const [content1, setContent1] = useState([]);
  const [content2, setContent2] = useState([]);
  const [content3, setContent3] = useState([]);
  const [content4, setContent4] = useState([]);
  const [content5, setContent5] = useState([]);



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

        const response = await axios.get('http://localhost:5000/api/students/pupils-course-content', {
          headers: {
            email: login.email,
            school: login.school,
          },
        });
        setLoginStudent(true);
        setContent1(response.data.content1);
        setContent2(response.data.content2);
        setContent3(response.data.content3);
        setContent4(response.data.content4);
        setContent5(response.data.content5);
      } catch (error) {
        setError('Error retrieving content');
      }
    }

    fetchCourseContent();

  }, []);




  const uniqueMainTopics1 = [...new Set((content1 ?? []).map((item) => item.mainTopic))];
  const uniqueMainTopics2 = [...new Set((content2 ?? []).map((item) => item.mainTopic))];
  const uniqueMainTopics3 = [...new Set((content3 ?? []).map((item) => item.mainTopic))];
  const uniqueMainTopics4 = [...new Set((content4 ?? []).map((item) => item.mainTopic))];
  const uniqueMainTopics5 = [...new Set((content5 ?? []).map((item) => item.mainTopic))];



  return (
    <div>
      {!loginStudent ? (
        <div>
          <PupilsDashboard />
        </div>
      ) : (

        <div>
          <h2>hhhhhhh</h2>

          <div>
            {content1 ? (
              <div>
                <h3>Animation</h3>

                {uniqueMainTopics1.map((mainTopic, mainIndex) => (
                  <div key={mainIndex}>
                    <p>{mainTopic}</p>
                    {content1
                      .filter((item) => item.mainTopic === mainTopic)
                      .map((subContent, subIndex) => (
                        <div key={subIndex}>
                          <a href={`/details/${subContent.id}`}>
                            <p>{subContent.subTopic}</p>
                          </a>
                        </div>

                      ))}
                    <hr />

                  </div>
                ))}

              </div>

            ) : (
              ''
            )}
          </div>
          <div>
            {content2 ? (
              <div>
                {uniqueMainTopics2.map((mainTopic, mainIndex) => (
                  <div key={mainIndex}>
                    <p>{mainTopic}</p>
                    {content2
                      .filter((item) => item.mainTopic === mainTopic)
                      .map((subContent, subIndex) => (
                        <div key={subIndex}>
                          <a href={`/details/${subContent.id}`}>
                            <p>{subContent.subTopic}</p>
                          </a>
                        </div>

                      ))}
                                      <hr />

                  </div>
                ))}

              </div>

            ) : (
              ''
            )}
          </div>

          <div>
            {content3 ? (
              <div>
                {uniqueMainTopics3.map((mainTopic, mainIndex) => (
                  <div key={mainIndex}>
                    <p>{mainTopic}</p>
                    {content3
                      .filter((item) => item.mainTopic === mainTopic)
                      .map((subContent, subIndex) => (
                        <div key={subIndex}>
                          <a href={`/details/${subContent.id}`}>
                            <p>{subContent.subTopic}</p>
                          </a>
                        </div>

                      ))}
                                      <hr />

                  </div>
                ))}

              </div>

            ) : (
              ''
            )}
          </div>

          <div>
            {content4 ? (
              <div>
                {uniqueMainTopics4.map((mainTopic, mainIndex) => (
                  <div key={mainIndex}>
                    <p>{mainTopic}</p>
                    {content4
                      .filter((item) => item.mainTopic === mainTopic)
                      .map((subContent, subIndex) => (
                        <div key={subIndex}>
                          <a href={`/details/${subContent.id}`}>
                            <p>{subContent.subTopic}</p>
                          </a>
                        </div>

                      ))}
                                      <hr />

                  </div>
                ))}

              </div>

            ) : (
              ''
            )}
          </div>

          <div>
            {content5 ? (
              <div>
                <h3>Web Development</h3>
                {uniqueMainTopics5.map((mainTopic, mainIndex) => (
                  <div key={mainIndex}>
                    <p>{mainTopic}</p>
                    {content5
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
                <hr />

              </div>

            ) : (
              ''
            )}
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}


        </div>
      )}
    </div>
  );
}

export default CourseSection;
