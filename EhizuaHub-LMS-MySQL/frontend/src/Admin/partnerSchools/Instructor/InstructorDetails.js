import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const InstructorDetails = () => {
    const [instructors, setInstructor] = useState([]);
    const [error, setError] = useState('');
    const { email: contentParam } = useParams();

    useEffect(() => {
        // Fetch tutors when the component mounts
        async function fetchInstructors() {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/instructors');
                setInstructor(response.data.instructors);
            } catch (error) {
                setError('Error retrieving tutors');
            }
        }

        fetchInstructors();
    }, []);

    // Find the tutor based on the email parameter
    const instructor = instructors.find((instructor) => instructor.email === contentParam);

    return (
        <div>
            <h1>{instructor?.first_name}</h1>
            <h1>{instructor?.last_name}</h1>

            {instructor && (
                <div>
                    <p>Email: {instructor.email}</p>
                    <p>Phone Number: {instructor.phone}</p>
                    <p>Course: {instructor.course}</p>
                    <p>Branch Office: {instructor.office}</p>
                    <p>Qualified for: {instructor.sickLeave} Sick Leave</p>
                    <p>Sick Leave Taken: {instructor.sickLeaveTaken}</p>
                    <p>HMO: {instructor.sickLeaveTaken}</p>
                </div>

            )}
        

        </div>
    );
};

export default InstructorDetails;
