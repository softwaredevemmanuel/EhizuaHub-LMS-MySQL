import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TutorDashboard from '../TutorDashboard';
import { useParams } from 'react-router-dom';



function CreateHubCourseContent() {
  const [loginData, setLoginData] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading indicator
  const [success, setSuccess] = useState('');
  const [course, setCourse] = useState('');
  const [main_topic, set_MainTopic] = useState('');
  const [sub_topic, set_SubTopic] = useState('');
  const [mainTopic, setMainTopic] = useState([]);
  const [subTopic, setSubTopic] = useState([]);
  const [staff_authorization, setStaffAuthorization] = useState('');
  const { course: contentParam } = useParams();




// ..................useEffect for checking localStorage and Verifying Login ..............
useEffect(() => {
  const storedLoginData = JSON.parse(localStorage.getItem('Stafflogin'));
  if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.staff_authorization) {
    setLoginData(true);
    setCourse(storedLoginData.hubCourse);
    setStaffAuthorization(storedLoginData.staff_authorization)

  }
}, []);

const coursesArray = course.split(', ');

// Locate the Content based on the course parameter
const contentCourse = coursesArray.find((curriculumCourse) => curriculumCourse === contentParam);


  useEffect(() => {
    async function fetchMainTopic() {

        try {
          const response = await axios.get('http://localhost:5000/api/hub-tutor/maintopic', {
            headers: {
              course: contentCourse,
            },
          });
          console.log(response.data.message)
          setMainTopic(response.data.message)

       
        } catch (error) {
          setError('Error fetching curriculum data');
        }
      }

      fetchMainTopic();
      
  }, [contentCourse]);



  useEffect(() => {
    async function fetchSubTopic() {
      try {
        if (main_topic !== '') { // Check if a topic is selected

          const response = await axios.get('http://localhost:5000/api/hub-tutor/subtopic', {
            headers: {
              course: contentCourse,
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

      axios.post("http://localhost:5000/api/hub-tutor/create-content", {
        authHeader: staff_authorization,
        main_topic: main_topic,
        content: content,
        course : contentCourse,
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
                  value={contentCourse}
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

export default CreateHubCourseContent;
