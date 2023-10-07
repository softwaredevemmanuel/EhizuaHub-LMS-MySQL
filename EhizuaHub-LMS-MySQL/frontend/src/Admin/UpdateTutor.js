import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import { useParams } from 'react-router-dom';





function UpdateTutor() {
  const [login, setLogin] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('FullStack');
  const [phone, setPhone] = useState('');
  const [id, setId] = useState('');
  const [tutor, setTutors] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading indicator


   // Get the content parameter from the URL using useParams
   const { _id: contentParam } = useParams();
   const contentItem = tutor.find((item) => item._id == contentParam);

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
    async function fetchTutors() {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/tutors'); // Make sure the URL matches your API endpoint
        setTutors(response.data.tutors);
      } catch (error) {
        setError('Error retrieving tutors');
      }
    }

    fetchTutors();
  }, []);

  useEffect(() => {
    if (contentItem) {
        setId(contentItem._id)
        setFirstName(contentItem.first_name || '');
        setLastName(contentItem.last_name || '');
        setEmail(contentItem.email || '');
        setCourse(contentItem.course || 'FullStack');
        setPhone(contentItem.phone || '');
    }
  }, [contentItem]);


  const updateStudent = () => {
    setLoading(true);
    axios
      .put(`http://localhost:5000/api/auth/update-tutor/${id}`, {
        firstName,
        lastName,
        email,
        course,
        phone,
    
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

  const handleSubmit = event => {
    event.preventDefault();
    updateStudent();
  };


  return (
    <div className='App'>
      {!login && !admin? (
        <LoginForm/>
      ) : (
       

    <div className='App'>
      <h1>Update Tutor</h1>
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

        <button type='submit'>Update</button>
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

export default UpdateTutor;
