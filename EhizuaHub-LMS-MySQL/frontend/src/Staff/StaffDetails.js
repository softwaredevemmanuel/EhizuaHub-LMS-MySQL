import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LeaveDashboard from './LeaveDashboard';

const StaffDetails = () => {
    const [staffs, setstaffs] = useState([]);
    const [error, setError] = useState('');
    const { email: contentParam } = useParams();

    useEffect(() => {
        // Fetch staffs when the component mounts
        async function fetchstaffs() {
            try {
                let storedData = JSON.parse(localStorage.getItem('Stafflogin'));
                const response = await axios.get('http://localhost:5000/api/staff/details', {
                    headers: {
                        email: storedData.email,
                      },
                });
                setstaffs(response.data.staff);
            } catch (error) {
                setError('Error retrieving staffs');
            }
        }

        fetchstaffs();
    }, []);

    // Find the staff based on the email parameter
    const staff = staffs.find((staff) => staff.email === contentParam);

    return (
        <div>
            
            <h1>{staff?.first_name}</h1>
            <h1>{staff?.last_name}</h1>

            {staff && (
                <div>
                    <p>Email: {staff.email}</p>
                    <p>Phone Number: {staff.phone}</p>
                    <p>Position: {staff.position}</p>
                    <p>Branch Office: {staff.office}</p>
                    <p>Qualified for: {staff.sickLeave} Sick Leave</p>
                    <p>Sick Leave Taken: {staff.sickLeaveTaken}</p>
                    <p>HMO: {staff.sickLeaveTaken}</p>
                </div>

            )}
        

        </div>
    );
};

export default StaffDetails;
