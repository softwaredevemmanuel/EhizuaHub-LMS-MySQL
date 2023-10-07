import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';


function AllOfices() {
  const [offices, setOffices] = useState([]);
  const [error, setError] = useState('');
  const [login, setLogin] = useState(null);


  useEffect(() => {
    let admin = JSON.parse(localStorage.getItem('Adminlogin'));

    if ((admin && admin.login && admin.admin && admin.admin_authorization)) {
      setLogin(true);
    }  
  }, []);


  useEffect(() => {
    // Fetch tutors when the component mounts
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

  return (
    <div>
      {!login? (
          <LoginForm/>
      ) : (

        <table>
          <thead>
            <tr>
              <th>Office Name</th>
              <th>State</th>
              <th>Office Address</th>
              <th>Details</th>
             
            </tr>
          </thead>
          <tbody>
            {offices.map((office, index) => (
              <tr key={index}>
                <td>{office.officeName}</td>
                <td>{office.state}</td>
                <td>{office.officeAddress}</td>
                <td>
                    <a href={`/offices_details/${office.id}`}>
                        <p>View More</p>
                    </a>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
        
        {error && <p style={{ color: 'red' }}>{error}</p>}

    </div>
  );
}

export default AllOfices;
