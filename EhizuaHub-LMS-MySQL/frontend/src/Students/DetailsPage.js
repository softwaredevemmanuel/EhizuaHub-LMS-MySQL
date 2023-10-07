import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Question from './Question';
import StudentDashboard from './StudentDashboard';
import Timer from './Timer';

const DetailsPage = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subTopic, setSubTopic] = useState('');
  const [course, setCourse] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestions] = useState([]);
  const [success, setSuccess] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [yes, setYes] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [retake, setRetake] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [score, setScore] = useState('');
  const [scoreSubTopic, setScoreSubTopic] = useState('');



  // Get the content parameter from the URL using useParams
  const { id: contentParam } = useParams();

  useEffect(() => {
    async function fetchCourseContent() {
      try {
        let login = JSON.parse(localStorage.getItem('Studentlogin'));
        const response = await axios.get('http://localhost:5000/api/students/student-course-content', {
          headers: {
            authHeader: login.authHeader,
          },
        });
        setContent(response.data.content);
        setLoading(false);
        setCourse(login.course)
        setEmail(login.email)
      } catch (error) {
        setError('Error retrieving content');
        setLoading(false);
      }
    }

    fetchCourseContent();

  }, []);

    async function fetchScore() {
      try {
        let login = JSON.parse(localStorage.getItem('Studentlogin'));
        const response = await axios.get('http://localhost:5000/api/students/student-score', {
          headers: {
            course : login.course,
            email : login.email,
            sub_topic : scoreSubTopic
          },
        });
        setScore(response.data.message);
        console.log(response.data.message)
      } catch (error) {
        setError('Error retrieving content');
        setLoading(false);
      }
    }

    const handleScore = event => {
      event.preventDefault();
      fetchScore();
    };


  const contentItem = content.find((item) => item.id == contentParam);

  async function fetchQuestion() {

    try {
      let login = JSON.parse(localStorage.getItem('Studentlogin'));

      const response = await axios.get('http://localhost:5000/api/students/questions', {
        headers: {
          authHeader: login.authHeader,
          sub_topic: subTopic,
          course: course,
          email: email,
        },

      });
      setQuestions(response.data.questions);

    } catch (error) {
      setError(error.response.data.message);
      setRetake(error.response.data.retake);
    }
  }

  async function retakeQuestion() {

    try {

      const response = await axios.get('http://localhost:5000/api/students/retake', {
        headers: {
          sub_topic: subTopic,
          course: course,
        },

      });
      setQuestions(response.data.questions);

    } catch (error) {
      setError(error.response.data.message);
    }
  }

  const handleSubmit = event => {
    event.preventDefault();
    setShowDetails(false);
    fetchQuestion();
  };

  const handleYes = event => {
    event.preventDefault();
    setYes(event.target.value);
    setShowForm(false); 
    retakeQuestion();
    
  };


  const submitQuestion = async event => {
    event.preventDefault();

    const selectedQuestions = [];

    question.forEach((questionContent, index) => {
      const selectedValue = document.querySelector(`input[name=question${index}]:checked`)?.value;
      if (selectedValue) {
        selectedQuestions.push({
          sub_topic: subTopic,
          course: course,
          email: email,
          question: questionContent.question,
          ans: selectedValue,
        });
      }
    });

    try {
      let login = JSON.parse(localStorage.getItem('Studentlogin'));

      const response = await axios.post('http://localhost:5000/api/students/submit_questions', selectedQuestions, {
        headers: {
          authHeader: login.authHeader,
        },
      });

      setSuccess(response.data.message);

      const submitResponse = await axios.get('http://localhost:5000/api/students/check_test_score', {
      headers: {
        authHeader: login.authHeader,
        sub_topic: subTopic,
        course: course,
        email: email
      },

    });

    setSubmitSuccess(submitResponse.data.message);
    setQuestions([])
    setSubTopic('')



    } catch (error) {
      console.error('Error sending questions:', error);
    }
  };
 
  const handleNo = (event) => {
    event.preventDefault();
    setRetake(''); // Hide the form when "No" is clicked
  };

  return (
    <div>
      <StudentDashboard/>
      
      {showDetails ? (
        <div>
        <h1>Details Page</h1>
        {contentItem && (

        <form onSubmit={handleScore}>
            <button 
                type='submit' 
                value={contentItem.subTopic}
                onClick={(event) => setScoreSubTopic(event.target.value)}>
                  {score ? (
                    
                    `${score}%`
      
                  ):(
                    'View Score'
                  )}
            </button>
            <button>hide</button>


            </form>
        )}
        </div>
      ) : (
        <div>
        <h1>Questions</h1>
          {/* <Question/> */}
        </div>
      )}

      {loading && <p>Loading...</p>}
      {contentItem && (
        <div>
              {showDetails && (
                  <div>
                    <h2>{contentItem.subTopic}</h2>
                    <p>{contentItem.content}</p>
                  </div>
              )}
          <div>

            {showDetails && (
               <form onSubmit={handleSubmit}>

               <button type='submit' value={contentItem.subTopic}
                 onClick={(event) => setSubTopic(event.target.value)}>Take Test</button>
 
             </form>
            )}
           

            <form onSubmit={submitQuestion}>

                  {subTopic && <h3>Assessment Test</h3>}

                  {question.map((questionContent, index) => (
                    <div key={index}>
                      <div>
                        <p>{questionContent.question}</p>
                        <label>
                          <input
                            type="radio"
                            name={`question${index}`}
                            value={questionContent.ans1}
                          />
                          {questionContent.ans1}
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`question${index}`}
                            value={questionContent.ans2}
                          />
                          {questionContent.ans2}
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`question${index}`}
                            value={questionContent.ans3}
                          />
                          {questionContent.ans3}
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`question${index}`}
                            value={questionContent.ans4}
                          />
                          {questionContent.ans4}
                        </label>
                      </div>
                    </div>
                  ))}
                  {subTopic && question.length > 0 && (
                    <button type='submit' onClick={submitQuestion}>Submit</button>
                  )}
            </form>

            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {submitSuccess && <p style={{ color: 'green' }}>{submitSuccess}</p>}
            {retake && <p style={{ color: 'green' }}>{retake}</p>}

            {retake === 'You exceeded the pass mark but you can do better' && (
                  <div>
                  {yes === 'yes' ? (
                    ''
                  ) : (
                    // You can conditionally render content when the form is hidden
                      <div>
                      <h4>Do you want to retake the test?</h4>
                      <button type='submit' value='yes' onClick={handleYes}>
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

          </div>
          
        </div>
      )}
    </div>
  );
};

export default DetailsPage;
