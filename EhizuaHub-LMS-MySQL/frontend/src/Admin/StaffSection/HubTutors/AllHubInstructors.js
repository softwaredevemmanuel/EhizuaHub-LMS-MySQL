import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from '../../LoginForm';
import { useParams } from 'react-router-dom';

function AllHubInstructors() {
  const [tutors, setTutors] = useState([]);
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(null);
  const [admin, setAdmin] = useState(null);

  const {office: officeParams} = useParams();


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
        const response = await axios.get('http://localhost:5000/api/auth/hub_instructor/location',{
          headers:{
            office : officeParams
          }
        });
        setTutors(response.data.staff);
      } catch (error) {
        setError('Error retrieving tutors');
      }
    }

    fetchTutors();
  }, [officeParams]);

  return (
    <div>
      {!login? (
          <LoginForm/>
      ) : (

        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Courses</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Office</th>
              <th>School</th>
              <th>Verified</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((tutor, index) => (
              <tr key={index}>
                <td>{tutor.first_name}</td>
                <td>{tutor.last_name}</td>
                <td>{tutor.courses}</td>
                <td>{tutor.email}</td>
                <td>{tutor.phone}</td>
                <td>{tutor.office}</td>
                <td>{tutor.school}</td>
                <td>{tutor.isVerified === 1 ? 'True' : 'False'}</td>
                <td>{ <a href={`/hub-instuctor-details/${tutor._id}`}>
                        <p>View More</p>
                    </a>}
                </td>
                <td>{ <a href={`/update-hub-instructor/${tutor._id}`}>
                        <p>Edit</p>
                    </a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllHubInstructors;
