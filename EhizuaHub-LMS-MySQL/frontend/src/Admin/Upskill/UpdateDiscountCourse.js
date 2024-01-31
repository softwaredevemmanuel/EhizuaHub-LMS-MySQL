import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from '../LoginForm';
import { useParams } from 'react-router-dom';


function UpdateDiscountCourse() {
    const [login, setLogin] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [percent, setPercent] = useState('');
    const [discountPrice, setDiscountedPrice] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [percentageDiscount, setPercentageDiscount] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState([]);
    const [officesArray, setOfficesArray] = useState([]);
    const [office, setOffice] = useState('');
    const [percentageDiscountPrice, setPercentageDiscountPrice] = useState('');
    const [percentage, setPercentage] = useState('');
    const [branch1, setBranch1] = useState('');
    const [branch2, setBranch2] = useState('');
    const [coursePrice, setCoursePrice] = useState('');
    const [discountRemoved, setDiscountRemoved] = useState('');
    const [promoPrice, setPromoPrice] = useState('');


    const { id: idParam } = useParams();
    const contentItems = content.find((item) => item._id == idParam);


    useEffect(() => {
        const loginData = JSON.parse(localStorage.getItem('Adminlogin'));

        if (loginData && loginData.login && loginData.admin && loginData.admin_authorization) {
            setLogin(true);
            setAdmin(true);
        }
    }, []);

    useEffect(() => {
        async function fetchDiscountCourse() {
            try {

                const response = await axios.get('http://localhost:5000/api/auth/discount-courses');

                setContent(response.data.message);

            } catch (error) {
                setError('Error retrieving Courses');
            }
        }


        fetchDiscountCourse();

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
            if (percent) {
              
                setPercentageDiscount((parseInt(percent) / 100) * parseInt(coursePrice))

                if (percentageDiscount) {
                    setDiscountedPrice(coursePrice - percentageDiscount)
                }
            }
        }
        CalculateDiscount();

    }, [percent, percentageDiscount]);

  
  
const updateCourseDiscount = () => {
        setLoading(true);
        if (percent) {
            console.log('mmmmmmmm')

            axios
                .put(`http://localhost:5000/api/auth/create-discount-course/${idParam}`, {

                    

                    office : office,
                    percent : percent,
                    percentageDiscount : percentageDiscount,
                    discountPrice : discountPrice,
                    description : description
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
            console.log('hhhhhhhh')

            axios
                .put(`http://localhost:5000/api/auth/create-discount-course/${idParam}`, {

                office : office,
                percentage : percentage,
                discountRemoved : discountRemoved,
                promoPrice: promoPrice,
                description: description
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
        }

    };



    const handleSubmit = (event) => {
        event.preventDefault();
        updateCourseDiscount();
    };

    const clearForm = () => {
        // setCourse('');
    };
    // Set initial state values from contentItem after it's loaded
    useEffect(() => {
        if (contentItems) {
            setOffice(contentItems.office || '');
            setPromoPrice(contentItems.discountPrice || '');
            setPercentageDiscountPrice(contentItems.discountRemoved || '');
            setPercentage(contentItems.percent || '');
            setDescription(contentItems.description || '');
            setBranch1(contentItems.course || '');
            setBranch2(contentItems.durationInWeeks || '');
            setCoursePrice(contentItems.courseAmount || '');
            setDiscountRemoved(contentItems.discountRemoved || '');
            setPromoPrice(contentItems.discountPrice || '');

        }

    }, [contentItems]);

    return (
        <div className='App'>
            {login && admin ? (
                <LoginForm />
            ) : (
                <div className='App'>


                    <form onSubmit={handleSubmit}>
                        <label htmlFor='officeName'> Name of Course</label>
                        <select>
                            <option>{branch1}</option>
                        </select>
                        <br />
                        <br />

                        <label htmlFor='officeName'>Office Location</label>

                        {contentItems && (
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
                        )}



                        <br />
                        <br />
                        <label htmlFor='officeName'> Duration: </label>
                            {branch2} Weeks
                        


                        <br />
                        <br />

                        {percentageDiscount ? (
                            discountPrice && (
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
                                                <td>N: {coursePrice}</td>
                                                <td>N: {percentageDiscount} {percent}%</td>
                                                <td>N: {discountPrice}</td>
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
                                            <td>N: {coursePrice}</td>
                                            <td>N: {discountRemoved} {percentage}%</td>
                                            <td>N: {promoPrice}</td>
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



                        <button type='submit'>Update</button>
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

export default UpdateDiscountCourse;
