import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';

function AllTutorDetails() {
  const [tutors, setTutors] = useState([]);
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(null);
  const [admin, setAdmin] = useState(null);


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
              <th>Email</th>
              <th>Phone</th>
              <th>Verified</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((tutor, index) => (
              <tr key={index}>
                <td>{tutor.first_name}</td>
                <td>{tutor.last_name}</td>
                <td>{tutor.email}</td>
                <td>{tutor.phone}</td>
                <td>{tutor.isVerified === 1 ? 'True' : 'False'}</td>
                <td>{ <a href={`/update_tutor/${tutor._id}`}>
                        <p>Edit{tutor._id}</p>
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

export default AllTutorDetails;
