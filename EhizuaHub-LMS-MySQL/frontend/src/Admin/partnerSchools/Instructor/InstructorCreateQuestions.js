import React, { useState, useEffect } from 'react';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import TutorDashboard from './TutorDashboard';



function TutorCreateQuestions() {
    const [loginData, setLoginData] = useState(false);
    const [error, setError] = useState(null);
    const [tutor, setTutor] = useState(null);
    const [question, setQuestion] = useState('');
    const [tutor_authorization, setTutorAuthorization] = useState('');
    const [loading, setLoading] = useState(false); // New state for loading indicator
    const [success, setSuccess] = useState('');
    const [ans1, setAns1] = useState('');
    const [ans2, setAns2] = useState('');
    const [ans3, setAns3] = useState('');
    const [ans4, setAns4] = useState('');
    const [correctAns, setCorrectAns] = useState('');
    const [course, setCourse] = useState('');
    const [main_topic, set_MainTopic] = useState('');
    const [sub_topic, set_SubTopic] = useState('');
    const [mainTopic, setMainTopic] = useState([]);
    const [subTopic, setSubTopic] = useState([]);



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
    


    // ....................... Create Question API ...................
    const createQuestion = () => {
        if (question && main_topic && sub_topic && ans1 && ans2 && ans3 && ans4 && correctAns) {
            setLoading(true); // Start loading indicator

            axios.post("http://localhost:5000/api/tutor/create-questions", {
                authHeader: tutor_authorization,
                course: course,
                mainTopic: main_topic,
                subTopic: sub_topic,
                question: question,
                ans1: ans1,
                ans2: ans2,
                ans3: ans3,
                ans4: ans4,
                correctAns: correctAns,


            })
                .then(response => {
                    setSuccess(response.data.message);


                    // Clear input fields after successful submission
                    setQuestion('');
                    setAns1('');
                    setAns2('');
                    setAns3('');
                    setAns4('');
                    setCorrectAns('');
                })
                .catch(error => {
                    console.log(error.response.data.error)
                    setError(error.response.data.error);
                    if(error.response.data.error == "Your account has been suspended. Please contact Ehizua Hub Admin." ){
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
        createQuestion();
    };

    return (
        <div className='App'>
            {!loginData ? (
                <TutorDashboard />
            ) : (

                <div>

                    <div className='App'>
                        <h1>Create Question</h1>

                        <form onSubmit={handleSubmit}>

                            <label htmlFor='course'>Course</label>
                            <input
                                type='text'
                                id='course'
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

                          

                            <label htmlFor='question'>Question</label>
                            <textarea
                                type='text'
                                id='question'
                                value={question}
                                onChange={(event) => setQuestion(event.target.value)}
                            />
                            <br /><br />

                            <label htmlFor='ans1'>Options A</label>
                            <input
                                type='text'
                                id='ans1'
                                value={ans1}
                                onChange={(event) => setAns1(event.target.value)}
                            />
                            <br /><br />
                            <label htmlFor='ans2'>Options B</label>
                            <input
                                type='text'
                                id='ans2'
                                value={ans2}
                                onChange={(event) => setAns2(event.target.value)}
                            />
                            <br /><br />
                            <label htmlFor='ans3'>Options C</label>
                            <input
                                type='text'
                                id='ans3'
                                value={ans3}
                                onChange={(event) => setAns3(event.target.value)}
                            />
                            <br /><br />
                            <label htmlFor='ans4'>Options D</label>
                            <input
                                type='text'
                                id='ans4'
                                value={ans4}
                                onChange={(event) => setAns4(event.target.value)}
                            />
                            <br /><br />
                            <label htmlFor='correctAns'>Correct Answer</label>
                            <select
                                id='correctAns'
                                value={correctAns}
                                onChange={(event) => setCorrectAns(event.target.value)}
                            >
                                <option value='' disabled>Select correct answer</option>
                                <option value={ans1}>Option A</option>
                                <option value={ans2}>Option B</option>
                                <option value={ans3}>Option C</option>
                                <option value={ans4}>Option D</option>
                            </select>
                            <br /><br />


                            <button type='submit'>Create</button>
                        </form>

                        <div>

                            <br />
                            <br />
                            <Link to="/tutor_student_details">View Student Details</Link>
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

export default TutorCreateQuestions;
