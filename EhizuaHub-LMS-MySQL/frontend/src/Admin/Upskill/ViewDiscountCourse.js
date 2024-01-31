import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StaffLogin from '../../Staff/StaffLogin';
import { Link } from 'react-router-dom';
import LoginForm from '../LoginForm';




const ViewDiscountCourses = () => {
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
      async function fetchDiscountCourse() {
          try {
    
            const response = await axios.get('http://localhost:5000/api/auth/discount-courses');
  
            setCourses(response.data.message);
  
          } catch (error) {
            setError('Error retrieving Courses');
          }
        }
  
  
        fetchDiscountCourse();
    }, []);
  
  
  
    return (
      <div>
      {login && admin? (
        <LoginForm/>
      ) : (
         
          <div>   
            <Link to="/create_courses">New Discount Course DON</Link>
            <br/>
            <br/>
          {course.map((result, index) => (
            <div key={index}>
                    <p>Course: {result.course}</p>
                    <p>Description: {result.description}</p>
                    <p>Discount: {result.discountPrice}</p>
                    <p>Percentage: {result.percent}%</p>
                    <Link to={`${result._id}`}>Edit</Link>

            </div>
          ))}
  
          </div>
        )}
        {error}
      </div>
    );
  }
export default ViewDiscountCourses