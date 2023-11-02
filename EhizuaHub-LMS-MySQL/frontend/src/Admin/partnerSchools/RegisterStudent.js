import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from '../LoginForm';

function RegisterStudent() {
  const [login, setLogin] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guardiansPhone, setGuardianPhone] = useState('');
  const [year, setYear] = useState('2023');
  const [term, setTerm] = useState('');
  const [level, setLevel] = useState('Primary 1');
  const [schools, setSchools] = useState([]);
  const [arrayCourses, setArrayCourses] = useState([]);
  const [selectSchool, setSelectSchool] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [checkedCourses, setCheckedCourses] = useState([]);
  const [formattedDate, setFormattedDate] = useState('');


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
 

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem('Adminlogin'));
    const currentDate = new Date();
    const options = {year: 'numeric' };
    const formattedString = currentDate.toLocaleDateString('en-US', options).replace(/\//g, '');
    setFormattedDate(formattedString);

    if (loginData && loginData.login && loginData.admin && loginData.admin_authorization) {
      setLogin(true);
      setAdmin(true);

    }
  }, []);
  console.log(formattedDate)


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

  useEffect(() => {
    async function fetchCourses() {
      try {
        // Check if selectSchool is available before making the API call
        if (selectSchool) {
          const response = await axios.get('http://localhost:5000/api/auth/partner-schools-course', {
            headers: {
              school: selectSchool,
            },
          });
          setArrayCourses(response.data.courses);
        }
      } catch (error) {
        setError('Error fetching course data');
      }
    }
  
    fetchCourses();
  }, [selectSchool]);

  
  


  const createStudent = () => {
    if (selectSchool && firstName && lastName && checkedCourses && level && year && term) {
      setLoading(true);

      axios
        .post('http://localhost:5000/api/auth/register-school-student', {
          selectSchool,
          firstName,
          lastName,
          level,
          checkedCourses,
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

            <h4>Select Courses Requested</h4>

              <div>
                  {arrayCourses.map((course, index) => (
                      <div key={index}>
                      <label>
                          {course}
                          <input
                          type="checkbox"
                          value={course}
                          checked={checkedCourses.includes(course)}
                          onChange={handleCheckboxChange}
                          />
                      </label>
                      </div>
                  ))}
                  <p>Checked Courses: {checkedCourses.join(', ')}</p>
              </div>

  

            

            <label htmlFor='year'>Session</label>
            <select
              id='year'
              value={year}
              onChange={(event) => setYear(event.target.value)}
            >
              <option value={formattedDate}>{formattedDate}</option>
            </select>
            <select
              id='term'
              value={term}
              onChange={(event) => setTerm(event.target.value)}
            >
              <option value=''>Select Term</option>
              <option value='1230'>First Term</option>
              <option value='0415'>Second Term</option>
              <option value='0831'>Third Term </option>
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

        </div>
      )}
    </div>
  );
}

export default RegisterStudent;
