import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import LoginForm from './LoginForm';

function CreateStudents() {
  const [login, setLogin] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [allCourses, setAllCourse] = useState([]);
  const [phone, setPhone] = useState('');
  const [guardiansPhone, setGuardianPhone] = useState('');
  const [duration, setDuration] = useState('1 Month');
  const [courseFee, setCourseFee] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
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

  // Fetch Courses
  useEffect(() => {
    async function fetchCourses() {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/all_upskill_courses');
            setAllCourse(response.data.message);
        } catch (error) {
            setError('Error retrieving Courses');
        }
    }

      fetchCourses();
    }, []);

  const createStudent = () => {
    if (firstName && lastName && email && course && phone) {
      setLoading(true);

      axios
        .post('http://localhost:5000/api/auth/create-student', {
          firstName,
          lastName,
          email,
          course,
          phone,
          guardiansPhone,
          duration,
          courseFee,
          amountPaid,
          homeAddress,
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
    createStudent();
  };

  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setCourse('FullStack');
    setPhone('');
    setGuardianPhone('');
    setDuration('1 Month');
    setCourseFee('');
    setAmountPaid('');
    setHomeAddress('');
  };

  return (
    <div className='App'>
      {!login && !admin ? (
        <LoginForm />
      ) : (
        <div className='App'>
          <h1>Create Student</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor='firstName'>First Name</label>
            <input
              type='text'
              id='firstName'
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <br /><br />

            <label htmlFor='lastName'>Last Name</label>
            <input
              type='text'
              id='lastName'
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
            <br /><br />

            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <br /><br />

            <label htmlFor='course'>Course</label>
            <select
                  id='course'
                  value={course}
                  onChange={(event) => setCourse(event.target.value)}
              >
                  <option value=''>Select a Course</option>
                  {allCourses.map((course, index) => (
                      <option key={index} value={`${course.course}`}>
                          {course.course}
                      </option>
                  ))}
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
            <label htmlFor='guardiansPhone'>Guardians Phone Number</label>
            <input
              type='number'
              id='guardiansPhone'
              value={guardiansPhone}
              onChange={(event) => setGuardianPhone(event.target.value)}
            />
            <br /><br />
            <label htmlFor='duration'>Duration</label>
            <select
              id='duration'
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
            >
              <option value='1 Month'>1 Month</option>
              <option value='2 Months'>2 Months</option>
              <option value='3 Months'>3 Months</option>
              <option value='4 Months'>4 Months</option>
              <option value='5 Months'>5 Months</option>
            </select>
            <br /><br />
            <label htmlFor='courseFee'>Course Fee</label>
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
              onChange={(event) => setAmountPaid(event.target.value)}
            />
            <br /><br />
            <label>Home Address</label>
            <textarea value={homeAddress} onChange={(event) => setHomeAddress(event.target.value)} />

            <button type='submit'>Create Student</button>
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

export default CreateStudents;
