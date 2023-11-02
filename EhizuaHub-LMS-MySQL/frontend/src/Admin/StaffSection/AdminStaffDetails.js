import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import LoginForm from '../LoginForm';
import { useParams } from 'react-router-dom';
import profilePics from '../../assets/profile.png'


function AdminStaffDetails() {
  const [login, setLogin] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading indicator


   // Get the content parameter from the URL using useParams
   const { _id: contentParam } = useParams();
   const contentItem = staff.find((item) => item._id == contentParam);

  useEffect(() => {
    let login = JSON.parse(localStorage.getItem('Adminlogin'));
    let admin = login
  

    if ((login && admin.login && admin.admin && admin.admin_authorization)) {
      setLogin(true);
      setAdmin(true);
    }  
  }, []);




  useEffect(() => {
    setLoading(true)

    // Fetch Staff when the component mounts
    async function fetchStaff() {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/staff');
        setStaff(response.data.staff);
        setLoading(false)

      } catch (error) {
        setError('Error retrieving staff');
      }
    }

    fetchStaff();
  }, []);






  return (
    <div className='App'>
      {!login && !admin? (
        <LoginForm/>
      ) : (
       

    <div className='App'>
      <h1>Staff Details</h1>
      {loading && <p>Loading...</p>}
          {contentItem && (
            <div>
              <div>
                <p>Verified Staff: {contentItem.isVerified === 1 ? 'YES' : 'NO'}</p>
                <img src={profilePics}/>

                <p>Full Name: {contentItem.first_name} {contentItem.last_name}</p>
                <p>Email: {contentItem.email}</p>
                <p>Date Of Birth: {contentItem.dateOfBirth}</p>
                <p>Office Location: {contentItem.office}</p>
                <p>Position: {contentItem.position}</p>
                <p>{contentItem.hubInstructor === '1' ? 'Hub Instructor' : ''}</p>
                <p>{contentItem.schoolInstructor === '1' ? 'School Instructor' : ''}</p>
                <p>Phone Number: {contentItem.phone}</p>
                <p>Account Number: {contentItem.accountNumber}</p>
                <p>Bank Name: {contentItem.bank}</p>
                <p>Number Of Sick Leave Allocated: {contentItem.sickLeave}</p>
                <p>HMO: {contentItem.HMO}</p>
                <p>Home Address: {contentItem.homeAddress}</p>
                <p>Next of kin Phone Number: {contentItem.nextOfKinPhoneNumber}</p>
                <p>Next of kin Address: {contentItem.nextOfKinAddress}</p>
              </div>
              <div>

              </div>

            </div>
          )}

            <div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>


      </div>
      
      )}

      

    </div>
  );
}

export default AdminStaffDetails;
