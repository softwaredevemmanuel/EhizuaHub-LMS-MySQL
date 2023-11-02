import React, { useState, useEffect } from 'react';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import TutorDashboard from '../Tutor/TutorDashboard';

function LeaveDashboard() {
  const [loginData, setLoginData] = useState(false);
  const [tutor, setTutor] = useState('');
  const [office, setOffice] = useState('');
  const [course, setCourse] = useState('');
  const [success, setSuccess] = useState('');
  const [oneDay, setOneDay] = useState(false);
  const [twoDays, setTwoDays] = useState(false);
  const [threeDays, setThreeDays] = useState(false);
  const [dateShow, setDateShow] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState([]);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [staffDetails, setStaffDetails] = useState('');
  const [pendingLeave, setPendingLeave] = useState(1);

  const minSelectableDate = new Date(); // Get the current date

  // Create a state variable to store form data
  const [formData, setFormData] = useState({
    selectedDays: '',
    leaveStartDate: '',
    leaveEndDate: '',
    purposeOfLeave: '',
    uploadedDocument: null,
  });

  // ..................useEffect for checking localStorage and Verifying Login ..............
  useEffect(() => {
    const storedLoginData = JSON.parse(localStorage.getItem('Stafflogin'));
    if (
      storedLoginData &&
      storedLoginData.login &&
      storedLoginData.token &&
      storedLoginData.staff_authorization
    ) {
      setLoginData(true);
      setTutor(storedLoginData.staff);
      setOffice(storedLoginData.office)
      setEmail(storedLoginData.email)
    }
  }, []);

  useEffect(() => {
    async function fetchLeave() {
      try {
        let storedData = JSON.parse(localStorage.getItem('Stafflogin'));
        const response = await axios.get('http://localhost:5000/api/staff/leave-request',{
          headers: {
            email : storedData.email

          },
        });
        const leaveData = response.data.leave;
  
        if (leaveData.length > 0) {
          // Access the latest leave request
          const latestLeave = leaveData[leaveData.length - 1];
          
          // Update state with the latest leave data
          setLeaveRequest(leaveData);
          console.log(latestLeave.isApproved);
          setPendingLeave(latestLeave.isApproved);
        } else {
          // Handle the case when there are no leave requests

          setLeaveRequest([]);
          setPendingLeave(1); // or setPendingLeave(false) depending on your logic
        }
  
      } catch (error) {
        setError('Error retrieving leave requests');
      }
    }
  
    fetchLeave();
  }, []);
  
  

// Fetch staff details (number of leave left)
  useEffect(() => {
    async function fetchStaffDetails() {
      try {
        let storedData = JSON.parse(localStorage.getItem('Stafflogin'));

        const response = await axios.get('http://localhost:5000/api/staff/details',{
          headers: {
            email : storedData.email

          },
        
        });
        
        setStaffDetails(response.data.leaveLeft);
      } catch (error) {
        setError('Error retrieving tutors');
      }
    }

    fetchStaffDetails();
  }, []);



  function sendLeaveRequest() {
    axios
      .post('http://localhost:5000/api/staff/leave-application',

        {
          formData: formData,
          name: tutor,
          office: office,
          email: email

        })
      .then((response) => {
        console.log(response.data.message)
        setSuccess(response.data.message)
        setOffice('')
        setCourse('')
        setOneDay(false)
        setTwoDays(false)
        setThreeDays(false)
        setDateShow(false)


      })
      .catch((error) => {

      });

  }

  minSelectableDate.setDate(minSelectableDate.getDate() + 2);

  const handleClick = () => {
    setDateShow(true);
  };

  const handleCancel = () => {
    setDateShow(false);
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setOneDay(selectedValue === '1');
    setTwoDays(selectedValue === '2');
    setThreeDays(selectedValue === '3');
    setFormData({ ...formData, selectedDays: selectedValue });
  };

  const handleStartDateChange = (event) => {
    const startDate = event.target.value;
    setFormData({ ...formData, leaveStartDate: startDate });
  };

  const handleEndDateChange = (event) => {
    const endDate = event.target.value;
    setFormData({ ...formData, leaveEndDate: endDate });
  };

  const handlePurposeChange = (event) => {
    const purpose = event.target.value;
    setFormData({ ...formData, purposeOfLeave: purpose });
  };

  const handleDocumentUpload = (event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, uploadedDocument: file });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendLeaveRequest();
  };

  const myLeaveRequests = leaveRequest.filter(item => item.email === email);

  // const issues = async () => {
  //   const a = await myLeaveRequests[0]?.isApproved === 0; // Use optional chaining to avoid errors if the array is empty
  //   console.log(a);
  //   setNoLeaveRequest(true)
  // };
  
  // // Call the issues function
  // issues();
  // console.log(noLeaveRequest)
  

  return (
    <div className="App">
    
        <div>
          <hr/>

          <h4> Leave Dashboard</h4>
          <p>
            {' '}
            Annual Leave <strong>19 Dec 2023 - 12 Jan 2024</strong>
          </p>
          <h4>You have {staffDetails} sick leave days left</h4>
       
          <hr />
          <h3>My Leave Request</h3>
          <table>
            <thead>
              <tr>
                <th>Number of Days</th>
                <th>From</th>
                <th>To</th>
                <th>Purpose Of Leave</th>
                <th>Uploaded Ducument</th>
                <th>HR Confirmation</th>

              </tr>
            </thead>
            <tbody>

              {myLeaveRequests.map((tutor, index) => (
                <tr key={index}>
                  <td>{tutor.numberOfDays}</td>
                  <td>{tutor.leaveStartDate}</td>
                  <td>{tutor.leaveEndDate}</td>
                  <td>{tutor.purposeOfLeave}</td>
                  <td>{tutor.uploadedDocument}</td>
                  <td style={{ color: tutor.isApproved === 1 ? 'green' : tutor.isApproved === 0 ? 'gray' : 'red' }}>
                    {tutor.isApproved === 1 && 'Approved'}
                    {tutor.isApproved === 2 && 'Rejected'}
                    {tutor.isApproved === 0 && 'Pending'}
                  </td>

                </tr>
              ))}


            </tbody>

          </table>
          <hr />

          {pendingLeave === 1 || pendingLeave === 2 ? (
            <div>
              <label>Apply for sick leave</label>
              {!dateShow ? (
                <div>
                  <input
                    type="submit"
                    value="here"
                    onClick={handleClick}
                  />
                  <br />
                </div>
              ) : (
                <div>
                  <input
                    type="submit"
                    value="cancel"
                    onClick={handleCancel}
                  />
                  <br />
                </div>
              )}
            </div>
          ) :(
            <div>
              <p>Wait For leave approval....</p>
            </div>
          )}

        
         

          <form onSubmit={handleSubmit}>
            {dateShow && (
              <div>
                <select onChange={handleSelectChange}>
                  <option value="Select">Select Number of Days</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            )}
            {oneDay && (
              <div>
                <input
                  type="date"
                  min={minSelectableDate.toISOString().split('T')[0]}
                  onChange={handleStartDateChange}
                />
                <br />
                <br />
                <label>Purpose of Leave</label>
                <br />
                <br />
                <input type="textarea" onChange={handlePurposeChange} />
                <br />
                <br />
                <div>
                  <label>Upload Document if any</label>
                  <br />
                  <input type="file" onChange={handleDocumentUpload} />
                </div>
              </div>
            )}
            {(twoDays || threeDays) && (
              <div>
                <label>From</label>
                <input
                  type="date"
                  min={minSelectableDate.toISOString().split('T')[0]}
                  onChange={handleStartDateChange}
                />
                <label>To</label>
                <input
                  type="date"
                  min={minSelectableDate.toISOString().split('T')[0]}
                  onChange={handleEndDateChange}
                />

                <br />
                <br />
                <label>Purpose of Leave</label>
                <br />
                <br />
                <input type="textarea" onChange={handlePurposeChange} />
                <br />
                <br />
                <div>
                  <label>Upload Document if any</label>
                  <br />
                  <input type="file" onChange={handleDocumentUpload} />
                </div>

              </div>
            )}
            {(oneDay || twoDays || threeDays) && (
              <button type="submit">Submit</button>

            )}

          </form>
          
          {success && <p style={{ color: 'green' }}>{success}</p>}

        </div>

    </div>
  );
}

export default LeaveDashboard;
