import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoginForm from '../LoginForm';



const StudentsProgress = () => {
    const [student, setStudents] = useState([]);
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [login, setLogin] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [percentage, setPercentage] = useState([]);

    const { course, email } = useParams();
    useEffect(() => {
        let login = JSON.parse(localStorage.getItem('Adminlogin'));
        let admin = login
      
    
        if ((login && admin.login && admin.admin && admin.admin_authorization)) {
          setLogin(true);
          setAdmin(true);
        }  
      }, []);


    // Get the content parameter from the URL using useParams
    const { _id: contentParam } = useParams();

    useEffect(() => {
        async function fetchStudents() {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/students', {

                });
                setStudents(response.data.students);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }

        fetchStudents();

    }, []);

    const contentItem = student.find((item) => item._id == contentParam);

    useEffect(() => {

        async function fetchCourseContent() {

            try {

                const response = await axios.get('http://localhost:5000/api/auth/student-course-content', {
                headers : {
                    course : course

                }    
                });
                setContent(response.data.content);
            } catch (error) {
                setError('Error retrieving content');
            }
        }
        fetchCourseContent()
    }, [course]);



    const uniqueMainTopics = [...new Set(content.map((item) => item.mainTopic))];

    useEffect(() =>{
        async function fetchScore() {
            try {
              const response = await axios.get('http://localhost:5000/api/auth/student-score', {
                headers: {
                  course : course,
                  email : email,
                },
              });
              console.log(response.data.message)
              setPercentage(response.data.message);

            } catch (error) {
              setError('Error retrieving content');
              setLoading(false);
            }
          }
          fetchScore()
    },[course, email]);
    

    return (

        <div className='App'>
        {!login && !admin? (
          <LoginForm/>
        ) : (
        <div>
            {contentItem && (

                <div>
                    <h3>{contentItem.firstName} {contentItem.lastName} Progress </h3>

                </div>
            )}


            {loading && <p>Loading...</p>}
            <div>

                <div>

                    {uniqueMainTopics.map((mainTopic, mainIndex) => (
                        <div key={mainIndex}>
                            <p>{mainTopic}</p>
                            {content
                                .filter((item) => item.mainTopic === mainTopic)
                                .map((subContent, subIndex) => (
                                    <div key={subIndex}>
                                        
                                            <p>{subContent.subTopic}</p>
                                         
                                    
                                    </div>
                                ))}
                        </div>
                    ))}

                </div>
                {percentage.map((percentage, index) => (
                      <option key={index} value={percentage.score}>
                        {percentage.subTopic} {percentage.score}%
                      </option>
                    ))}

            </div>
           
        </div>
         )}
         </div>
    );
};

export default StudentsProgress;
