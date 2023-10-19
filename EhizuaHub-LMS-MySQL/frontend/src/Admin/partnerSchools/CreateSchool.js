import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import LoginForm from '../LoginForm';

function CreateSchool() {
    const [login, setLogin] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [schoolName, setSchoolName] = useState('');
    const [course1, setCourse1] = useState(false);
    const [course2, setCourse2] = useState(false);
    const [course3, setCourse3] = useState(false);
    const [course4, setCourse4] = useState(false);
    const [course5, setCourse5] = useState(false);
    const [monday, setMonday] = useState(false);
    const [tuesday, setTuesday] = useState(false);
    const [wednesday, setWednesday] = useState(false);
    const [thursday, setThursday] = useState(false);
    const [friday, setFriday] = useState(false);
    const [saturday, setSatuday] = useState(false);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [duration, setDuration] = useState('1x A Week');
    const [amountPaid, setAmountPaid] = useState('');
    const [courseFee, setCourseFee] = useState('');
    const [schoolAddress, setSchoolAddress] = useState('');
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

    const createSchool = () => {
        if (schoolName) {
            setLoading(true);

            axios
                .post('http://localhost:5000/api/auth/create-school', {
                    schoolName,
                    course1,
                    course2,
                    course3,
                    course4,
                    course5,
                    monday,
                    tuesday,
                    wednesday,
                    thursday,
                    friday,
                    saturday,
                    phone,
                    email,
                    duration,
                    courseFee,
                    amountPaid,
                    schoolAddress
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
        createSchool();
    };

    const clearForm = () => {
        setSchoolName('');
        setCourse1(false);
        setCourse2(false);
        setCourse3(false);
        setCourse4(false);
        setCourse5(false);
        setMonday(false);
        setTuesday(false);
        setWednesday(false);
        setThursday(false);
        setFriday(false);
        setSatuday(false);
        setEmail('');
        setPhone('');
        setDuration('');
        setCourseFee('');
        setAmountPaid('');
        setSchoolAddress('');
    };

    return (
        <div className='App'>
            {!login && !admin ? (
                <LoginForm />
            ) : (
                <div className='App'>
                    <h1>Register A New School</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='schoolName'> Name of School</label>
                        <input
                            type='text'
                            id='schoolName'
                            value={schoolName}
                            onChange={(event) => setSchoolName(event.target.value)}
                        />
                        <br /><br />


                        <h4>Select Courses Requested</h4>


                        <label>  Web Development </label>
                        <input
                            type="checkbox"
                            name="course1"
                            value="Web Development"
                            onChange={(event) => setCourse1(event.target.value)}
                        />


                        <label>   Animation </label>
                        <input
                            type="checkbox"
                            name="course2"
                            value="Animation"
                            onChange={(event) => setCourse2(event.target.value)}
                        />


                        <label>  Python Programming </label>
                        <input
                            type="checkbox"
                            name="course3"
                            value="Python Programming"
                            onChange={(event) => setCourse3(event.target.value)} />

                        <label>  Robotics </label>
                        <input
                            type="checkbox"
                            name="course4"
                            value="Robotics"
                            onChange={(event) => setCourse4(event.target.value)} />

                        <label>  Scratch and Lego Programming </label>
                        <input
                            type="checkbox"
                            name="course5"
                            value="Scratch and Lego Programming"
                            onChange={(event) => setCourse5(event.target.value)} />

                        <br /><br />


                        <h4>Select Day/Days of Activity</h4>


                        <label> Monday </label>
                        <input
                            type="checkbox"
                            name="monday"
                            value="monday"
                            onChange={(event) => setMonday(event.target.value)} />


                        <label>   Tuesday </label>
                        <input
                            type="checkbox"
                            name="tuesday"
                            value="tuesday"
                            onChange={(event) => setTuesday(event.target.value)} />


                        <label>    Wednesday </label>
                        <input
                            type="checkbox"
                            name="wednesday"
                            value='wednesday'
                            onChange={(event) => setWednesday(event.target.value)} />

                        <label>   Thursday </label>
                        <input
                            type="checkbox"
                            name="thursday"
                            value='thursday'
                            onChange={(event) => setThursday(event.target.value)} />

                        <label>  Friday </label>
                        <input
                            type="checkbox"
                            name="friday"
                            value='friday'
                            onChange={(event) => setFriday(event.target.value)} />

                        <label>  Saturday </label>
                        <input
                            type="checkbox"
                            name="saturday"
                            value="saturday"
                            onChange={(event) => setSatuday(event.target.value)} />

                        <br /><br />

                        <label htmlFor='phone'>School Contact Phone Number</label>
                        <input
                            type='number'
                            id='phone'
                            value={phone}
                            placeholder='Optional'
                            onChange={(event) => setPhone(event.target.value)}
                        />
                        <br /><br />

                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            id='email'
                            value={email}
                            placeholder='Optional'
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <br /><br />

                        <label htmlFor='duration'>Duration</label>
                        <select
                            id='duration'
                            value={duration}
                            onChange={(event) => setDuration(event.target.value)}
                        >
                            <option value='1x A Week'>Once A Week</option>
                            <option value='2x A Week'>2 Times A Week</option>
                            <option value='3x A Week'>3 Times A Week</option>
                            <option value='4x A Week'>4 Times A Week</option>
                            <option value='5x A Week'>5 Times A Week</option>
                        </select>
                        <br /><br />
                        <label htmlFor='courseFee'>Course Fee Per Child</label>
                        <input
                            type='number'
                            id='courseFee'
                            value={courseFee}
                            onChange={(event) => setCourseFee(event.target.value)}
                        />
                        <br /><br />
                        <label htmlFor='amountPaid'>Amount Paid</label>
                        <input
                            type='number'
                            id='amountPaid'
                            value={amountPaid}
                            placeholder='Optional'
                            onChange={(event) => setAmountPaid(event.target.value)}
                        />
                        <br /><br />
                        <label>School Address</label>
                        <textarea value={schoolAddress} onChange={(event) => setSchoolAddress(event.target.value)} />

                        <button type='submit'>Create School</button>
                    </form>

                    <div>
                        {loading && <p>Loading...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: 'green' }}>{success}</p>}
                    </div>

                    <Link to='/tutor_details'>View Tutor Details</Link>
                    <br />
                    <br />
                    <Link to='/all_student_details'>View Student Details</Link>
                </div>
            )}
        </div>
    );
}

export default CreateSchool;
