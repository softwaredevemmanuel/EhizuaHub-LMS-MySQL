import React, { useState, useEffect } from 'react';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import TutorDashboard from './TutorDashboard';



function CreateCurriculum() {
    const [loginData, setLoginData] = useState(false);
    const [error, setError] = useState(null);
    const [tutor, setTutor] = useState(null);
    const [course, setCourse] = useState('');
    const [mainTopic, setMainTopic] = useState('');
    const [subTopic, setSubTopic] = useState('');
    const [loading, setLoading] = useState(false); // New state for loading indicator
    const [success, setSuccess] = useState('');
    const [authHeader, setAuthHeader] = useState('');



    // ..................useEffect for checking localStorage and Verifying Login ..............
    useEffect(() => {
        const storedLoginData = JSON.parse(localStorage.getItem('Tutorlogin'));
        if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.tutor_authorization) {
            setLoginData(true);
            setTutor(storedLoginData.tutor);
            setCourse(storedLoginData.course);
            setAuthHeader(storedLoginData.tutor_authorization)
        }
    }, []);





    // ....................... Create Question API ...................

    const createQuestion = () => {
        if (course && mainTopic && subTopic) {
            setLoading(true); // Start loading indicator

            axios.post("http://localhost:5000/api/tutor/create-curriculum", {
                authHeader: authHeader,
                course: course,
                mainTopic: mainTopic,
                subTopic: subTopic,
               
            })
                .then(response => {
                    setSuccess(response.data.message);

                    // Clear input fields after successful submission
                    setMainTopic('');
                    setSubTopic('');
                })
                .catch(error => {
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
                        <h1>Create Curriculum</h1>

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

                            <label htmlFor='topic'>Main Topic</label>
                            <input 
                                type='text'
                                id='mainTopic'
                                value={mainTopic}
                                onChange={(event) => setMainTopic(event.target.value)}/>

                            <br /><br />

                        

                            <h3>Sub-Topics</h3>
                            <h5>Please Seperate Each topic with a comma</h5>
                            <h5>Example: Topic1, Topic2, Topic3, Topic4, Topic6</h5>
                            <textarea
                                type='text'
                                id='subTopic'
                                value={subTopic}
                                onChange={(event) => setSubTopic(event.target.value)}
                            />
                            <br /><br />
                         
                            <br /><br />


                            <button type='submit'>Create</button>
                        </form>

                        <div>

                            <br />
                            <br />
                            <Link to="/tutor_student_details">View Student Details</Link>
                            <br/>
                            <br/>
                            <Link to="/tutor_dashboard">Create Course Content</Link>
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

export default CreateCurriculum;
