
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoginForm from '../LoginForm';


const SchoolDetails = () => {
  const [content, setContent] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState(null);
  const [formattedDate, setFormattedDate] = useState('');



  useEffect(() => {
    let admin = JSON.parse(localStorage.getItem('Adminlogin'));


    if ((admin && admin.login && admin.admin && admin.admin_authorization)) {
      setLogin(true);



      const currentDate = new Date();
      const options = { month: 'numeric', day: '2-digit', year: 'numeric' };
      const formattedString = currentDate.toLocaleDateString('en-US', options).replace(/\//g, '');
      setFormattedDate(formattedString);

    }
  }, []);
  console.log(formattedDate)
 

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

  useEffect(() => {
    // Fetch tutors when the component mounts
    async function fetchStudents() {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/partner-school-students',{
          headers:{
            schoolName : contentParam

          }
        });
        setSchools(response.data.message);
      } catch (error) {
        // setError('Error retrieving Partner schools');
      }
    }


    fetchStudents();
  }, []);

  console.log(schools)


    // Get the content parameter from the URL using useParams
    const { schoolName: contentParam } = useParams();
    const contentItem = content.find((item) => item.schoolName == contentParam);



  return (
    <div>
      {!login ? (
        <LoginForm />
      ) : (

        <div>
          <h1>Details Page</h1>
          <div>
      <p>Formatted Date: {formattedDate}</p>
    </div>

          {loading && <p>Loading...</p>}
          {contentItem && (
            <div>
              <div>
                <p>SCHOOL NAME: {contentItem.schoolName} {contentItem.lastName}</p>

                <p>COURSES ENROLLED FOR: {`${contentItem.courses}`}</p>
                
                <h3>Days of the week</h3>
                <p>{contentItem.monday == 0 ? '' : `${contentItem.monday}`}</p>
                <p>{contentItem.tuesday == 0 ? '' : `${contentItem.tuesday}`}</p>
                <p>{contentItem.wednesday == 0 ? '' : `${contentItem.wednesday}`}</p>
                <p>{contentItem.thursday == 0 ? '' : `${contentItem.thursday}`}</p>
                <p>{contentItem.friday == 0 ? '' : `${contentItem.friday}`}</p>
                <p>{contentItem.saturday == 0 ? '' : `${contentItem.saturday}`}</p>
                
                <p>SCHOOL PHONE NUMBER: {contentItem.phone}</p>

                <p>ADMIN EMAIL: {contentItem.email}</p>

                <p>DURATION: {contentItem.duration}</p>

                <p>FEE PER CHILD: N{contentItem.courseFee}</p>

                <p>AMOUNT PAID: {contentItem.amountPAid === '' ? '' : 'N0.00'}</p>

                <p>SCHOOL ADDRESS: {contentItem.schoolAddress}</p>

                <p>IS SCHOOL VERIFIED?{contentItem.isVerified === 1 ? 'True' : 'False'}</p>
              </div>
              <div>

              </div>

            </div>
          )}
        </div>
      )}

<table>
              <thead>
                <tr>
                  <th>School Name</th>
                  <th>School Address</th>
                  <th>Class</th>
                  <th>Course</th>
                  <th>Email</th>
                  <th>Term</th>
                  <th>Year</th>
                  <th>Guardians Phone Number</th>
                  <th>Password</th>
                  <th>IsVerified? </th>
                
                </tr>
              </thead>
              <tbody>
                {schools.map((school, index) => (
                  <tr key={index}>
                    <td>{school.firstName}</td>
                    <td>{school.lastName}</td>
                    <td>{school.level}</td>
                    <td>{school.courses}</td>
                    <td>{school.email}</td>
                    <td>{school.term}</td>
                    <td>{school.year}</td>
                    <td>{school.guardiansPhone}</td>
                    <td>{school.password}</td>
                    <td>{school.isVerified}</td>
                  </tr>
                ))}
              </tbody>
            </table>  </div>

  );

};

export default SchoolDetails;
