import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from '../LoginForm';
import { Link } from 'react-router-dom';

function AllStaffList() {
  const [staff, setStaff] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [location, setLocation] = useState('');
  const [offices, setOffices] = useState([]);
  const [position, setPosition] = useState('');



  useEffect(() => {
    let login = JSON.parse(localStorage.getItem('Adminlogin'));
    let admin = login


    if ((login && admin.login && admin.admin && admin.admin_authorization)) {
      setLogin(true);
      setAdmin(true);
    }
  }, []);

  useEffect(() => {
    // Fetch All Staff array
    async function fetchStaff() {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/staff'); // Make sure the URL matches your API endpoint
        setAllStaff(response.data.staff);

      } catch (error) {
        setError('Error retrieving All Staff');
      }
    }

    fetchStaff();
  }, []);


  useEffect(() => {
    // Fetch Staff based on location
    async function fetchStaff() {
      try {
        if (location === '') {
          const response = await axios.get('http://localhost:5000/api/auth/staff'); // Make sure the URL matches your API endpoint
          setStaff(response.data.staff);
        } else {
          const staffItem = allStaff.filter((items) => items.office === location);
          setStaff(staffItem);

        }
      } catch (error) {
        setError('Error retrieving tutors');
      }
    }

    fetchStaff();
  }, [location, allStaff]);

  useEffect(() => {
    // Fetch all Loactions
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

  useEffect(() => {
    // Fetch Staff based on Position
    async function fetchPosition() {
      try {
        if (position === '') {

        } else {
          const staffItem = allStaff.filter((items) => items.position === position);
          setStaff(staffItem);

        }
      } catch (error) {
        setError('Error retrieving tutors');
      }
    }

    fetchPosition();
  }, [position, allStaff]);





  return (
    <div>
      {login && admin ? (
        <LoginForm />
      ) : (

        <div>
          <Link to="/create_staff">Create Staff DONE</Link>
          <br />
          <br />
          {location ? (
            <div>
              <button>
              <Link to={`/hub_instructors/${location}`}>View Hub Instructors</Link>

              </button>
              <br />
              <br />
              <button>
              <Link to={`/school_instructors/${location}`}>View School Instructors</Link>

              </button>
              <br />
              <br />
            </div>
          ) : (
            <div>
              <button disabled>
                View Hub Instructors
              </button>
              <br />
              <br />
              <button disabled>
                View School Instructors

              </button>
              <br />
              <br />
            </div>

          )}

          <input value='Sort By' readOnly />


          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          >
            <option value=''>All Location</option>
            {offices.map((office, index) => (
              <option key={index} value={`${office.officeName}`}>
                {office.officeName}
              </option>
            ))}
          </select>

          <select
            value={position}
            onChange={(event) => setPosition(event.target.value)}
          >
            <option value=''>Position</option>
            {staff.map((position, index) => (
              <option key={index} value={`${position.position}`}>
                {position.position}
              </option>
            ))}
          </select>

      



          <br />
          <br />
          <br />
          <div className='table-responsive'>

          <table className='table table-striped'>
            <thead className='table-active'>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Verified</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className='table-group-divider'>
              {staff.map((tutor, index) => (
                <tr key={index}>
                  <td>{tutor.first_name}</td>
                  <td>{tutor.last_name}</td>
                  <td>{tutor.email}</td>
                  <td>{tutor.phone}</td>
                  <td>{tutor.isVerified === 1 ? 'True' : 'False'}</td>
                  <td>{<a href={`/view_staff_details/${tutor._id}`}>
                    <p>View More</p>
                  </a>}
                  </td>
                  <td>{<a href={`/update_staff/${tutor._id}`}>
                    <p>Edit</p>
                  </a>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
      {error}
    </div>
  );
}

export default AllStaffList;
