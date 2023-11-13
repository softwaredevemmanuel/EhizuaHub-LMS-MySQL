import React, { useState, useEffect } from 'react';

const Clock = () => {
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
    console.log("hahahahaha")
    setStartTest(false)
    setMyTime('00:00:00')
    localStorage.removeItem('StartTest');
    localStorage.removeItem('futureTime');
    setDisable(false)
    return;

  }else{
    setMyTime(result)
  }
}, [currentTime, storedFutureTime]);



const RunTimer =()=>{
  const futureTime = new Date(currentTime.getTime() + 1 * 60000); // 1 minutes in milliseconds
  localStorage.setItem('futureTime', futureTime.toLocaleTimeString());

  localStorage.setItem('StartTest', JSON.stringify({
    startTest: true,

  }));
  setStartTest(true)
  setDisable(true)
  
}



  return (
    <div>
        <button onClick={RunTimer} disabled={disable} >Start</button>


      {storedFutureTime ? (
        <>
          <h2>Time Remaining</h2>
          <h1>{myTime}</h1>
        </>
      ):(

        <div>
          <h2>TIME UP</h2>
          <h1>{myTime}</h1>
        </div>


      )}



    </div>
  );
};

export default Clock;
