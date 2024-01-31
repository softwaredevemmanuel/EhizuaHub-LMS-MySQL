import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';



function HubTutorDashboard() {
    const [course, setCourse] = useState('');


    useEffect(() => {
        const storedLoginData = JSON.parse(localStorage.getItem('Stafflogin'));
        if (storedLoginData && storedLoginData.login && storedLoginData.token && storedLoginData.staff_authorization) {

            setCourse(storedLoginData.hubCourse)

        }
    }, []);

    const hubCoursesArray = course ? course.split(', ') : [];


    return (
        <div className='App'>
            <div>
                <h1>Hub Section</h1>

                {hubCoursesArray.map((course, index) => (
                    <div key={index} value={course}>
                        <h4>{course}</h4>
                        <div>
                            <br />
                            <Link to={`/create_hub_course_curriculum/${course}`}>Create Curriculum</Link>
                            <br />
                            <br />
                           
                            <Link to={`/create_hub_course_content/${course}`}>Create Content</Link>
                            <br />
                            <br />
                            <Link to={`/view_hub_course_content/${course}`}>View Created Content</Link>
                            <br />
                            <br />
                            <Link to={`/view_hub_course_curriculum/${course}`}>View Curriculum</Link>
                            <br />
                            <br />
                            <Link to={`/create_question/${course}`}>Create Question</Link>
                            <br />
                            <br />
                        </div>
                    </div>
                ))}


            </div>
        </div>
    );
}

export default HubTutorDashboard;
