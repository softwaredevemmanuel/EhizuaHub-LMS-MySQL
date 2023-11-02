import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import LoginForm from '../../LoginForm';
import { useParams } from 'react-router-dom';





function UpdateSchoolInstructor() {
  const [login, setLogin] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [office, setOffice] = useState('');
  const [courses, setCourse] = useState('');
  const [hubInstructor, setHubInstructor] = useState('');
  const [schoolInstructor, setSchoolInstructor] = useState('');
  const [phone, setPhone] = useState('');
  const [id, setId] = useState('');
  const [isVerified, setIsVerified] = useState('');
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading indicator


   // Get the content parameter from the URL using useParams
   const { _id: contentParam } = useParams();
   const contentItem = staff.find((item) => item._id == contentParam);

  useEffect(() => {
    let login = JSON.parse(localStorage.getItem('Adminlogin'));
    let admin = login
  

    if ((login && admin.login && admin.admin && admin.admin_authorization)) {
      setLogin(true);
      setAdmin(true);
    }  
  }, []);

    // Fetch Courses
    useEffect(() => {
      async function fetchCourses() {
          try {
              const response = await axios.get('http://localhost:5000/api/auth/all_upskill_courses');
              // setAllCourse(response.data.message);
          } catch (error) {
              setError('Error retrieving Courses');
          }
      }

      fetchCourses();
  }, []);


  useEffect(() => {
    // Fetch Staff when the component mounts
    async function fetchStaff() {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/school_instructor');
        setStaff(response.data.staff);
      } catch (error) {
        setError('Error retrieving staff');
      }
    }

    fetchStaff();
  }, []);

  useEffect(() => {
    if (contentItem) {
        setId(contentItem._id)
        setFirstName(contentItem.first_name || '');
        setLastName(contentItem.last_name || '');
        setLastName(contentItem.last_name || '');
        setEmail(contentItem.email || '');
        setOffice(contentItem.office || '');
        setCourse(contentItem.courses || '');
        setHubInstructor(contentItem.hubInstructor || '');
        setSchoolInstructor(contentItem.schoolInstructor || '');
        setPhone(contentItem.phone || '');
        setIsVerified(contentItem.isVerified || '0');
    }
  }, [contentItem]);


  const updateStudent = () => {
    setLoading(true);
    axios
      .put(`http://localhost:5000/api/auth/update-staff/${id}`, {
        firstName, 
        lastName, 
        email,  
        office, 
        courses, 
        hubInstructor, 
        schoolInstructor, 
        phone, 
        isVerified

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
      <h1>Update School Instructor</h1>
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

        <label>Email</label>
        <input
          type='email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <br /><br />

      

        <label htmlFor='phone'>Office</label>
        <input
          autoComplete='new-password'
          value={office}
          onChange={(event) => setOffice(event.target.value)}
        />
        <br /><br />

        <label htmlFor='phone'>Courses</label>
        <input
          autoComplete='new-password'
          value={courses}
          onChange={(event) => setCourse(event.target.value)}
        />
        <br /><br />

        <label htmlFor='phone'>Hub Tutor</label>
          <select
              value={hubInstructor}
              onChange={(event) => setHubInstructor(event.target.value)}
          >
              <option value={0}>NO</option>
              <option value={1}>YES</option>
            
          </select>
          <br /><br/>

        <label htmlFor='phone'>School Tutor</label>
          <select
              value={schoolInstructor}
              onChange={(event) => setSchoolInstructor(event.target.value)}
          >
              <option value={0}>NO</option>
              <option value={1}>YES</option>
            
          </select>
          <br /><br/>


        <label htmlFor='phone'>Phone Number</label>
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
        <br /><br />

 

        <label htmlFor='phone'>Suspend Staff</label>
          <select
              id='isVerified'
              value={isVerified}
              onChange={(event) => setIsVerified(event.target.value)}
          >
              <option value={0}>NO</option>
              <option value={1}>YES</option>
            
          </select>
          <br /><br/>

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

export default UpdateSchoolInstructor;
