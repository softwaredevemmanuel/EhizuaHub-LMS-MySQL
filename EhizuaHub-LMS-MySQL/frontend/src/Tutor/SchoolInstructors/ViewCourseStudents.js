import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StaffLogin from '../../Staff/StaffLogin';
import { useParams } from 'react-router-dom';


function ViewCourseStudent() {
  const [loginData, setLoginData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [content, setContent] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectClass, setSelectClass] = useState('');
  const [studentArray, setStudentArray] = useState([]);
  const [studentArray2, setStudentArray2] = useState([]);
  const [courseCodeString, setCourseCodeString] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const { email: emailParam } = useParams();
  const { course: courseParam } = useParams();




  // ..................useEffect for checking localStorage and Verifying Login ..............
  useEffect(() => {
    const storedLoginData = JSON.parse(localStorage.getItem('Stafflogin'));
    if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.staff_authorization) {
      setLoginData(true);
    }
  }, []);

  useEffect(() => {
    async function fetchClassList() {
      try {
        const response = await axios.get('http://localhost:5000/api/tutor/fetch-school-classes', {
          headers: {
            school: selectedSchool,
            course: courseParam
          },
        });
        setStudentArray(response.data.student);

      } catch (error) {
        setError('Error retrieving content');
      }
    }


    fetchClassList();
  }, [selectedSchool, courseParam]);


//  Use Effect to get list of students based of class selected
  useEffect(() => {
    async function fetchClassStudent() {
      try {
        const response = await axios.get('http://localhost:5000/api/tutor/fetch-students-by-classes', {
          headers: {
            studentClass: selectClass,
            school: selectedSchool,
            course: courseParam
          },
        });
        setStudentArray2(response.data.student);

      } catch (error) {
        setError('Error retrieving content');
      }
    }


    fetchClassStudent();
  }, [selectClass, selectedSchool, courseParam]);



  useEffect(() => {
    async function fetchSchools() {
      try {

        const response = await axios.get('http://localhost:5000/api/tutor/assigned-school', {
          headers: {
            email: emailParam
          },
        });

        setContent(response.data.schools);

      } catch (error) {
        setError('Error retrieving content');
      }
    }


    fetchSchools();
  }, [emailParam]);


// Fetch Course Code to Assign to students
  useEffect(() => {
    async function fetchCourseCode() {
      try {

        const response = await axios.get('http://localhost:5000/api/tutor/fetch-course_code', {
          headers: {
            course: courseParam
          },
        });

        setCourseCodeString(response.data.courseCodeString);

      } catch (error) {
        setError('Error retrieving content');
      }
    }


    fetchCourseCode();
  }, [courseParam]);



  const schoolArray = content.split(', ')
  const uniqueStudentArray = [...new Set(studentArray.map(item => item.level))];
  const courseCodeArray = courseCodeString.split(', ')

const handleAssignCourseCode =(event)=>{
  event.preventDefault();

  const studentIds = studentArray2.map(student => student.id);

  axios.get("http://localhost:5000/api/tutor/update-course-code", {
    headers:{
      studentIds,
      courseCode,
      selectedSchool
    }
  })
  .then(response => {
  setSuccess(response.data.studentIdArray);
  })
}  



  return (
    <div>
      {!loginData ? (
        <div>
          <StaffLogin />
        </div>
      ) : (

        <div>
          <h2>SELECT A SCHOOL TO VIEW YOUR STUDENT</h2>
          <select
            value={selectedSchool}
            onChange={(event) => setSelectedSchool(event.target.value)}>
              
            <option> select a school</option>
            {schoolArray.map((contents, mainIndex) => (
              <option key={mainIndex} value={contents}>
                  {contents}
              </option>
            ))}
          </select>

          <select
            value={selectClass}
            onChange={(event) => setSelectClass(event.target.value)}>
              
            <option> select a class</option>
            {uniqueStudentArray.map((contents, mainIndex) => (
              <option key={mainIndex} value={contents}>
                  {contents}
              </option>
            ))}
          </select>
          <br/>
          <br/>

          <form onSubmit={handleAssignCourseCode}>
              <select
                value={courseCode}
                onChange={(event) => setCourseCode(event.target.value)}>
                  
                <option>Assign Course Code to Students</option>
                {courseCodeArray.map((content, mainIndex) => (
                  <option key={mainIndex} value={content}>
                      {content}
                  </option>
                ))}
              </select>
              <button>Assign Course Code</button>
          </form>
          <br/>
      

          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Level</th>
                <th>Course Enrolled For</th>
                <th>Year</th>
                <th>Term</th>
                <th>Course Code</th>
              </tr>
            </thead>
              {studentArray2.length > 0?(
                   <tbody>
                   {studentArray2.map((tutor, index) => (
                     <tr key={index}>
                       <td>{tutor.firstName}</td>
                       <td>{tutor.lastName}</td>
                       <td>{tutor.level}</td>
                       <td>{tutor.courses}</td>
                       <td>{tutor.year}</td>
                       <td>{ tutor.term}</td>
                       <td>{ tutor.courseCode}</td>
                     </tr>
                   ))}
                 </tbody>
              ):(
                <tbody>

              {studentArray.map((tutor, index) => (
                <tr key={index}>
                  <td>{tutor.firstName}</td>
                  <td>{tutor.lastName}</td>
                  <td>{tutor.level}</td>
                  <td>{tutor.courses}</td>
                  <td>{tutor.year}</td>
                  <td>{ tutor.term}</td>
                  <td>{ tutor.courseCode}</td>
                </tr>
              ))}
            </tbody>

              )}
         
         
          </table>
          <table>
  
        
          </table>

          {success && <p style={{ color: 'green' }}>{success}</p>}


        </div>
      )}
    </div>
  );
}

export default ViewCourseStudent;

