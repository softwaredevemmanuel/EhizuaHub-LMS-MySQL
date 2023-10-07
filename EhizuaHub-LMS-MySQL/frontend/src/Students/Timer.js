import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prevCountdown) => prevCountdown - 1);
      } else {
        clearInterval(timerInterval); // Stop the timer when it reaches 0
      }
    }, 1000);

    return () => {
      clearInterval(timerInterval); // Cleanup when the component unmounts
    };
  }, [countdown]);

  return (
    <div>
      <p>Countdown: {countdown}</p>
    </div>
  );
};

export default Timer;
