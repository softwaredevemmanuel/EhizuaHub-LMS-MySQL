import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Question = () => {
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
  const [totalQuestions, setTotalQuestions] = useState('');
 

 



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



  const contentItem = content.find((item) => item.id == contentParam);



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
    fetchQuestion();
  };

  const handleYes = event => {
    event.preventDefault();
    setYes(event.target.value);
    retakeQuestion();

  };




  const handleNo = (event) => {
    event.preventDefault();
    setRetake(''); // Hide the form when "No" is clicked
  };

  const [currentTime, setCurrentTime] = useState(new Date());
  const [myTime, setMyTime] = useState('')
  const [startTest, setStartTest] = useState(localStorage.getItem('StartTest'))
  const storedFutureTime = localStorage.getItem('futureTime');


  useEffect(() => {

    if(startTest){

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }
  }, [currentTime, storedFutureTime]);


  const formattedTime = currentTime.toLocaleTimeString();



  // Function to subtract two time strings in the format HH:mm:ss
function subtractTimes(time1, time2) {
  // Convert time strings to seconds
  const seconds1 = timeStringToSeconds(time1);
  const seconds2 = timeStringToSeconds(time2);

  // Calculate the difference in seconds
  const differenceSeconds = seconds1 - seconds2;

  // Convert the difference back to HH:mm:ss format
  const result = secondsToTimeString(differenceSeconds);

  return result;
}

// Function to convert time string to seconds
function timeStringToSeconds(timeString) {
  if(storedFutureTime){
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }
  
}

// Function to convert seconds to time string
function secondsToTimeString(seconds) {
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const remainingMinutes = remainingSeconds % 60;
  const formattedResult = `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingMinutes)}`;
  return formattedResult;
}

// Function to pad single-digit numbers with a leading zero
function padZero(num) {
  return num < 10 ? `0${num}` : num;
}

// Example usage
const time1 = storedFutureTime;
const time2 = formattedTime;


const [disable, setDisable] = useState(true);

useEffect(() => {

  const result = subtractTimes(time1, time2);
  function timeStringToSeconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  const timeInSeconds = timeStringToSeconds(result);

  if (!Number.isInteger(timeInSeconds) || timeInSeconds <= 0) {
    // Timer has reached zero, do nothing
    setStartTest(false)
    setMyTime('00:00:00')
    localStorage.removeItem('StartTest');
    localStorage.removeItem('futureTime');
    setDisable(false)
    setSubTopic('')
    if(timeInSeconds == 0){
      submitQuestion()
    }
    return;

  }else{
    setMyTime(result)
    fetchQuestion();

  }
}, [currentTime, storedFutureTime]);




const RunTimer =()=>{
  const futureTime = new Date(currentTime.getTime() + 1 * 30000); // 1 minutes in milliseconds
  localStorage.setItem('futureTime', futureTime.toLocaleTimeString());

  localStorage.setItem('StartTest', JSON.stringify({
    startTest: true,

  }));
  setStartTest(true)
  setDisable(true)
  if(contentItem){
    setSubTopic(contentItem.subTopic)

  }

  
}


const submitQuestion = async event => {
  // event.preventDefault();
  setStartTest(false)
  setMyTime('00:00:00')
  localStorage.removeItem('StartTest');
  localStorage.removeItem('futureTime');
  setDisable(false)
  setSubTopic('')

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
        email: email,
        totalQuestions : totalQuestions

      },

    });

    setSubmitSuccess(submitResponse.data.message);
    setQuestions([])
    setSubTopic('')



  } catch (error) {
    console.error('Error sending questions:', error);
  }
};

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
    setTotalQuestions(response.data.totalQuestions)

  } catch (error) {
    if(error.response.data.message){
      setError(error.response.data.message);

      setStartTest(false)
      setMyTime('00:00:00')
      localStorage.removeItem('StartTest');
      localStorage.removeItem('futureTime');
      setDisable(false)
      setSubTopic('')

    }
    if(error.response.data.retake){
      setRetake(error.response.data.retake);

      setStartTest(false)
      setMyTime('00:00:00')
      localStorage.removeItem('StartTest');
      localStorage.removeItem('futureTime');
      setDisable(false)
      setSubTopic('')

    }
  }
}

  

  return (
    <div>
      <p>Only answers selected are counted. Work on that</p>
          <div>
        <button onClick={RunTimer} disabled={disable} >Start</button>


      {storedFutureTime ? (
        <>
          <h2>Time Remaining</h2>
          <h1>{myTime}</h1>
        </>
      ):(

        <div>
          <h1>{myTime}</h1>
        </div>


      )}

    </div>

      <div>

        {loading && <p>Loading...</p>}
        {contentItem && (
          <div>

            <h2>{contentItem.subTopic} Questions</h2>
            <div>
         
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
    </div>
  );
};

export default Question;
