import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from '../LoginForm';


function Location() {
    const [offices, setOffices] = useState([]);
    const [error, setError] = useState('');
    const [login, setLogin] = useState(null);


    useEffect(() => {
        let admin = JSON.parse(localStorage.getItem('Adminlogin'));

        if ((admin && admin.login && admin.admin && admin.admin_authorization)) {
            setLogin(true);
        }
    }, []);


    useEffect(() => {
        // Fetch tutors when the component mounts
        async function fetchOffices() {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/all_offices');
                setOffices(response.data.message);
            } catch (error) {
                setError('Error retrieving Area Offices');
            }
        }

        fetchOffices();
    }, []);

    return (
        <div>
            {!login ? (
                <LoginForm />
            ) : (
                <div>



                    {offices.map((office, index) => (

                        <div key={index}>
                            <a href={`/hub-students/${office.officeName}`}>

                                <div>
                                    <p>{office.officeName}</p>
                                    <p>{office.state}</p>
                                    <p>{office.officeAddress}</p>

                                </div>
                            </a>
                            <br/>
                            <br/>

                        </div>
                    ))}

                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

        </div>
    );
}

export default Location;
