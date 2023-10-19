import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';




function CreateInstructor() {
    const [login, setLogin] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [course, setCourse] = useState('FullStack');
    const [phone, setPhone] = useState('');
    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState('');
    const [sickLeave, setSickLeave] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false); // New state for loading indicator


    useEffect(() => {
        let login = JSON.parse(localStorage.getItem('Adminlogin'));
        let admin = login


        if ((login && admin.login && admin.admin && admin.admin_authorization)) {
            setLogin(true);
            setAdmin(true);
        }
    }, []);

    useEffect(() => {
        // Fetch tutors when the component mounts
        async function fetchOffices() {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/all_offices');
                setOffices(response.data.message);
            } catch (error) {
                setError('Error retrieving Area Offices');
            }
        }

        fetchOffices();
    }, []);




    const CreateInstructor = () => {
        if (firstName && lastName && email && course && phone) {
            setLoading(true); // Start loading indicator

            axios.post("http://localhost:5000/api/auth/create-instructor", {
                first_name: firstName,
                last_name: lastName,
                email: email,
                course: course,
                phone: phone,
                office: selectedOffice,
                sick_leave: sickLeave
            })
                .then(response => {
                    console.log(response.data.message);
                    setSuccess(response.data.message);

                    // Clear input fields after successful submission
                    setFirstName('');
                    setLastName('');
                    setEmail('');
                    setCourse('FullStack');
                    setPhone('');
                    setSickLeave('');
                })
                .catch(error => {
                    console.log(error.response.data.message);
                    setError(error.response.data.message);
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
        CreateInstructor();
    };


    return (
        <div className='App'>
            {!login && !admin ? (
                <LoginForm />
            ) : (


                <div className='App'>
                    <h1>Create Instructor</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='firstName'>First Name</label>
                        <input
                            type='text'
                            id='firstName'
                            autoComplete='new-password'
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                        />
                        <br /><br />

                        <label htmlFor='lastName'>Last Name</label>
                        <input
                            type='text'
                            id='lastName'
                            autoComplete='new-password'
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                        />
                        <br /><br />

                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            id='email'
                            autoComplete='new-password'
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <br /><br />

                        <label htmlFor='course'>Office</label>
                        <select
                            id='offices'
                            value={selectedOffice} // Assuming you have a state variable named selectedOffice
                            onChange={(event) => setSelectedOffice(event.target.value)}
                        >
                            <option value=''>Choose Area Office</option>
                            {offices.map((office, index) => (
                                <option key={index} value={`${office.officeName} ${office.state}`}>
                                    {office.officeName} {office.state}
                                </option>
                            ))}
                        </select>

                        <br /><br />

                        <label htmlFor='course'>Course</label>
                        <select
                            id='course'
                            value={course}
                            onChange={(event) => setCourse(event.target.value)}
                        >
                            <option value='FullStack'>FullStack</option>
                            <option value='Animation'>Animation</option>
                            <option value='Data Analysis'>Data Analysis</option>
                            <option value='Photography'>Photography</option>
                            <option value='Desktop Publishing'>Desktop Publishing</option>
                        </select>
                        <br /><br />

                        <label htmlFor='phone'>Phone Number</label>
                        <input
                            type='number'
                            id='phone'
                            autoComplete='new-password'
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                        />
                        <br /><br />
                        <label htmlFor='phone'>Allocate Sick Leave For the Year</label>
                        <select
                            id='sickLeave'
                            value={sickLeave}
                            onChange={(event) => setSickLeave(event.target.value)}
                        >
                            <option value='1'>1</option>
                            <option value='2'>2</option>
                            <option value='3'>3</option>
                            <option value='4'>4</option>
                            <option value='5'>5</option>
                            <option value='6'>6</option>
                            <option value='7'>7</option>
                            <option value='8'>8</option>
                            <option value='9'>9</option>
                            <option value='10'>10</option>
                         
                        </select>
                        <br /><br />

                        <button type='submit'>Create Tutor</button>
                    </form>

                    <div>
                        {loading && <p>Loading...</p>} {/* Display loading indicator */}

                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: 'green' }}>{success}</p>}
                    </div>

                </div>

            )}



        </div>
    );
}

export default CreateInstructor;
