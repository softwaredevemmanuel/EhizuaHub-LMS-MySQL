import React, {useEffect, useState}from 'react';
import axios from 'axios';
import '../Index.css'

const ApprovedLeaveRequest = () => {
    const [error, setError] = useState('');
    const [leaveRequest, setLeaveRequest] = useState([]);



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


 


    const newLeaveRequest = leaveRequest.filter(item => item.isApproved === 1);


  return (
    <div>
      
      <h3>Approved Leave Request</h3>
      <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Location</th>
              <th>Department</th>
              <th>Days Requested</th>
              <th>From</th>
              <th>To</th>
              <th>Purpose Of Leave</th>
              <th>Allocated Leave</th>
              <th>Leave Days Remaining</th>
              <th>Uploaded Ducument</th>
              <th>Status</th>
              
            </tr>
          </thead>
          <tbody>
            {newLeaveRequest.map((tutor, index) => (
              <tr key={index}>
                <td>{tutor.fullName}</td>
                <td>{tutor.location}</td>
                <td>{tutor.department}</td>
                <td>{tutor.numberOfDays}</td>
                <td>{tutor.leaveStartDate}</td>
                <td>{tutor.leaveEndDate}</td>
                <td>{tutor.purposeOfLeave}</td>
                <td>{tutor.allocatedLeave}</td>
                <td>{tutor.daysRemaining}</td>
                <td>{tutor.uploadedDocument}</td>
                <td style={{ color: tutor.isApproved === 1 ? 'green' : tutor.isApproved === 0 ? 'gray' : 'red' }}>
                    {tutor.isApproved === 1 && 'Approved'}
                    {tutor.isApproved === 0 && 'Pending'}
                    {tutor.isApproved === 2 && 'Rejected'}
                </td>
              
              </tr>
            ))}
          </tbody>
      </table>
        
    </div>
  )
}

export default ApprovedLeaveRequest



