import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';
import { useParams } from 'react-router-dom';

function UpdateStudent() {
  const [login, setLogin] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('FullStack');
  const [phone, setPhone] = useState('');
  const [guardiansPhone, setGuardianPhone] = useState('');
  const [duration, setDuration] = useState('1 Month');
  const [courseFee, setCourseFee] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState([]);

  // Get the content parameter from the URL using useParams
  const { _id: contentParam } = useParams();
  const contentItem = content.find((item) => item._id == contentParam);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/students');
        setContent(response.data.students);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem('Adminlogin'));

    if (loginData && loginData.login && loginData.admin && loginData.admin_authorization) {
      setLogin(true);
      setAdmin(true);
    }
  }, []);

  // Set initial state values from contentItem after it's loaded
  useEffect(() => {
    if (contentItem) {
        setId(contentItem._id)
      setFirstName(contentItem.firstName || '');
      setLastName(contentItem.lastName || '');
      setEmail(contentItem.email || '');
      setCourse(contentItem.course || 'FullStack');
      setPhone(contentItem.phone || '');
      setGuardianPhone(contentItem.guardiansPhone || '');
      setDuration(contentItem.duration || '1 Month');
      setCourseFee(contentItem.courseFee || '');
      setAmountPaid(contentItem.amountPaid || '');
      setHomeAddress(contentItem.homeAddress || '');
    }
  }, [contentItem]);

  const updateStudent = () => {
    setLoading(true);
    axios
      .put(`http://localhost:5000/api/auth/update-student/${id}`, {
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
      })
      .catch((error) => {
        setError(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateStudent();
  };

  return (
    <div className='App'>
      {!login && !admin ? (
        <LoginForm />
      ) : (
        <div className='App'>
          <h1>Update Student</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor='firstName'>First Name</label>
            <input
              type='text'
              id='firstName'
              placeholder='First Name'
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <br /><br />

            <label htmlFor='lastName'>Last Name</label>
            <input
              type='text'
              id='lastName'
              placeholder='Last Name'
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
            <br /><br />

            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              placeholder='Email'
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
              placeholder='Phone Number'
              autoComplete='new-password'
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <br /><br />
            <label htmlFor='guardiansPhone'>Guardians Phone Number</label>
            <input
              type='number'
              id='guardiansPhone'
              placeholder='Guardians Phone Number'
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
              placeholder='Course Fee'
              value={courseFee}
              onChange={(event) => setCourseFee(event.target.value)}
            />
            <br /><br />
            <label htmlFor='amountPaid'>Amount Paid</label>
            <input
              type='number'
              id='amountPaid'
              placeholder='Amount Paid'
              value={amountPaid}
              onChange={(event) => setAmountPaid(event.target.value)}
            />
            <br /><br />
            <label>Home Address</label>
            <textarea
              placeholder='Home Address'
              value={homeAddress}
              onChange={(event) => setHomeAddress(event.target.value)}
            />
            <br />

            <button type='submit'>Update</button>
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

export default UpdateStudent;

