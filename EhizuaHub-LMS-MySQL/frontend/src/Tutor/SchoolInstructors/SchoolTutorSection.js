import React, { useState, useEffect } from 'react';
import {Link } from 'react-router-dom';




function SchoolTutorSection() {
  const [course, setCourse] = useState('');
  const [email, setEmail] = useState('');


  useEffect(() => {
    const storedLoginData = JSON.parse(localStorage.getItem('Stafflogin'));
    if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.staff_authorization) {
      setCourse(storedLoginData.schoolCourse)
      setEmail(storedLoginData.email)

    }
  }, []);

  const schoolCoursesArray = course ? course.split(', ') : [];

  //............... Login API function that will also store login info in local storage...................


  return (
    <div className='App'>
          <div>
            <div>
              <h1>School Section</h1>
              {schoolCoursesArray.map((course, index) => (
              <div key={index} value={course}>
                <h4>{course}</h4>
                <div>
                  <br />
                  <Link to={`/create_school_course_curriculum/${course}`}>Create Curriculum</Link>
                  <br />
                  <br />
                  <Link to="/staff_student_details">View Student Details</Link>
                  <br />
                  <br />
                  <Link to={`/create_school_course_content/${course}`}>Create Content</Link>
                  <br />
                  <br />
                  <Link to={`/view_school_course_list/${course}`}>View Created Content</Link>
                  <br />
                  <br />
                  <Link to={`/view_school_course_curriculum/${course}`}>View Curriculum</Link>
                  <br />
                  <br />
                  <Link to={`/select-school-of-student/${email}/${course}`}>View Students</Link>
                  <br/>
                  <br/>
                  <Link to={`/create_subject_question/${course}`}>Create Question</Link>
                  <br />
                  <br />
                  
                </div>
              </div>
            ))}
            </div>
          </div>

    </div>
  );
}

export default SchoolTutorSection;
