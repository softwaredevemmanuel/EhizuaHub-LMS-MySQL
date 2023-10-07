import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Index.css'

const PendingLeaveRequest = () => {
    const [error, setError] = useState('');
    const [leaveRequest, setLeaveRequest] = useState([]);
    const [rejectSuccess, setRejectSuccess] = useState('');
    const [approvedSuccess, setApproveSuccess] = useState('');
    const [approved, setApproved] = useState('');
    const [reject, setRejected] = useState('');
    const [email, setEmail] = useState('');
    const [notApproved, setNotApproved] = useState('');


    useEffect(() => {

        // Fetch tutors when the component mounts
        async function fetchLeave() {
            try {
                const response = await axios.get('http://localhost:5000/api/tutor/leave-request');
                setLeaveRequest(response.data.leave);
            } catch (error) {
                setError('Error retrieving tutors');
            }
        }

        fetchLeave();
    }, []);


    const handleRejectLeave = (id) => {

        fetch(`http://localhost:5000/api/auth/reject-leave-request/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // Include any additional headers as needed
            },
        })
            .then(response => response.json())
            .then(data => {
                setRejectSuccess(data.reject);
                setRejected('')
                setLeaveRequest(prevLeaveRequest => prevLeaveRequest.filter(tutor => tutor._id !== id));


            })
            .catch(error => {
                console.error('Error Rejecting Tutor:', error);
            });
    };
    const handleApproveLeave = (id) => {

        fetch(`http://localhost:5000/api/auth/approve-leave-request/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // Include any additional headers as needed
            },
        })
            .then(response => response.json())
            .then(data => {
                setApproveSuccess(data.approve);
                setRejected('')
                setApproved('')
                setNotApproved(data.notApprove)
                setLeaveRequest(prevLeaveRequest => prevLeaveRequest.filter(tutor => tutor._id !== id));


            })
            .catch(error => {
             
            });
    };


    const handleApprove = (id) => {
        setApproved("Approved")
    };
    const handleReject = (id) => {
        setRejected("Rejected");
    };
    const handleNo = (id) => {
        setRejected("");
        setApproved("");
        setLeaveRequest(prevLeaveRequest => prevLeaveRequest.filter(tutor => tutor._id !== id));

    };


    const newLeaveRequest = leaveRequest.filter(item => item.isApproved === 0);

    return (
        <div>

            <h3>Pending Leave Request</h3>
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
                        <th>Approve Leave</th>

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
                            <td>
                                <button onClick={() => handleApprove()}>Apr</button>
                                <button onClick={() => handleReject()}>Rjt</button>

                                {approved && (
                                    <div className="confirmation-dialog">
                                        <h3>Are you sure you want to APPROVE the leave Request?</h3>
                                        <button onClick={() => handleApproveLeave(tutor._id)}>YES</button>
                                        <button onClick={() => handleNo()}>NO</button>

                                    </div>
                                )}

                                {reject && (
                                    <div className="confirmation-dialog">
                                        <h3>Are you sure you want to REJECT the leave Request?</h3>
                                        <button onClick={() => handleRejectLeave(tutor._id)}>YES</button>
                                        <button onClick={() => handleNo()}>NO</button>
                                    </div>
                                )}


                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>

            {rejectSuccess && <p style={{ color: 'red' }}>{rejectSuccess}</p>}
            {approvedSuccess && <p style={{ color: 'green' }}>{approvedSuccess}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {notApproved && <p style={{ color: 'red' }}>{notApproved}</p>}

        </div>
    )
}

export default PendingLeaveRequest



