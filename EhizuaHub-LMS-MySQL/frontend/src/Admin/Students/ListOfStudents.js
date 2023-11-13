import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link, useParams } from 'react-router-dom';
import LoginForm from '../LoginForm';
import profile from '../../assets/profile.png'




const ListOfStudents = () => {
  const [content, setContent] = useState([]);
  const [login, setLogin] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [allStudent, setAllStudent] = useState([]);
  const [coursesArray, setCoursesArray] = useState([]);
  const [course, setCourse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);


    // Get the content parameter from the URL using useParams
  const { location: contentParam } = useParams();

  useEffect(() => {
    let login = JSON.parse(localStorage.getItem('Adminlogin'));
    let admin = login


    if ((login && admin.login && admin.admin && admin.admin_authorization)) {
      setLogin(true);
      setAdmin(true);
    }
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/all_upskill_courses');

        setCoursesArray(response.data.message);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    fetchCourses();

  }, []);


  useEffect(() => {
    async function fetchAllStudents() {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/sort-students/location',{
            headers:{
                location: contentParam,
            }
        });

        setAllStudent(response.data.students);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    fetchAllStudents();

  }, []);



  useEffect(() => {
    async function fetchStudents() {
      try {
        if(course){
          const response = await axios.get('http://localhost:5000/api/auth/sort-students/location-course',{
            headers:{
                location: contentParam,
                course : course
            }
        });

        setAllStudent(response.data.students);
        setLoading(false);
        }
       
      } catch (error) {
        setLoading(false);
      }
    }

    fetchStudents();

  }, [course]);


  return (
    <div>
      <h4>Student Details </h4>
      {loading && <p>Loading...</p>}
      <button>
    
    <Link to={`/create_student/${contentParam}`}>Register A new Student DONE</Link>

    </button>
    <br/>
    <br/>
    <br/>
    <br/>

      <select 
        value={course}
        onChange={(event) => setCourse(event.target.value)}

        >
        <option> Sort by Course </option>

        {coursesArray.map((courses, index)=>(
             <option key={index}> {courses.course} </option>
        ))}
       
      </select>

   
          
   
          {allStudent.map((student, index) => (
            <div key={index}>
                <a href={`/single_student_details_page/${student.course}/${student.email}`}>
                <div>
                    <img src={profile}/>

                    <p>{student.firstName}</p>
                    <p>{student.lastName}</p>
                    <p>{student.phone}</p>
                    <p>{student.email}</p>
                    <hr/>
                </div>
                </a>
            </div>
          ))}



    </div>
  )
}

export default ListOfStudents
