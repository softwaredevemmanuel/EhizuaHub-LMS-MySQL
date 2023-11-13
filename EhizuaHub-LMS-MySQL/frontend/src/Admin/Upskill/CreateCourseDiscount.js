import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from '../LoginForm';

function CreateCourseDiscount() {
    const [login, setLogin] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [course, setCourse] = useState('');
    const [percent, setPercent] = useState('');
    const [discountPrice, setDiscountedPrice] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [courseDiscount, setCourseDiscount] = useState([]);
    const [percentageDiscount, setPercentageDiscount] = useState('');
    const [description, setDescription] = useState('');
    const [officesArray, setOfficesArray] = useState([]);
    const [office, setOffice] = useState('');

    const contentItem = courseDiscount.find((item) => item.course == course);

    useEffect(() => {
        const loginData = JSON.parse(localStorage.getItem('Adminlogin'));

        if (loginData && loginData.login && loginData.admin && loginData.admin_authorization) {
            setLogin(true);
            setAdmin(true);
        }
    }, []);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/all_upskill_courses');
                setCourseDiscount(response.data.message);

            } catch (error) {
                setError('Error retrieving content');
            }
        }

        fetchCourses();

    }, []);

    useEffect(() => {
        async function fetchLocation() {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/all_offices');

                setOfficesArray(response.data.message);

            } catch (error) {
                setError('Error retrieving Location');
            }
        }

        fetchLocation();

    }, []);

    useEffect(() => {
        async function CalculateDiscount() {
            if (contentItem && percent) {
                setPercentageDiscount((parseInt(percent) / 100) * parseInt(contentItem.price))
                if(percentageDiscount){
                    setDiscountedPrice(contentItem.price - percentageDiscount)

                }

            }

        }

        CalculateDiscount();

    }, [contentItem, percent, percentageDiscount]);

    const createCourseDiscount = () => {
        if (course && percent) {
            setLoading(true);
            axios
                .post('http://localhost:5000/api/auth/create-discount-course', {

                    course,
                    duration : contentItem.durationInWeeks,
                    courseAmount: contentItem.price,
                    percent,
                    discountRemoved: percentageDiscount,
                    discountPrice,
                    description,
                    office
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
        createCourseDiscount();
    };

    const clearForm = () => {
        setCourse('');
    };


    return (
        <div className='App'>
            {!login && !admin ? (
                <LoginForm />
            ) : (
                <div className='App'>
                    <h1>Create A Discount Course</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='officeName'> Name of Course</label>
                        <select
                            value={course}
                            onChange={(event) => setCourse(event.target.value)}
                        >
                            <option value=''> Select an option</option>
                            {courseDiscount.map((courses, index) => (
                                <option key={index} value={courses.course}>
                                    {courses.course}
                                </option>
                            ))}
                        </select>
                        <br />
                        <br />
                        <label htmlFor='officeName'>Office Location</label>
                        <select
                            value={office}
                            onChange={(event) => setOffice(event.target.value)}
                        >
                            <option value=''> Select an option</option>
                            {officesArray.map((office, index) => (
                                <option key={index} value={office.officeName}>
                                    {office.officeName}
                                </option>
                            ))}
                        </select>
                        <br />
                        <br />
                        <label htmlFor='officeName'> Duration: </label>
                            {contentItem &&(
                                `${contentItem.durationInWeeks} Weeks`
                            )}


                        <br />
                        <br />

                        {contentItem ? (
                            discountPrice ? (
                                <div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>COURSE PRICE</th>
                                                <th>PERCENTAGE DISCOUNT</th>
                                                <th>PROMO PRICE</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td>N: {contentItem.price}</td>
                                                <td>N: {percentageDiscount}</td>
                                                <td>N: {discountPrice}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>

                            ) : (
                                <div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>COURSE PRICE</th>
                                            <th>PERCENTAGE DISCOUNT</th>
                                            <th>PROMO PRICE</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>N: {contentItem.price}</td>
                                            <td>N: </td>
                                            <td>N: </td>
                                          
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                            )
                        ) : (
                            <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>COURSE PRICE</th>
                                        <th>PERCENTAGE DISCOUNT</th>
                                        <th>PROMO PRICE</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>N: </td>
                                        <td>N: </td>
                                        <td>N: </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                        )}

                        <br />
                        <br />
                        <label htmlFor='officeName'> Percentage Discount </label>
                        <input
                            type='number'
                            placeholder='Required'
                            value={percent}
                            onChange={(event) => setPercent(event.target.value)}
                        />
                        <br />
                        <br />
                
                        <label htmlFor='officeName'>Description </label>
                        <textarea
                            type='text'
                            placeholder='Required'
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                        <br />
                        <br />
                    
                      

                        <button type='submit'>Create</button>
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

export default CreateCourseDiscount;
