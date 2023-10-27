import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LeaveDashboard from '../Staff/LeaveDashboard';

const TutorDetails = () => {
    const [tutors, setTutors] = useState([]);
    const [error, setError] = useState('');
    const { email: contentParam } = useParams();

    useEffect(() => {
        // Fetch tutors when the component mounts
        async function fetchTutors() {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/tutors');
                setTutors(response.data.tutors);
            } catch (error) {
                setError('Error retrieving tutors');
            }
        }

        fetchTutors();
    }, []);

    // Find the tutor based on the email parameter
    const tutor = tutors.find((tutor) => tutor.email === contentParam);

    return (
        <div>
            <h1>{tutor?.first_name}</h1>
            <h1>{tutor?.last_name}</h1>

            {tutor && (
                <div>
                    <p>Email: {tutor.email}</p>
                    <p>Phone Number: {tutor.phone}</p>
                    <p>Course: {tutor.course}</p>
                    <p>Branch Office: {tutor.office}</p>
                    <p>Qualified for: {tutor.sickLeave} Sick Leave</p>
                    <p>Sick Leave Taken: {tutor.sickLeaveTaken}</p>
                    <p>HMO: {tutor.sickLeaveTaken}</p>
                </div>

            )}
        

        </div>
    );
};

export default TutorDetails;
