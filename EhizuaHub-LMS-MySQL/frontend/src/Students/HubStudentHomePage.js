import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';



const HubStudentHomePage = () => {
  const [courses, setCourses] = useState('');
  const [courseDiscount, setCourseDiscount] = useState([]);
  const [email, setEmail] = useState('');

  
  useEffect(() => {
    let login = JSON.parse(localStorage.getItem('Studentlogin'));
    let Studentlogin = login
    if (Studentlogin && Studentlogin.login && Studentlogin.token && Studentlogin.authHeader) {
      setCourses(Studentlogin.course)
      setEmail(Studentlogin.email)
    }
  }, []);

  const coursesArray = courses.split(', ')

  useEffect(() => {
    async function fetchCourseDiscount() {
      try {
        let login = JSON.parse(localStorage.getItem('Studentlogin'));

        const response = await axios.get('http://localhost:5000/api/students/course-advert',{
          headers:{
            location : login.location
          }
        });
        setCourseDiscount(response.data.content);
      
      } catch (error) {

      }
    }

    fetchCourseDiscount();

  }, []);

  return (
    <div>
      <h4> Course Discount Carousel </h4>
      {courseDiscount.map((discount, index)=>(
        <div key={index}>
          <p>Course: {discount.course}</p>
          <p>Description: {discount.description}</p>
          <p>Discount: {discount.discountPrice}</p>
          <p>Percentage: {discount.percent}%</p>
          <Link to={`/register-discount-course/${email}/${discount._id}`}>Register</Link>
        </div>
      ))}
      <h3>Student Dashboard</h3>


      {coursesArray.map((courses, index)=>(
        <Link to = {`${courses}`} key={index}><p>{courses}</p></Link>
      ))}

    </div>
  )
}

export default HubStudentHomePage