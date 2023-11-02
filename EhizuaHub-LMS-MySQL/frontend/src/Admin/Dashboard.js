import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';
import { Link } from 'react-router-dom';




function Dashboard() {
  const [login, setLogin] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState('');
  const [leaveRequest, setLeaveRequest] = useState([]);
  const [leaveValue, setLeaveValue] = useState('Leave Section Off');
  const [courseCurriculum, setCourseCurriculum] = useState('Area Office Off');
  const [partnerSchool, setPartnerSchool] = useState('Partner School Off');


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
        const response = await axios.get('http://localhost:5000/api/auth/staff-leave-request');
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

  const handleButtonClick = () => {
    setLeaveValue((prevValue) => (prevValue === 'Leave Section On' ? 'Leave Section Off' : 'Leave Section On'));
  };
  const handleCourseCurriculum = () => {
    setCourseCurriculum((prevValue) => (prevValue === 'Area Office On' ? 'Area Office Off' : 'Area Office On'));
  };

  const handleParnerSchool = () => {
    setPartnerSchool((prevValue) => (prevValue === 'Partner School On' ? 'Partner School Off' : 'Partner School On'));
  };

  return (
    <div className='App'>
      {!login && !admin ? (
        <LoginForm />
      ) : (


        <div className='App'>
          <nav style={navStyle}>
            <h5>You have {zeroApprovalCount} new Leave Request <span> <Link to="/pending_leave_request">View Request</Link></span></h5>

          </nav>
          <br/>

          <input
            type="button"
            value={leaveValue}
            onClick={handleButtonClick}
          />
          {leaveValue === "Leave Section On" && (
            <div>
              <Link to="/all_leave_request">View All Leave Request</Link>
              <br />
              <br />
              <Link to="/pending_leave_request">View Pending Leave Request</Link>
              <br />
              <br />
              <Link to="/approved_leave_request">View Approved Leave Request</Link>
              <br />
              <br />
              
              <Link to="/rejected_leave_request">View Rejected Leave Request</Link>
            </div>
          )}
          <br />
          <br />
          <input
            type="button"
            value={courseCurriculum}
            onClick={handleCourseCurriculum}
          />

          {courseCurriculum === "Area Office On" && (
            <div>
              <Link to="/all_offices">View All Offices DONE</Link>

              <br />

            </div>
          )}
          <br />
          <br />
          <button>
            <Link to="/view-courses/curriculum">Course / Curriculum</Link>

          </button>

          <br />
          <br />
          <button>
            <Link to="/all_staff">All Staff</Link>

          </button>

          <br />
          <Link to="/hub_instructors">View Hub Instructors</Link>
          <br />
          <br />
          <Link to="/school_instructors">View School Instructors</Link>
          <br />

          <br />

          <Link to="/all_student_details">View Student Details</Link>
          <br />
          <br />
          <Link to="/create_student">Register A new Student DONE</Link>

          <br />
          <br />


          <input
            type="button"
            value={partnerSchool}
            onClick={handleParnerSchool}
          />
          {partnerSchool === "Partner School On" && (
            <div>
              <Link to="/all_schools">Partner Schools DONE</Link>
              <br />
              <br />
              <Link to="/all_schools">View Subjects</Link>


            </div>
          )}


        </div>

      )}
{error}
    </div>
  );
}

export default Dashboard;
