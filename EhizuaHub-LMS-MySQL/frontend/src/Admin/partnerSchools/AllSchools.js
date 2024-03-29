import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from '../LoginForm';
import { Link } from 'react-router-dom';


function AllSchools() {
  const [schools, setSchools] = useState([]);
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
    async function fetchTutors() {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/partner-schools');
        setSchools(response.data.message);
      } catch (error) {
        setError('Error retrieving Partner schools');
      }
    }

    fetchTutors();
  }, []);

  return (
    <div>
      {login? (
          <LoginForm/>
      ) : (
        <div>
             <Link to="/create_school">Register A new School DONE</Link>
             <br/>
             <br/>
             <Link to="/register_school_students">Register A Student DONE</Link>
             <br/>
             <br/>
             <Link to="/create_subject">Register a New Course DONE</Link>


            <table>
              <thead>
                <tr>
                  <th>School Name</th>
                  <th>School Address</th>
                  <th>Details</th>
                
                </tr>
              </thead>
              <tbody>
                {schools.map((school, index) => (
                  <tr key={index}>
                    <td>{school.schoolName}</td>
                    <td>{school.schoolAddress}</td>
                    <td>
                        <a href={`/school_details/${school.schoolName}`}>
                            <p>View More</p>
                        </a>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      )}
        
        {error && <p style={{ color: 'red' }}>{error}</p>}

    </div>
  );
}

export default AllSchools;
