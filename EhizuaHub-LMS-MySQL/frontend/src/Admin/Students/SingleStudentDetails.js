
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoginForm from '../LoginForm';


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
  const [yes, setYes] = useState('');
  const [id, setId] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [certificate, setCertificate] = useState(false);
  const { course: courseParam } = useParams();
  const { email: emailParam } = useParams();


    useEffect(() => {
        let admin = JSON.parse(localStorage.getItem('Adminlogin'));

        if ((admin && admin.login && admin.admin && admin.admin_authorization)) {
            setLogin(true);
        }
    }, []);




  // Get the content parameter from the URL using useParams

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/students/course-email',{
          headers:{
            course : courseParam,
            email : emailParam
          }
        });
        setContent(response.data.students);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    fetchStudents();

  }, [courseParam, emailParam]);


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
    if (content) {
        setId(content._id || '');
        setCertificate(content.certificateApproved || '');
    }
  }, [content]);

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
      {login ? (
        <LoginForm />
      ) : (

        <div>

          {content && (

            <div>
              <a href={`/students_progress/${content._id}/${content.course}/${content.email}`}>
                <p>View Progress</p>

              </a>

            </div>
          )}

          <h1>Details Page</h1>
          {success && <p style={{ color: 'green' }}>{success}</p>}


          {content && (
            <div>
              {certificate != '1' ?(
              <button>
                <a href={`/update_student/${content._id}`}>
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
                      <h4>Are you sure you want to approve Certificate Download for {content.firstName} {content.lastName}?</h4>
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
          {content && (
            <div>
              <div>
                <p>{content.firstName} {content.lastName}</p>
                <p>{content.email}</p>
                <p>{content.course}</p>
                <p>{formatDate(content.createdAt)}</p>
                <p>{content.phone}</p>
                <p>{content.guardiansPhone}</p>
                <p>{content.duration}</p>
                <p>{content.courseFee}</p>
                <p>{content.amountPaid}</p>
                <p>{content.balance}</p>
                <p>{content.homeAddress}</p>
                <p>{content.isVerified === 1 ? 'True' : 'False'}</p>
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
