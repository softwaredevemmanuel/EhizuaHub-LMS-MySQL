import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import LoginForm from '../LoginForm';

function CreateLocation() {
    const [login, setLogin] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [officeName, setOfficeName] = useState('');
    const [state, setState] = useState('');
    const [officePhoneNumber, setOfficePhoneNumber] = useState('');
    const [officeEmail, setOfficeEmail] = useState('');
    const [officeAddress, setOfficeAddress] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loginData = JSON.parse(localStorage.getItem('Adminlogin'));

        if (loginData && loginData.login && loginData.admin && loginData.admin_authorization) {
            setLogin(true);
            setAdmin(true);
        }
    }, []);

    const createSchool = () => {
        if (officeName) {
            setLoading(true);

            axios
                .post('http://localhost:5000/api/auth/register-office', {

                    officeName,
                    officePhoneNumber,
                    officeEmail,
                    state,
                    officeAddress
                })
                .then((response) => {
                    setSuccess(response.data.message);
                    clearForm();
                })
                .catch((error) => {
                    setError(error.response.data.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setError('Please fill in all required fields.');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createSchool();
    };

    const clearForm = () => {
        setOfficeName('');
        setOfficeEmail('');
        setOfficePhoneNumber('');
        setOfficeAddress('');
    };

    return (
        <div className='App'>
            {!login && !admin ? (
                <LoginForm />
            ) : (
                <div className='App'>
                    <h1>Register Office Location</h1>
                    <form onSubmit={handleSubmit}>
                        <label> Name of Office</label>
                        <input
                            type='text'
                            id='officeName'
                            placeholder='Required'
                            value={officeName}
                            onChange={(event) => setOfficeName(event.target.value)}
                        />
                        <br /><br />
                        <label>Office Phone Number</label>
                        <br />
                        <input
                            type='text'
                            id='officePhoneNumber'
                            value={officePhoneNumber}
                            onChange={(event) => setOfficePhoneNumber(event.target.value)}
                        />
                        <br /><br />
                        <label>Office Email</label>
                        <br />
                        <input
                            type='email'
                            id='officeEmail'
                            value={officeEmail}
                            onChange={(event) => setOfficeEmail(event.target.value)}
                        />
                        <br /><br />




                        <label>Select a State:</label>
                        <br />
                        <select
                            id='state'
                            value={state}
                            onChange={(event) => setState(event.target.value)}
                            >
                            <option value="abia">Abia</option>
                            <option value="adamawa">Adamawa</option>
                            <option value="akwa_ibom">Akwa Ibom</option>
                            <option value="anambra">Anambra</option>
                            <option value="bauchi">Bauchi</option>
                            <option value="bayelsa">Bayelsa</option>
                            <option value="benue">Benue</option>
                            <option value="borno">Borno</option>
                            <option value="cross_river">Cross River</option>
                            <option value="delta">Delta</option>
                            <option value="ebonyi">Ebonyi</option>
                            <option value="edo">Edo</option>
                            <option value="ekiti">Ekiti</option>
                            <option value="enugu">Enugu</option>
                            <option value="gombe">Gombe</option>
                            <option value="imo">Imo</option>
                            <option value="jigawa">Jigawa</option>
                            <option value="kaduna">Kaduna</option>
                            <option value="kano">Kano</option>
                            <option value="katsina">Katsina</option>
                            <option value="kebbi">Kebbi</option>
                            <option value="kogi">Kogi</option>
                            <option value="kwara">Kwara</option>
                            <option value="lagos">Lagos</option>
                            <option value="nasarawa">Nasarawa</option>
                            <option value="niger">Niger</option>
                            <option value="ogun">Ogun</option>
                            <option value="ondo">Ondo</option>
                            <option value="osun">Osun</option>
                            <option value="oyo">Oyo</option>
                            <option value="plateau">Plateau</option>
                            <option value="rivers">Rivers</option>
                            <option value="sokoto">Sokoto</option>
                            <option value="taraba">Taraba</option>
                            <option value="yobe">Yobe</option>
                            <option value="zamfara">Zamfara</option>
                            <option value="fct">Federal Capital Territory (FCT)</option>
                        </select>

                        <br /><br />
                    
                        <label>Office Address</label>
                        <br />
                        <textarea value={officeAddress} onChange={(event) => setOfficeAddress(event.target.value)} />
                        <br /><br />

                        <button type='submit'>Create Office</button>
                    </form>

                    <div>
                        {loading && <p>Loading...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: 'green' }}>{success}</p>}
                    </div>

                  
                </div>
            )}
        </div>
    );
}

export default CreateLocation;
