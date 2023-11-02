import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from '../LoginForm';

function AllStudentDetails() {
  const [students, setStudents] = useState([]);
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
        const response = await axios.get('http://localhost:5000/api/auth/students');
        setStudents(response.data.students);
      } catch (error) {
        error('Error retrieving tutors');
      }
    }

    fetchTutors();
  }, []);

  return (
    <div>
      <h2>Students Details</h2>
      {!login? (
        <LoginForm />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Phone Number</th>
              <th>View more</th>
              
  

            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.firstName} {student.lastName}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>{student.phone}</td>
                <td>{ <a href={`/single_student_details_page/${student._id}`}>
                        <p>More Details</p>
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

export default AllStudentDetails;
