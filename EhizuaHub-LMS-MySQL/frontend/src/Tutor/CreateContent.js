import React, { useState, useEffect } from 'react';
import axios from 'axios';
import  secureLocalStorage  from  "react-secure-storage";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import TutorDashboard from './TutorDashboard';



function CreateContent() {
  const [loginData, setLoginData] = useState(false);
  const [error, setError] = useState(null);
  const [tutor, setTutor] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading indicator
  const [success, setSuccess] = useState('');
  const [course, setCourse] = useState('');
  const [main_topic, set_MainTopic] = useState('');
  const [sub_topic, set_SubTopic] = useState('');
  const [mainTopic, setMainTopic] = useState([]);
  const [subTopic, setSubTopic] = useState([]);
  const [tutor_authorization, setTutorAuthorization] = useState('');



// ..................useEffect for checking localStorage and Verifying Login ..............
useEffect(() => {
  const storedLoginData = JSON.parse(localStorage.getItem('Tutorlogin'));
  if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.tutor_authorization) {
    setLoginData(true);
    setTutor(storedLoginData.tutor);
    setCourse(storedLoginData.course);
    setTutorAuthorization(storedLoginData.tutor_authorization)

  }
}, []);



  useEffect(() => {
    async function fetchMainTopic() {

        try {
          let login = JSON.parse(localStorage.getItem('Tutorlogin'));

          const response = await axios.get('http://localhost:5000/api/tutor/maintopic', {
            headers: {
              course: login.course,
            },
          });
          setMainTopic(response.data.message)

       
        } catch (error) {
          setError('Error fetching curriculum data');
        }
      }

      fetchMainTopic();
      
  }, []);



  useEffect(() => {
    async function fetchSubTopic() {
      try {
        if (main_topic !== '') { // Check if a topic is selected
          let login = JSON.parse(localStorage.getItem('Tutorlogin'));

          const response = await axios.get('http://localhost:5000/api/tutor/subtopic', {
            headers: {
              course: login.course,
              main_topic: main_topic
            },
          });

          setSubTopic(response.data.subTopics);
        }
      } catch (error) {
        setError('Error fetching curriculum data');
      }
    }
  
    fetchSubTopic();
  }, [main_topic]); // Include 'topic' in the dependency array


  
// ........................ Create Content API ...................

  const createContent = () => {
    if (main_topic && content) {
      setLoading(true); // Start loading indicator

      axios.post("http://localhost:5000/api/tutor/create-content", {
        authHeader: tutor_authorization,
        main_topic: main_topic,
        content: content,
        course : course,
        sub_topic : sub_topic
      })
      .then(response => {
        setSuccess(response.data.message);

        // Clear input fields after successful submission
        set_MainTopic('');
        setContent('');
        set_SubTopic('');
      })
      .catch(error => {
        setError(error.response.data.error);
        if(error.response.data.error === "Your account has been suspended. Please contact Ehizua Hub Admin." ){
          localStorage.setItem('Tutorlogin', JSON.stringify({
              login: false,
            }));    
      }
      })
      .finally(() => {
        setLoading(false); // Stop loading indicator
      });
    } else {
      setError('Please fill in all required fields.');
    }
  };


  const handleSubmit = event => {
    event.preventDefault();
    createContent();
  };


  return (
    <div className='App'>
      {!loginData ? (
       <TutorDashboard/>
      ) : (

          <div>

            <div className='App'>
              <h1>Create Content</h1>

              <form onSubmit={handleSubmit}>

              <label htmlFor='course'>Course</label>
              <input
                  type='text'
                  id='course'
                  autoComplete='course'
                  value={course}
                  onChange={(event) => setCourse(event.target.value)}
                  readOnly

                />
                <br /><br />
                <label htmlFor='mainTopic'>Main Topic</label>
                <br />
                

                <select
                    id='mainTopic'
                    value={main_topic}
                    onChange={(event) => set_MainTopic(event.target.value)}
                  >
                    <option value=''>Select the Main Topic</option>
                    {mainTopic.map((mainTopic, index) => (
                      <option key={index} value={mainTopic.mainTopic}>
                        {mainTopic.mainTopic}
                      </option>
                    ))}
                </select>
                <br /><br />
                <label htmlFor='firstName'>Sub Topic</label>
                <br />
                <select
                    id='sub_topic'
                    value={sub_topic}
                    onChange={(event) => set_SubTopic(event.target.value)}
                >
                    <option value=''>Select a sub Topic</option>
                    {subTopic.map((subTopic, index) => (
                        <option key={index} value={subTopic}>  {/* Set the value attribute */}
                            {subTopic}
                        </option>
                    ))}
                </select>

              
                
                <br /><br />

                <label htmlFor='lastName'>Content</label>
                <textarea
                  type='text'
                  id='content'
                  autoComplete='new-password'
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                />
                <br /><br />

                <button type='submit'>Submit</button>
              </form>

            <div>

            <br/>
            <br/>
            
                {loading && <p>Loading...</p>} {/* Display loading indicator */}

                {error && <p style={{ color: 'red' }}>{error}</p>}
                  {success && <p style={{ color: 'green' }}>{success}</p>}
            </div>
      </div>
          </div>

          
          
      )}
    </div>
  );
}

export default CreateContent;
