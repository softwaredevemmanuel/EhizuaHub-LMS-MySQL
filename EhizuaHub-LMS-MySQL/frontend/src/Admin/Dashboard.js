import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';
import { Link } from 'react-router-dom';
import './Index.css'




function Dashboard() {
  const [login, setLogin] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState('');
  const [leaveRequest, setLeaveRequest] = useState([]);
  const [leaveValue, setLeaveValue] = useState('Leave Section Off');
  const [courseCurriculum, setCourseCurriculum] = useState('Area Office Off');
  const [partnerSchool, setPartnerSchool] = useState('Partner School Off');
  const [courseDiscount, setCourseDiscount] = useState('Course Discount Off');


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

  const handleCourseDiscount = () => {
    setCourseDiscount((prevValue) => (prevValue === 'Course Discount On' ? 'Course Discount Off' : 'Course Discount On'));
  };


  return (
    <div className=''>

        <div className='row'>
          <div className='col-md-3 box'>
          <nav>
            <h5>You have {zeroApprovalCount} new Leave Request <span> <Link to="/pending_leave_request">View Request</Link></span></h5>

          </nav>
          <br/>

          <input
            type="button"
            value={leaveValue}
            onClick={handleButtonClick}
          />
         

          {leaveValue === "Leave Section On" && (
            <div className=''>
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
            <Link to="/all_staff">All Staff / Create Staff</Link>

          </button>

          <br />
          <br />
          <button>
            <Link to="/students-center">Students Section</Link>
          </button>
          <br/>
          <br/>

          <input
            type="button"
            value={partnerSchool}
            onClick={handleParnerSchool}
          />
          {partnerSchool === "Partner School On" && (
            <div>
              <Link to="/all_schools">Partner Schools DONE</Link>
           
            </div>
          )}
          <br/>
          <br/>
          <input
            type="button"
            value={courseDiscount}
            onClick={handleCourseDiscount}
          />
          {courseDiscount === "Course Discount On" && (
            <div>
              <Link to="/create_course_discount">Create Course Discount</Link>
              <br/>
              <br/>
              <Link to="/view_course_discount">View Course Discount</Link>
           
            </div>
          )}
          <br/>
          <br/>

            
        </div>


        <div className='col-9'>
          <div className='box'>
          </div>
        </div>
        </div>

    
{error}
    </div>
  );
}

export default Dashboard;
