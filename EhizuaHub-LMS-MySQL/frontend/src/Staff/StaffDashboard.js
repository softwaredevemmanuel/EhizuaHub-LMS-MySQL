import React, { useState, useEffect } from 'react';
import LeaveDashboard from './LeaveDashboard';
import { Link } from 'react-router-dom';


function StaffDashboard() {
  const [staff, setStaff] = useState('');
  const [email, setEmail] = useState('');



  // ..................useEffect for checking localStorage and Verifying Login ..............
  useEffect(() => {
    const storedLoginData = JSON.parse(localStorage.getItem('Stafflogin'));
    if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.staff_authorization) {
      
        setStaff(storedLoginData.staff);
        setEmail(storedLoginData.email);

    }
  }, []);


  return (
    <div className='App'>

          <div>
            <h1>Welcome {staff}</h1>
            <Link to={`/staff-details/${email}`}>MY PROFILE</Link>
            <br/>
            <br/>

            <Link to={`/casual-leave`}>CAUSUAL LEAVE</Link>

            <h4>WEEKLY REPORT</h4>
            <h4>SALARY ADVANCE</h4>
          </div>

    </div>
  );
}

export default StaffDashboard;
