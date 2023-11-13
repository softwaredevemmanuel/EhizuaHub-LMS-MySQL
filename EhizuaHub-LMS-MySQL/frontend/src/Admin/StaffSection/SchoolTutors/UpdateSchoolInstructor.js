import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [schools, setSchools] = useState('');
  const [phone, setPhone] = useState('');
  const [id, setId] = useState('');
  const [isVerified, setIsVerified] = useState('');
  const [staff, setStaff] = useState([]);
  const [all, setAll] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading indicator
  const [state, setState] = useState(false);


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
    async function fetchSchools() {

      try {

        const response = await axios.get('http://localhost:5000/api/auth/partner-schools', {

        });
        setAll(response.data.message)

      } catch (error) {
        setError('Error fetching schools data');
      }
    }

    fetchSchools();

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
      setSchools(contentItem.school || '');
      setPhone(contentItem.phone || '');
      setIsVerified(contentItem.isVerified || '0');
    }
  }, [contentItem]);



  const updateStudent = () => {
    setLoading(true);
    if (state) {
      axios
        .put(`http://localhost:5000/api/auth/update-school-instructor/${id}`, {
          firstName,
          lastName,
          email,
          office,
          courses,
          selectedSchools: [],
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

    } else if (schools == '') {
      axios
        .put(`http://localhost:5000/api/auth/update-school-instructor/${id}`, {
          firstName,
          lastName,
          email,
          office,
          courses,
          selectedSchools: selectedSchools,
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
    } else if (schools != '') {
      axios
        .put(`http://localhost:5000/api/auth/update-school-instructor/${id}`, {
          firstName,
          lastName,
          email,
          office,
          courses,
          selectedSchools: newUpdateSchool,
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
    }

  };

  const handleSubmit = event => {
    event.preventDefault();
    updateStudent();
  };

  const schoolArray = schools.split(', ')
  const [selectedSchools, setSelectedSchools] = useState([]);


  const handleSchoolCheckboxChange = (school) => {
    if (selectedSchools.includes(school)) {
      setSelectedSchools(selectedSchools.filter((selectedSchools) => selectedSchools !== school));

    } else {
      setSelectedSchools([...selectedSchools, school]);
    }
  };


  const newUpdateSchool = [...schoolArray, ...selectedSchools.filter(item => !schoolArray.includes(item))];
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxClick = () => {
    const shouldReset = !isChecked ? window.confirm(`Are you sure you want to reset School Assigned to ${firstName} ${lastName}?`) : true;

    if (shouldReset) {
      if (!isChecked) {
        setState(true)
      }else{
        setState(false)

      }
      setIsChecked(!isChecked); // Toggle the checked state
    }
  };


  return (
    <div className='App'>
      {!login && !admin ? (
        <LoginForm />
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




            <label htmlFor='phone'>Phone Number</label>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <br /><br />
           

            <h3>Assign a School</h3> 
            {schools &&(
              <div>
              <label>
                <input
                  type="checkbox"
                  onChange={handleCheckboxClick}
                  checked={isChecked}
                  value='Reset Schools Selected'
                />
                RESET SCHOOL ASSIGNED TO {firstName.toUpperCase()} {lastName.toUpperCase()}
              </label>

            </div>
            )}
            

            <p>{schools ? schools : `No School Assigned ${firstName} ${lastName}`}</p>
            



            {all.map((school, index) => (
              <div key={index}>

                <input
                  type='checkbox'
                  id={`hubCourse-${index}`}
                  checked={selectedSchools.includes(school.schoolName)}
                  onChange={() => handleSchoolCheckboxChange(school.schoolName)}
                  value={school.schoolName}
                />
                <label htmlFor={`course-${index}`}>{school.schoolName}</label>


              </div>
            ))}





            <label htmlFor='phone'>Suspend Staff</label>
            <select
              id='isVerified'
              value={isVerified}
              onChange={(event) => setIsVerified(event.target.value)}
            >
              <option value={0}>NO</option>
              <option value={1}>YES</option>

            </select>
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

export default UpdateSchoolInstructor;
