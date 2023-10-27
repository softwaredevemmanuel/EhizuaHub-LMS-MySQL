import React, { useState, useEffect } from 'react';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import HubTutorSection from '../Tutor/HubTutorSection';
import SchoolTutorSection from '../Tutor/SchoolTutorSection';
import StaffDashboard from './StaffDashboard';
import StaffLogin from './StaffLogin';



function HomeDashboard() {
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [loginData, setLoginData] = useState(false);
  const [error, setError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [staff, setStaff] = useState('');
  const [instructor, setInstructor] = useState('');



  // ..................useEffect for checking localStorage and Verifying Login ..............
  useEffect(() => {
    const storedLoginData = JSON.parse(localStorage.getItem('Stafflogin'));
    if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.staff_authorization) {
      setLoginData(true);
      setStaff(storedLoginData.staff);
      setInstructor(storedLoginData.instructor)


    }
  }, []);

  return (
    <div className='App'>
      {!loginData ? (
        <div>
          <StaffLogin/>
        </div>
      ) : (

        instructor === 'hubInstructor' ? (
          <div>
            <StaffDashboard/>

         <HubTutorSection/>
         </div>
        ) : instructor === 'schoolInstructor' ? (
          <div>
          <StaffDashboard/>
          
          <SchoolTutorSection/>
          </div>
        ) : instructor === 'hub_SchoolInstructor' ? (
          <div>
              <StaffDashboard/>

               <HubTutorSection/>

               <SchoolTutorSection/>
          </div>
        ) : (
          <StaffDashboard/>
        )
      )}
    </div>
  );
}

export default HomeDashboard;
