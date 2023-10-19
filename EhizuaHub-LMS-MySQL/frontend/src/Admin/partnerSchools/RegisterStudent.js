import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import LoginForm from '../LoginForm';

function RegisterStudent() {
  const [login, setLogin] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [course, setCourse] = useState('Web Development');
  const [guardiansPhone, setGuardianPhone] = useState('');
  const [year, setYear] = useState('2023');
  const [term, setTerm] = useState('First Term');
  const [level, setLevel] = useState('Primary 1');
  const [schools, setSchools] = useState([]);
  const [selectSchool, setSelectSchool] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [course1, setCourse1] = useState('');
  const [course2, setCourse2] = useState('');
  const [course3, setCourse3] = useState('');
  const [course4, setCourse4] = useState('');
  const [course5, setCourse5] = useState('');
 

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem('Adminlogin'));

    if (loginData && loginData.login && loginData.admin && loginData.admin_authorization) {
      setLogin(true);
      setAdmin(true);
    }
  }, []);

  useEffect(() => {
    async function fetchSchools() {

      try {

        const response = await axios.get('http://localhost:5000/api/auth/partner-schools', {

        });
        setSchools(response.data.message)

      } catch (error) {
        setError('Error fetching schools data');
      }
    }

    fetchSchools();

  }, []);

  const createStudent = () => {
    if (selectSchool && firstName && lastName && (course1 || course2 || course3 || course4 || course5 ) && level && year && term) {
      setLoading(true);

      axios
        .post('http://localhost:5000/api/auth/register-school-student', {
          selectSchool,
          firstName,
          lastName,
          level,
          course1,
          course2,
          course3,
          course4,
          course5,
          year,
          term,
          guardiansPhone,
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
    setLevel('');
    setCourse('');
    setGuardianPhone('');
  };

  return (
    <div className='App'>
      {!login && !admin ? (
        <LoginForm />
      ) : (
        <div className='App'>
          <h1>Register School Student</h1>
          <form onSubmit={handleSubmit}>

            <label htmlFor='selectSchool'>Select School</label>

            <select
              id='selectSchool'
              value={selectSchool}
              onChange={(event) => setSelectSchool(event.target.value)}
            >
              <option value=''>Choose a School</option>
              {schools.map((schools, index) => (
                <option key={index} value={schools.schoolName}>
                  {schools.schoolName}
                </option>
              ))}
            </select>

            <br />
            <br />


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

            <label htmlFor='level'>Class</label>
            <select
              id='level'
              value={level}
              onChange={(event) => setLevel(event.target.value)}
            >
              <option value='Primary 1'>Primary 1</option>
              <option value='Primary 2'>Primary 2</option>
              <option value='Primary 3'>Primary 3 </option>
              <option value='Primary 4'>Primary 4</option>
              <option value='Primary 5'>Primary 5 </option>
              <option value='Primary 6'>Primary 6 </option>
              <option value='JSS 1'>Junior Secondary School 1</option>
              <option value='JSS 2'>Junior Secondary School 2</option>
              <option value='JSS 3'>Junior Secondary School 3</option>
              <option value='SSS 1'>Senior Secondary School 1</option>
              <option value='SSS 2'>Senior Secondary School 2</option>
              <option value='SSS 3'>Senior Secondary School 3</option>
            </select>
            <br /><br />


            {/* <label htmlFor='course'>Course</label>
            <select
              id='course'
              value={course}
              onChange={(event) => setCourse(event.target.value)}
            >
              <option value='FullStack'>Web Development</option>
              <option value='Animation'>Animation</option>
              <option value='Robotics'>Robotics </option>
              <option value='Photography'>Photography</option>
              <option value='Python Programming'>Python Programming</option>
            </select>
            <br /><br /> */}
            <h4>Select Courses Requested</h4>


            <label>  Web Development </label>
            <input
              type="checkbox"
              name="course1"
              value="Web Development"
              onChange={(event) => setCourse1(event.target.value)}
            />
<br />

            <label>   Animation </label>
            <input
              type="checkbox"
              name="course2"
              value="Animation"
              onChange={(event) => setCourse2(event.target.value)}
            />
<br />

            <label>  Python Programming </label>
            <input
              type="checkbox"
              name="course3"
              value="Python Programming"
              onChange={(event) => setCourse3(event.target.value)} />
<br />
            <label>  Robotics </label>
            <input
              type="checkbox"
              name="course4"
              value="Robotics"
              onChange={(event) => setCourse4(event.target.value)} />
<br />
            <label>  Scratch and Lego Programming </label>
            <input
              type="checkbox"
              name="course5"
              value="Scratch and Lego Programming"
              onChange={(event) => setCourse5(event.target.value)} />

            <br /><br />

            <label htmlFor='year'>Session</label>
            <select
              id='year'
              value={year}
              onChange={(event) => setYear(event.target.value)}
            >
              <option value='2023'>2023</option>
              <option value='2024'>2024</option>
              <option value='2025'>2025 </option>
              <option value='2026'>2026</option>
              <option value='2027'>2027</option>
            </select>
            <select
              id='term'
              value={term}
              onChange={(event) => setTerm(event.target.value)}
            >
              <option value='First Term'>First Term</option>
              <option value='Second Term'>Second Term</option>
              <option value='Third Term'>Third Term </option>
              <option value='Summer Lesson'>Summer Class </option>
            </select>
            <br /><br />

            <label htmlFor='guardiansPhone'>Guardians Phone Number</label>
            <input
              type='number'
              id='guardiansPhone'
              value={guardiansPhone}
              placeholder='Optional'
              onChange={(event) => setGuardianPhone(event.target.value)}
            />
            <br /><br />


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

export default RegisterStudent;
