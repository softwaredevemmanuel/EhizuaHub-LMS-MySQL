import React, { useState, useEffect } from 'react';
import LeaveDashboard from './LeaveDashboard';


function StaffDashboard() {
  const [staff, setStaff] = useState('');



  // ..................useEffect for checking localStorage and Verifying Login ..............
  useEffect(() => {
    const storedLoginData = JSON.parse(localStorage.getItem('Stafflogin'));
    if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.staff_authorization) {
      
        setStaff(storedLoginData.staff);

    }
  }, []);


  return (
    <div className='App'>

          <div>
            <h1>Welcome {staff}</h1>
            <h4>LEAVE</h4>
            <h4>WEEKLY REPORT</h4>
            <h4>SALARY ADVANCE</h4>
            <LeaveDashboard/>
          </div>

    </div>
  );
}

export default StaffDashboard;
