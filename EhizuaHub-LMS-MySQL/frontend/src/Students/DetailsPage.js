import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
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
  const [retake, setRetake] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [score, setScore] = useState('');
  const [scoreSubTopic, setScoreSubTopic] = useState('');



  // Get the content parameter from the URL using useParams
  const { id: contentParam } = useParams();
  const { course: courseParams } = useParams();

  useEffect(() => {
    async function fetchCourseContent() {
      try {
        let login = JSON.parse(localStorage.getItem('Studentlogin'));
        const response = await axios.get('http://localhost:5000/api/students/student-course-content', {
          headers: {
            authHeader: login.authHeader,
            courses: courseParams
          },
        });
        setContent(response.data.content);
        setLoading(false);
        setCourse(courseParams)
        setEmail(login.email)
      } catch (error) {
        setError('Error retrieving content');
        setLoading(false);
      }
    }

    fetchCourseContent();

  }, [courseParams]);

  async function fetchScore() {
    try {
      let login = JSON.parse(localStorage.getItem('Studentlogin'));
      const response = await axios.get('http://localhost:5000/api/students/student-score', {
        headers: {
          course: 'FullStack Web Development',
          email: login.email,
          sub_topic: scoreSubTopic
        },
      });
      setScore(response.data.message);

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
      {showDetails && (
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
                ) : (
                  'View Score'
                )}
              </button>
              {score && (
                <button
                  type='submit'
                  value=''
                  onClick={(event) => setScore(event.target.value)}> hide
                </button>
              )}

            </form>

          )}
        </div>

      )}

      <div>

        {loading && <p>Loading...</p>}
        {contentItem && (
          <div>

            <h2>{contentItem.subTopic}</h2>
            <p>{contentItem.content}</p>
            <div>

              <form onSubmit={handleSubmit}>

                {/* <button type='submit' value={contentItem.subTopic}
                  onClick={(event) => setSubTopic(event.target.value)}>Take Test</button> */}
                  <button> <Link to={`/questions/${course}/${contentItem.id}`}>Take Test</Link></button>

              </form>

            


            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsPage;
