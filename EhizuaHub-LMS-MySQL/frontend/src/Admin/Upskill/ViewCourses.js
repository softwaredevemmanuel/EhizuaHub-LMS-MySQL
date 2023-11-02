import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StaffLogin from '../../Staff/StaffLogin';
import { Link } from 'react-router-dom';
import LoginForm from '../LoginForm';




const ViewCourses = () => {
    const [error, setError] = useState(null);
    const [course, setCourses] = useState([]);
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
      async function fetchCourse() {
          try {
    
            const response = await axios.get('http://localhost:5000/api/auth/all_upskill_courses');
  
            setCourses(response.data.message);
  
          } catch (error) {
            setError('Error retrieving Courses');
          }
        }
  
  
        fetchCourse();
    }, []);
  
  
  
    return (
      <div>
      {!login && !admin? (
        <LoginForm/>
      ) : (
         
          <div>   
            <Link to="/create_courses">Register a New Course DONE</Link>
            <br/>
            <br/>
          {course.map((result, index) => (
            <div key={index}>
                <a href={`/view-courses/curriculum/${result.course}`}>
                    <p>{result.course}</p>
                  </a>
              
            </div>
          ))}
  
          </div>
        )}
        {error}
      </div>
    );
  }
export default ViewCourses