
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoginForm from './LoginForm';


function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const SingleStudentDetailsPage = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const [login, setLogin] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [yes, setYes] = useState('');
  const [id, setId] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [certificate, setCertificate] = useState(false);



  useEffect(() => {
    let login = JSON.parse(localStorage.getItem('Adminlogin'));
    let admin = login


    if ((login && admin.login && admin.admin && admin.admin_authorization)) {
      setLogin(true);
      setAdmin(true);
    }
  }, []);



  // Get the content parameter from the URL using useParams
  const { _id: contentParam } = useParams();

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/students');
        setContent(response.data.students);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    fetchStudents();

  }, []);

  const contentItem = content.find((item) => item._id == contentParam);

  const approveCertificate = () => {
    setLoading(true);
    axios
      .put(`http://localhost:5000/api/auth/approve-certificate/${id}`, {
    
      })
      .then((response) => {
        setSuccess(response.data.message);
        setYes('')
        setCertificate('1')
      })
      .catch((error) => {
        setError(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (contentItem) {
        setId(contentItem._id || '');
        setCertificate(contentItem.certificateApproved || '');
    }
  }, [contentItem]);
  console.log(certificate)

  const handleYes = event => {
    event.preventDefault();
    setYes(event.target.value);

  };
  const handleCertificate = (event) => {
    event.preventDefault();
    approveCertificate();
  };

  const handleNo = (event) => {
    event.preventDefault();
    setYes(''); // Hide the form when "No" is clicked
  };
  return (
    <div>
      {!login ? (
        <LoginForm />
      ) : (

        <div>

          {contentItem && (

            <div>
              <a href={`/students_progress/${contentItem._id}/${contentItem.course}/${contentItem.email}`}>
                <p>View Progress</p>

              </a>

            </div>
          )}

          <h1>Details Page</h1>
          {success && <p style={{ color: 'green' }}>{success}</p>}


          {contentItem && (
            <div>
              {certificate != '1' ?(
              <button>
                <a href={`/update_student/${contentItem._id}`}>
                  <p>Edit</p>
                </a>

              </button>
                ):(

                  <button disabled>
                  <p>Edit</p>
                </button>
                )}

              {certificate != '1' ?(
                <button type='submit' value='yes' onClick={handleYes}>
                Approve Certificate
              </button>
              ):(

                <button disabled>
                Certificate Collected
              </button>
              )}
              
              
              {yes !== 'yes' ? (
                    ''
                  ) : (
                    <div>
                      <h4>Are you sure you want to approve Certificate Download for {contentItem.firstName} {contentItem.lastName}?</h4>
                      <h3>Are you sure?</h3>
                      <button type='submit' value='yes' onClick={handleCertificate}>
                        Yes
                      </button>
                      <br />
                      <button type='submit' value='no' onClick={handleNo}>
                        No
                      </button>
                    </div>
                    )}
              
            </div>

          )}



          {loading && <p>Loading...</p>}
          {contentItem && (
            <div>
              <div>
                <p>{contentItem.firstName} {contentItem.lastName}</p>
                <p>{contentItem.email}</p>
                <p>{contentItem.course}</p>
                <p>{formatDate(contentItem.createdAt)}</p>
                <p>{contentItem.phone}</p>
                <p>{contentItem.guardiansPhone}</p>
                <p>{contentItem.duration}</p>
                <p>{contentItem.courseFee}</p>
                <p>{contentItem.amountPaid}</p>
                <p>{contentItem.balance}</p>
                <p>{contentItem.homeAddress}</p>
                <p>{contentItem.isVerified === 1 ? 'True' : 'False'}</p>
              </div>
              <div>

              </div>

            </div>
          )}
        </div>
      )}

    </div>

  );
};

export default SingleStudentDetailsPage;
