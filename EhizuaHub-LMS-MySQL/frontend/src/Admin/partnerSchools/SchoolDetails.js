
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoginForm from '../LoginForm';


const SchoolDetails = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState(null);



  useEffect(() => {
    let admin = JSON.parse(localStorage.getItem('Adminlogin'));


    if ((admin && admin.login && admin.admin && admin.admin_authorization)) {
      setLogin(true);
    }
  }, []);
 

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/partner-schools', {

        });
        setContent(response.data.message);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    fetchStudents();

  }, []);


    // Get the content parameter from the URL using useParams
    const { id: contentParam } = useParams();
    const contentItem = content.find((item) => item.id == contentParam);



  return (
    <div>
      {!login ? (
        <LoginForm />
      ) : (

        <div>
          <h1>Details Page</h1>

          {loading && <p>Loading...</p>}
          {contentItem && (
            <div>
              <div>
                <p>{contentItem.schoolName} {contentItem.lastName}</p>

                <h3>Courses Enrolled For</h3>
                <p>{`${contentItem.courses}`}</p>
                
                <h3>Days of the week</h3>
                <p>{contentItem.monday == 0 ? '' : `${contentItem.monday}`}</p>
                <p>{contentItem.tuesday == 0 ? '' : `${contentItem.tuesday}`}</p>
                <p>{contentItem.wednesday == 0 ? '' : `${contentItem.wednesday}`}</p>
                <p>{contentItem.thursday == 0 ? '' : `${contentItem.thursday}`}</p>
                <p>{contentItem.friday == 0 ? '' : `${contentItem.friday}`}</p>
                <p>{contentItem.saturday == 0 ? '' : `${contentItem.saturday}`}</p>
                
                <h3>School Admin Phone Number</h3>
                <p>{contentItem.phone}</p>

                <h3>School Admin Email</h3>
                <p>{contentItem.email}</p>

                <h3>Duration</h3>
                <p>{contentItem.duration}</p>

                <h3>Fee per child</h3>
                <p>N{contentItem.courseFee}</p>

                <h3>Amount Paid</h3>
                <p>{contentItem.amountPAid == '' ? '' : 'N0.00'}</p>

                <h3>School Address</h3>
                <p>{contentItem.schoolAddress}</p>

                <h3>School verified</h3>
                <p>{contentItem.isVerified === 1 ? 'True' : 'False'}</p>
              </div>
              <div>

              </div>

            </div>
          )}
        </div>
      )}
  </div>

  );

};

export default SchoolDetails;
