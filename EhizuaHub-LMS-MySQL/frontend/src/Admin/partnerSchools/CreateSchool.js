import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import LoginForm from '../LoginForm';

function CreateSchool() {
    const [login, setLogin] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [schoolName, setSchoolName] = useState('');
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
    const [allCourses, setAllCourse] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const [checkedCourses, setCheckedCourses] = useState([]);



    useEffect(() => {
        const loginData = JSON.parse(localStorage.getItem('Adminlogin'));

        if (loginData && loginData.login && loginData.admin && loginData.admin_authorization) {
            setLogin(true);
            setAdmin(true);
        }
    }, []);

    // Fetch Courses
    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/all_school_subject');
                setAllCourse(response.data.message);
            } catch (error) {
                setError('Error retrieving Courses');
            }
        }

        fetchCourses();
    }, []);


    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;

        if (checked) {
            setCheckedCourses((prevCheckedCourses) => [...prevCheckedCourses, value]);
        } else {
            setCheckedCourses((prevCheckedCourses) =>
                prevCheckedCourses.filter((course) => course !== value)
            );
        }
    };


    const createSchool = () => {
        if (schoolName) {
            setLoading(true);

            axios
                .post('http://localhost:5000/api/auth/create-school', {

                    schoolName,
                    checkedCourses,
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
            {login && admin ? (
                <LoginForm />
            ) : (
                <div className='row'>
                    <div className='col-3'>
                    <div className='h-100 d-inline-block box col-12'>
                        
                    </div>
                    </div>
                
                    <div className='col'>
                        <div className='container'>
                            <h1>Register A New School</h1>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor='schoolName' className='form-label'> Name of School</label>
                                <input
                                    className='form-control'
                                    type='text'
                                    id='schoolName'
                                    value={schoolName}
                                    onChange={(event) => setSchoolName(event.target.value)}
                                />


                                <h4>Select Courses Requested</h4>

                                <div className='input-group'>
                                    {allCourses.map((course, index) => (
                                        <div key={index}>
                                            <label className='form-check-label'>
                                                {course.course}
                                                <input
                                                    className='form-check-input'
                                                    type="checkbox"
                                                    value={course.course}
                                                    checked={checkedCourses.includes(course.course)}
                                                    onChange={handleCheckboxChange}
                                                />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <p>Checked Courses: {checkedCourses.join(', ')}</p>





                                <div>
                                    <h4>Select Day/Days of Activity</h4>

                                    <label> Monday </label>
                                    <input
                                        className='form-check-input'
                                        type="checkbox"
                                        name="monday"
                                        value="monday"
                                        onChange={(event) => setMonday(event.target.value)} />


                                    <label>   Tuesday </label>
                                    <input
                                        className='form-check-input'
                                        type="checkbox"
                                        name="tuesday"
                                        value="tuesday"
                                        onChange={(event) => setTuesday(event.target.value)} />


                                    <label>    Wednesday </label>
                                    <input
                                        className='form-check-input'
                                        type="checkbox"
                                        name="wednesday"
                                        value='wednesday'
                                        onChange={(event) => setWednesday(event.target.value)} />

                                    <label>   Thursday </label>
                                    <input
                                        className='form-check-input'
                                        type="checkbox"
                                        name="thursday"
                                        value='thursday'
                                        onChange={(event) => setThursday(event.target.value)} />

                                    <label>  Friday </label>
                                    <input
                                        className='form-check-input'
                                        type="checkbox"
                                        name="friday"
                                        value='friday'
                                        onChange={(event) => setFriday(event.target.value)} />

                                    <label>  Saturday </label>
                                    <input
                                        className='form-check-input'
                                        type="checkbox"
                                        name="saturday"
                                        value="saturday"
                                        onChange={(event) => setSatuday(event.target.value)} />

                                </div>
                                <br/>

                                <div className='container'>
                                    <div className='row'>
                                        <div className='col'>
                                            <label htmlFor='phone' className='form-label'>Phone Number</label>
                                            <input
                                                className='form-control'
                                                type='number'
                                                id='phone'
                                                value={phone}
                                                placeholder='Optional'
                                                onChange={(event) => setPhone(event.target.value)}
                                            />
                                        </div>
                                        <div className='col'>
                                            <label htmlFor='email' className='form-label'>Email</label>
                                            <input
                                                className='form-control'
                                                type='email'
                                                id='email'
                                                value={email}
                                                placeholder='Optional'
                                                onChange={(event) => setEmail(event.target.value)}
                                            />
                                        </div>

                                    </div>

                                


                                
                                </div>

                                <div className='container'>
                                    <div className='row'>
                                        <div className='col'>
                                            <label htmlFor='duration' className='form-label'>Duration</label>
                                            <select
                                                className='form-select'
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

                                        </div>

                                        <div className='col'>
                                            <label htmlFor='courseFee' className='form-label'>Fee Per Child</label>
                                            <input
                                                className='form-control'
                                                type='number'
                                                id='courseFee'
                                                value={courseFee}
                                                onChange={(event) => setCourseFee(event.target.value)}
                                            />

                                        </div>
                                        <div className='col'>
                                            <label htmlFor='amountPaid'>₦ Amount Paid</label>

                                                <input
                                                    className='form-control'
                                                    type='number'
                                                    id='amountPaid'
                                                    value={amountPaid}
                                                    placeholder='Optional'
                                                    onChange={(event) => setAmountPaid(event.target.value)}
                                                />

                                        </div>

                                    </div>

                                </div>

                    

                                <br /><br />
                                <label className='form-label'>School Address</label>
                                <textarea 
                                    className='form-control'
                                    value={schoolAddress} 
                                    onChange={(event) => setSchoolAddress(event.target.value)} 
                                />

                                <button type='submit' className='form-control' style={{ color: '#F13178' }}>
                                    Create School
                                </button>
                            </form>

                        </div>
                        

                        <div>
                            {loading && <p>Loading...</p>}
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            {success && <p style={{ color: 'green' }}>{success}</p>}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateSchool;
