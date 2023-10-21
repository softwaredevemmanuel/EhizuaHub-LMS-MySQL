import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import CreateTutor from './CreateTutor';




function Dashboard() {
  const [login, setLogin] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState('');
  const [leaveRequest, setLeaveRequest] = useState([]);


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
    async function fetchLeave() {
        try {
            const response = await axios.get('http://localhost:5000/api/tutor/leave-request');
            setLeaveRequest(response.data.leave);
        } catch (error) {
            setError('Error retrieving tutors');
        }
    }

    fetchLeave();
}, []);


const navStyle = {
  background: '#9e9e9e', // Background color
  color: '#fff',      // Text color
  padding: '10px',    // Padding
  textAlign: 'center'  // Text alignment
  // Add more styles as needed
};
  
const zeroApprovalCount = leaveRequest.filter(item => item.isApproved === 0).length;

  return (
    <div className='App'>
      {!login && !admin? (
        <LoginForm/>
      ) : (
       

    <div className='App'>
       <nav style={navStyle}>
        <h5>You have {zeroApprovalCount} new Leave Request <span> <Link to="/pending_leave_request">View Request</Link></span></h5>
   
        </nav>

        <CreateTutor/>  

        <Link to="/tutor_details">View Tutor Details</Link>
            <br/>
            <br/>
            <Link to="/all_student_details">View Student Details</Link>
            <br/>
            <br/>
            <Link to="/create_student">Register A new Student</Link>
            <br/>
            <br/>
            <Link to="/create_school">Register A new School</Link>
            <br/>
            <br/>
            <Link to="/register_school_students">Register School Student</Link>
            <br/>
            <br/>
            <Link to="/all_schools">View Partner Schools</Link>
            <br/>
            <br/>
            <Link to="/create_location">Create Location</Link>
            <br/>
            <br/>
            <Link to="/create_tutor">Create Tutor</Link>
            <br/>
            <br/>
            <Link to="/all_offices">View All Offices</Link>
            <br/>
            <br/>
            <Link to="/all_leave_request">View All Leave Request</Link>
            <br/>
            <br/>
            <Link to="/pending_leave_request">View Pending Leave Request</Link>
            <br/>
            <br/>
            <Link to="/approved_leave_request">View Approved Leave Request</Link>
            <br/>
            <br/>
            <Link to="/rejected_leave_request">View Rejected Leave Request</Link>
            <br/>
            <br/>
            <Link to="/create_instructor">Create New Instructor</Link>
            <br/>
            <br/>
            <Link to="/create_courses">Register a New Upskill Course</Link>
            <br/>
            <br/>
            <Link to="/create_subject">Register a New School Course</Link>
      </div>
      
      )}

    </div>
  );
}

export default Dashboard;
