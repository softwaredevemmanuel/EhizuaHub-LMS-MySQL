import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import TutorDashboard from '../TutorDashboard';
import { useParams } from 'react-router-dom';




function CreateHubCourseCurriculum() {
    const [loginData, setLoginData] = useState(false);
    const [error, setError] = useState(null);
    const [staff, setStaff] = useState(null);
    const [course, setCourse] = useState('');
    const [mainTopic, setMainTopic] = useState('');
    const [subTopic, setSubTopic] = useState('');
    const [loading, setLoading] = useState(false); // New state for loading indicator
    const [success, setSuccess] = useState('');
    const [authHeader, setAuthHeader] = useState('');
    const [instructor, setInstructor] = useState('');
    const { course: contentParam } = useParams();




    // ..................useEffect for checking localStorage and Verifying Login ..............
    useEffect(() => {
        const storedLoginData = JSON.parse(localStorage.getItem('Stafflogin'));
        if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.staff_authorization) {
            setLoginData(true);
            setStaff(storedLoginData.staff);
            setCourse(storedLoginData.hubCourse);
            setAuthHeader(storedLoginData.staff_authorization)
            setInstructor(storedLoginData.instructor)

        }
    }, []);

    const coursesArray = course.split(', ');

     // Locate the Curriculum based on the course parameter
     const curriculumCourse = coursesArray.find((curriculumCourse) => curriculumCourse === contentParam);


    // ....................... Create Question API ...................

    const CreateCurriculum = () => {
        if (course && mainTopic && subTopic) {
            setLoading(true); // Start loading indicator

            axios.post("http://localhost:5000/api/hub-tutor/create-curriculum", {
                authHeader: authHeader,
                course: curriculumCourse,
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
                    setError(error.response.data.message);
                    if(error.response.data.error == "Your account has been suspended. Please contact Ehizua Hub Admin." ){
                        localStorage.setItem('Stafflogin', JSON.stringify({
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
         CreateCurriculum();
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
                                value={curriculumCourse}
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

export default CreateHubCourseCurriculum;
