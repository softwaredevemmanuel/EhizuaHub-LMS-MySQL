import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from '../LoginForm';




function CreateStaff() {
    const [login, setLogin] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [hubCourse, setHubCourse] = useState('');
    const [schoolCourse, setSchoolCourse] = useState('');
    const [allHubCourses, setHubAllCourse] = useState([""]);
    const [allSchoolCourses, setAllSchoolCourse] = useState([""]);
    const [phone, setPhone] = useState('');
    const [position, setPosition] = useState('');
    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState('');
    const [sickLeave, setSickLeave] = useState('1');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [homeAddress, setHomeAddress] = useState('');
    const [nextOfKinNumber, setNextOfKinNumber] = useState('');
    const [nextOfKinAddress, setNextOfKinAddress] = useState('');
    const [hubInstructor, setHubInstrutor] = useState(false);
    const [schoolInstructor, setSchoolInstrutor] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false); // New state for loading indicator

    const [checkedHubCourses, setCheckedHubCourses] = useState([]);
    const [checkedSchoolCourses, setCheckedSchoolCourses] = useState([]);


    const handleCheckboxChangeHub = (event) => {
        const { value, checked } = event.target;

        if (checked) {
            setCheckedHubCourses((prevCheckedHubCourses) => [...prevCheckedHubCourses, value]);
            setHubInstrutor(true)
        } else {
            setCheckedHubCourses((prevCheckedHubCourses) =>
                prevCheckedHubCourses.filter((course) => course !== value)
            );
            setHubInstrutor(false)
            setHubCourse('')
            setSelectedHubCourses([])

        }
    };
    const handleCheckboxChangeSchool = (event) => {
        const { value, checked } = event.target;

        if (checked) {
            setCheckedSchoolCourses((prevCheckedSchoolCourses) => [...prevCheckedSchoolCourses, value]);
            setSchoolInstrutor(true)
        } else {
            setCheckedSchoolCourses((prevCheckedSchoolCourses) =>
                prevCheckedSchoolCourses.filter((course) => course !== value)
            );
            setSchoolInstrutor(false)
            setSchoolCourse('')
            setSelectedSchoolCourses([])

        }
    };

    useEffect(() => {
        let login = JSON.parse(localStorage.getItem('Adminlogin'));
        let admin = login


        if ((login && admin.login && admin.admin && admin.admin_authorization)) {
            setLogin(true);
            setAdmin(true);
        }
    }, []);

    useEffect(() => {
        // Fetch all offices when the component mounts
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

    // Fetch Hub Courses
    useEffect(() => {
        async function fetchHubCourses() {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/all_upskill_courses');
                setHubAllCourse(response.data.message);
            } catch (error) {
                setError('Error retrieving Courses');
            }
        }

        fetchHubCourses();
    }, []);

        // Fetch School Courses
        useEffect(() => {
            async function fetchSchoolCourses() {
                try {
                    const response = await axios.get('http://localhost:5000/api/auth/all_school_subject');
                    setAllSchoolCourse(response.data.message);
                } catch (error) {
                    setError('Error retrieving Courses');
                }
            }
    
            fetchSchoolCourses();
        }, []);


    const createStaff = () => {
        if (
            firstName && 
            lastName && 
            email && 
            selectedOffice && 
            position && 
            phone ) 
            {
            setLoading(true); // Start loading indicator

            axios.post("http://localhost:5000/api/auth/create-staff", {
                first_name: firstName,
                last_name: lastName,
                email: email,
                dateOfBirth: dateOfBirth,
                position: position,
                hubInstructor : hubInstructor,
                schoolInstructor : schoolInstructor,
                hubCourse: selectedHubCourses,
                schoolCourse: selectedSchoolCourses,
                phone: phone,
                office: selectedOffice,
                sick_leave: sickLeave,
                homeAddress: homeAddress,
                bankName: bankName,
                accountNumber: accountNumber,
                nextOfKinNumber : nextOfKinNumber,
                nextOfKinAddress : nextOfKinAddress

            })
                .then(response => {
                    // console.log(response.data.message);
                    setSuccess(response.data.message);

                    // Clear input fields after successful submission
                    setFirstName('');
                    setLastName('');
                    setEmail('');
                    setHubCourse('');
                    setPhone('');
                    setSickLeave('');
                    setAccountNumber('');
                    setBankName('');
                    setHomeAddress('');
                    setNextOfKinNumber('');
                    setNextOfKinAddress('');
                    setOffices([]);
                    setHubInstrutor(false);
                    setSchoolInstrutor(false);

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
        createStaff();
    };

    const [selectedHubCourses, setSelectedHubCourses] = useState([]);
    const [selectedSchoolCourses, setSelectedSchoolCourses] = useState([]);

    const handleHubCheckboxChange = (course) => {
    if (selectedHubCourses.includes(course)) {
        setSelectedHubCourses(selectedHubCourses.filter((selectedHubCourse) => selectedHubCourse !== course));
        
    } else {
        setSelectedHubCourses([...selectedHubCourses, course]);
    }
    };

    const handleSchoolCheckboxChange = (course) => {
        if (selectedSchoolCourses.includes(course)) {
            setSelectedSchoolCourses(selectedSchoolCourses.filter((selectedSchoolCourse) => selectedSchoolCourse !== course));
        } else {
            setSelectedSchoolCourses([...selectedSchoolCourses, course]);
        }
        };

        // console.log(schoolInstructor)
        // console.log(hubInstructor)


    return (
        <div className='App'>
            {!login && !admin ? (
                <LoginForm />
            ) : (


                <div className='App'>
                    <h1>Register New Staff</h1>
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
                        <label htmlFor='lastName'>Date of Birth</label>
                        <input
                            type='date'
                            id='lastName'
                            autoComplete='new-password'
                            value={dateOfBirth}
                            onChange={(event) => setDateOfBirth(event.target.value)}
                        />
                        <br /><br />

                        <label htmlFor='course'>Office</label>
                        <select
                            id='offices'
                            value={selectedOffice} // Assuming you have a state variable named selectedOffice
                            onChange={(event) => setSelectedOffice(event.target.value)}
                        >
                            <option value=''>Choose an Office</option>
                            {offices.map((office, index) => (
                                <option key={index} value={`${office.officeName}`}>
                                    {office.officeName}
                                </option>
                            ))}
                        </select>

                        <br /><br />
                        <label>Position</label>
                        <input
                            type='text'
                            value={position}
                            onChange={(event) => setPosition(event.target.value)}
                        />
                        <br /><br />

                        <label>Hub Instructor</label>
                        <input
                            type='checkbox'
                            value={'true'}
                            checked={checkedHubCourses.includes('true')}

                            onChange={handleCheckboxChangeHub}
                        />
                        <br />
                        {/* <p>Is Tutor?: {checkedCourses.join(', ')}</p> */}

                        <br />
                        {hubInstructor && (
                             <div>
                             <label>Select Courses:</label>
                             {allHubCourses.map((course, index) => (
                                 <div key={index}>
                                 <input
                                     type='checkbox'
                                     id={`hubCourse-${index}`}
                                     value={course.course}
                                     checked={selectedHubCourses.includes(course.course)}
                                     onChange={() => handleHubCheckboxChange(course.course)}
                                 />
                                 <label htmlFor={`course-${index}`}>{course.course}</label>
                                 </div>
                             ))}
                         </div>
                        )}
                       


                        <label>School Instructor</label>
                        <input
                            type='checkbox'
                            value={'true'}
                            checked={checkedSchoolCourses.includes('true')}

                            onChange={handleCheckboxChangeSchool}
                        />
                        <br />
                        {/* <p>Is Tutor?: {checkedCourses.join(', ')}</p> */}

                        <br />

                        {schoolInstructor && (
                             <div>
                             <label>Select Courses:</label>
                             {allSchoolCourses.map((course, index) => (
                                 <div key={index}>
                                 <input
                                     type='checkbox'
                                     id={`schoolCourse-${index}`}
                                     value={course.course}
                                     checked={selectedSchoolCourses.includes(course.course)}
                                     onChange={() => handleSchoolCheckboxChange(course.course)}
                                 />
                                 <label htmlFor={`schoolCourse-${index}`}>{course.course}</label>
                                 </div>
                             ))}
                         </div>
                        )}


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
                        <label htmlFor='phone'>Account Number</label>
                        <input
                            type='number'
                            id='phone'
                            autoComplete='new-password'
                            value={accountNumber}
                            onChange={(event) => setAccountNumber(event.target.value)}
                        />
                        <br /><br />
                        <label>Bank Name</label>
                        <input
                            type='text'
                            id='bank'
                            autoComplete='new-password'
                            value={bankName}
                            onChange={(event) => setBankName(event.target.value)}
                        />
                        <br /><br />

                        <label>Home Address</label>
                        <textarea
                            type='address'
                            id='address'
                            autoComplete='new-password'
                            value={homeAddress}
                            onChange={(event) => setHomeAddress(event.target.value)}
                        />
                        <br /><br />
                        <label>Next of Kin Phone Number</label>
                        <input
                            type='number'
                            id='number'
                            autoComplete='new-password'
                            value={nextOfKinNumber}
                            onChange={(event) => setNextOfKinNumber(event.target.value)}
                        />
                        <br /><br />
                        <label>Next Of Kin Address</label>
                        <textarea
                            type='address'
                            id='address'
                            autoComplete='new-password'
                            value={nextOfKinAddress}
                            onChange={(event) => setNextOfKinAddress(event.target.value)}
                        />
                        <br /><br />


                        <button type='submit'>Create Staff</button>
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

export default CreateStaff;
