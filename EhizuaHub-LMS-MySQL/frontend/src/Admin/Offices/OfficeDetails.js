import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoginForm from '../LoginForm';
import profile from '../../assets/profile.png'




const OfficeDetails = () => {
  const [content, setContent] = useState([]);
  const [login, setLogin] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [allStaff, setAllStaff] = useState([]);
  const [staff, setStaff] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);


    // Get the content parameter from the URL using useParams
  const { officeName: contentParam } = useParams();

  useEffect(() => {
    let login = JSON.parse(localStorage.getItem('Adminlogin'));
    let admin = login


    if ((login && admin.login && admin.admin && admin.admin_authorization)) {
      setLogin(true);
      setAdmin(true);
    }
  }, []);

  useEffect(() => {
    async function fetchOffices() {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/all_offices');

        setContent(response.data.message);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    fetchOffices();

  }, []);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/staff');

        console.log(response.data.staff)
        setAllStaff(response.data.staff);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    fetchStaff();

  }, []);

  const contentItem = content.find((item) => item.officeName == contentParam);
  const staffItem = allStaff.filter((items) => items.office == contentParam);
  console.log(staffItem)





  return (
    <div>
      <h4>Office Details </h4>
      {loading && <p>Loading...</p>}
          
          {/* OBJECT */}
          {contentItem && (
            <div>
              <div>
                <p>Office Location: {contentItem.officeName} </p>
                <p>Office Phone Number: {contentItem.officePhone}</p>
                <p>Office Email: {contentItem.officeEmail}</p>
                <p>State: {contentItem.state}</p>
                <p>Office Address: {contentItem.officeAddress}</p>
              </div>
              <div>

              </div>

            </div>
          )}


          <h3>Staff Details</h3>

          {/* ARRAY */}
          {staffItem.map((office, index) => (
            <div key={index}>
              <img src={profile}/>
              
              <p>{office.first_name}</p>
              <p>{office.last_name}</p>
              <p>{office.phone}</p>
              <p>{office.email}</p>
            <hr/>
            </div>
          ))}



    </div>
  )
}

export default OfficeDetails
