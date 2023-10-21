import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import LoginForm from '../LoginForm';

function CreateSubjects() {
    const [login, setLogin] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [course, setCourse] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loginData = JSON.parse(localStorage.getItem('Adminlogin'));

        if (loginData && loginData.login && loginData.admin && loginData.admin_authorization) {
            setLogin(true);
            setAdmin(true);
        }
    }, []);

    const createCourse = () => {
        if (course) {
            setLoading(true);

            axios
                .post('http://localhost:5000/api/auth/create-subject', {

                    course
                })
                .then((response) => {
                    setSuccess(response.data.message);
                    clearForm();
                })
                .catch((error) => {
                    setError(error.response.data.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setError('Please fill in all required fields.');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createCourse();
    };

    const clearForm = () => {
        setCourse('');
    };

    return (
        <div className='App'>
            {!login && !admin ? (
                <LoginForm />
            ) : (
                <div className='App'>
                    <h1>Register A New Subject for PartnerSchools</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='officeName'> Name of Course</label>
                        <input
                            type='text'
                            id='course'
                            placeholder='Required'
                            value={course}
                            onChange={(event) => setCourse(event.target.value)}
                        />
                           <br/>
                            <br/>

                        <button type='submit'>Create</button>
                    </form>

                    <div>
                        {loading && <p>Loading...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: 'green' }}>{success}</p>}
                    </div>
               
                </div>
            )}
        </div>
    );
}

export default CreateSubjects;
