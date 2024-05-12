const router = require("express").Router();
const jwt = require("jsonwebtoken");
const shortid = require('shortid');
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { db } = require('../config/db');



//....... JSON WEB TOKEN ............
const createToken = (payload) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  return jwt.sign(payload, jwtSecretKey, { expiresIn: "3d" });
};

//....... VERIFY JSON WEB TOKEN ............

// Middleware to authenticate the JWT token
function authenticateToken(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }


  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // Token has expired
        console.log('Token expired')
        return res.status(401).json({ error: 'Token expired' });
      } else {
        // Other JWT verification errors
        console.log('Forbidden')
        return res.status(403).json({ error: 'Forbidden' });
      }
    }


    req.user = user;
    next();
  });
}



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< EHIZUA STUDENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// .......................... STUDENT VERIFICATION EMAIL ..................................
router.post('/verify-student-email', async (req, res) => {
  try {
    const { emailToken, email } = req.body;

    if (!emailToken) {
      return res.status(404).json("EmailToken not found...");
    }

    db.query('SELECT * FROM Students WHERE email = ?', [email], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      if (result.length === 0) {
        return res.status(404).json("Student not found.");
      }


      if (result[0].isVerified === 1) {
        return res.status(400).json('Email has already been verified.');
      }

      if (result[0].emailToken === null && result[0].isVerified === 0) {
        return res.status(404).json("Your account has been suspended. Please contact Ehizua Hub Admin.");
      }

      // Update the emailToken and isVerified fields
      const updatedEmailToken = null;
      const isVerified = 1;
      const updateSql = `
          UPDATE Students
          SET emailToken = ?, isVerified = ?
          WHERE email = ?
        `;

      db.query(updateSql, [updatedEmailToken, isVerified, email], (err, updateResult) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        res.status(200).json(`Your Email (${email}) has been verified successfully.`);
      });
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// .............Emma...............  STUDENT AUTHORIZATION .......................................
router.post('/authorization', authenticateToken, async (req, res) => {
  const { id } = req.body;
  const localEmail = req.headers.localemail;
  const token = req.headers.token;


  db.query('SELECT * FROM Students WHERE email = ?', [localEmail], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');

    }

    if (result.length === 0) {
      // No matching record found, indicating incorrect email
      return res.status(401).json({ error: 'Invalid Student Details' });

    }
    const location = result[0].office


    const validated = await bcrypt.compare(id, result[0].id);
    if (!validated) {
      return res.status(404).json({ error: "Invalid Student Id" });

    }

    return res.json({ message: 'Logged In Successfully!!!', token: token, location: location });


  });
});


// ........................... STUDENT FORGET PASSWORD ..........................
router.post('/student_forgot_password', async (req, res) => {
  const { email } = req.body;
  try {
    db.query('SELECT * FROM Students WHERE email = ?', [email], async (err, result) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }
      // If there are no users with that email address in our database then we have to tell the client they don't exist!

      if (result.length === 0) {
        return res.status(401).json('No Student with Email found');
      }
      firstName = result[0].firstName
      lastName = result[0].lastName


      const salt = await bcrypt.genSalt(10);
      // Generate a unique ID based on email and name
      const id = `${email.substring(0, 2)}${shortid.generate()}${firstName.substring(0, 2)}`;
      const hashedPass = await bcrypt.hash(id, salt);

      // Update the emailToken and isVerified fields
      const updatedId = hashedPass;
      const updateSql = `
           UPDATE Students
           SET id = ?
           WHERE email = ?
         `;
      db.query(updateSql, [updatedId, email], async (err, updateResult) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }
        console.log(id)


        // ..........Send Email to Tutor ............

        // async function sendEmail() {
        //   const transporter = nodemailer.createTransport({
        //     host: 'mail.softwaredevemma.ng',
        //     port: 465,
        //     secure: true,
        //     auth: {
        //       user: 'main@softwaredevemma.ng',
        //       pass: 'bYFx.1zDu968O.'
        //     }

        //   });


        //   const info = await transporter.sendMail({
        //     from: 'Ehizua Hub <main@softwaredevemma.ng>',
        //     to: email,
        //     subject: 'Password Reset',
        //     html: `<p>Hello ${firstName} ${lastName} your student password has been reset successfully

        //         <h2>Your New Log in details are : </h2>
        //         <p> Email: ${email} </p>
        //         <p> Password: ${id} </p>`,

        //   })
        //   console.log("message sent: " + info.messageId);
        // }

        // await sendEmail();



        res.status(200).json(`Password has been sent to ${email}. `);

      });

    });

  } catch {
    return res.json('Something went wrong')
  }

})

// ..............Emma.............. STUDENT ENROLLED COURSE  ...............................
router.get('/enrolled-course', async (req, res) => {
  const email = req.headers.email

  try {
    db.query('SELECT * FROM StudentEnrolledCourses WHERE email = ?', [email], async (err, courses) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }

      return res.json({ courses });

    })

  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while retrieving course content' });
  }
});

// ...............Emma............ STUDENT ENROLLED COURSE  ...............................
router.get('/course-instructor/location', (req, res) => {

  const office = req.headers.location

  try {
    db.query('SELECT * FROM HubInstructors WHERE office = ?', [office], async (err, instructor) => {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving Hub Instructors' });
      }

      return res.json({ instructor });

    });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving Courses Instructors' });
  }
});

// ...............Emma............ STUDENT DETAILS  ...............................
router.get('/student-details', (req, res) => {

  const email = req.headers.email

  try {
    db.query('SELECT * FROM Students WHERE email = ?', [email], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving Hub Instructors' });
      }

      const location = result[0].location
      const firstName = result[0].firstName
      const lastName = result[0].lastName

      return res.json({ location: location, firstName, lastName });

    });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving Courses Instructors' });
  }
});

// ............................ STUDENT DISCOUNT COURSE SECTION ...............................
router.get('/course-advert', async (req, res) => {
  const location = req.headers.location

  try {
    db.query('SELECT * FROM CourseDiscount WHERE office = ?', [location], async (err, content) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }

      return res.status(200).json({ content });

    })

  } catch (error) {
    console.error('Error retrieving course content:', error);
    return res.status(500).json({ message: 'An error occurred while retrieving course content' });
  }
});

// ...............Emma............. STUDENT COURSE CONTENT ...............................
router.get('/student-course-content', async (req, res) => {

  const course = req.headers.courses;

  try {

    db.query('SELECT * FROM Contents WHERE course = ?', [course], async (err, content) => {
      return res.status(200).json({ content });
    })


  } catch (error) {
    console.error('Error retrieving course content:', error);
    return res.status(500).json({ message: 'An error occurred while retrieving course content' });
  }
});

// ..........Emma.......... CHECK COURSE CONTENT QUESTION AVAILABILITY ...............................
router.get('/verify-questions', async (req, res) => {

  const course = req.headers.courses;
  const mainTopic = req.headers.maintopic;
  const subTopic = req.headers.subtopic;

  try {

    db.query('SELECT * FROM Questions WHERE course = ? AND mainTopic = ? AND subTopic = ?', [course, mainTopic, subTopic], async (err, content) => {
      return res.status(200).json({ content });
    })


  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while retrieving course content' });
  }
});

// .................Emma............ GET QUESTIONS ..........................................
router.get('/questions', async (req, res) => {
  const subTopic = req.headers.sub_topic;
  const course = req.headers.course;
  const email = req.headers.email;

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Percentage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course VARCHAR(255) NOT NULL,
    subTopic VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    percentageScore VARCHAR(255) NOT NULL DEFAULT 0,
    totalScore VARCHAR(255) NOT NULL DEFAULT 0,
    isPassed BOOLEAN NOT NULL DEFAULT 0,
    updatedAt TIMESTAMP NOT NULL
  );
`;



  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });



  // Check if there is a valid authHeader, topic, course, and email
  if (!subTopic || !course || !email) {


    return res.status(400).json({ message: 'Missing required headers' });
  }

  db.query('SELECT * FROM Percentage WHERE subTopic = ? AND course = ? AND email = ?', [subTopic, course, email], async (err, response) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (response.length === 1 && response[0].percentageScore == 100) {
      return res.status(500).json({ retake: `You already got a 100% score in ${subTopic}. Do well to go to the next topic` });

    }


    if (response.length === 1) {
      const currentTime = Date.now();
      const submissionTime = response[0].updatedAt;
      const timeDifference = currentTime - submissionTime;
      const oneMinuteInMillis = 1 * 60 * 100000; // 1 minute in milliseconds

      const timeLeftInMillis = oneMinuteInMillis - timeDifference;
      if (timeDifference > oneMinuteInMillis) {



        db.query('SELECT * FROM Questions WHERE subTopic = ? AND course = ?', [subTopic, course], async (err, questionsResponse) => {
          if (err) {
            console.error('Error executing SQL query for questions:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }

          const questions = JSON.parse(JSON.stringify(questionsResponse));

          const totalQuestions = questionsResponse.length

          return res.json({ message: `${subTopic} Questions`, questions, totalQuestions: totalQuestions });
        });

      } else {
        const minutesLeft = Math.floor(timeLeftInMillis / (60 * 1000));
        const hoursLeft = Math.floor(minutesLeft / 60)
        const hoursMinLeft = Math.floor(minutesLeft % 60)
        const secondsLeft = Math.ceil((timeLeftInMillis - minutesLeft * 60 * 1000) / 1000);
        const timeLeftMessage = `${minutesLeft} min ${secondsLeft} sec`;
        if (hoursLeft > 1) {
          return res.status(500).json({ message: `Kindly Retake this test after ${hoursLeft}hrs ${hoursMinLeft}mins. Do well to revise through the topic again` });

        } else {
          return res.status(500).json({ message: `Kindly Retake this test after ${hoursLeft}hr ${hoursMinLeft}mins. Do well to revise through the topic again` });

        }

      }



    } else {


      db.query('SELECT * FROM Questions WHERE subTopic = ? AND course = ?', [subTopic, course], async (err, questionsResponse) => {
        if (err) {
          console.error('Error executing SQL query for questions:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }

        const questions = JSON.parse(JSON.stringify(questionsResponse));
        const totalQuestions = questionsResponse.length

        return res.json({ message: `${subTopic} Questions`, questions, totalQuestions: totalQuestions });
      });

    }
  });
});

// .................Emma............ REVIEW QUESTIONS AND ANSWER..........................................
router.get('/review-questions', async (req, res) => {
  const subTopic = req.headers.subtopic;
  const course = req.headers.course;
  const email = req.headers.email;


  db.query('SELECT * FROM SubmittedQuestions WHERE subTopic = ? AND course = ? AND email = ?', [subTopic, course, email], async (err, response) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    // const Answer = response[0].ans
    const AnswerArray = response[0].ans.split(', ')

    db.query('SELECT * FROM Questions WHERE subTopic = ? AND course = ?', [subTopic, course], async (err, questionsResponse) => {
      if (err) {
        console.error('Error executing SQL query for questions:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      const questions = JSON.parse(JSON.stringify(questionsResponse));

      const totalQuestions = questionsResponse.length

      return res.json({ message: `${subTopic} Questions`, questions, totalQuestions: totalQuestions, answer: AnswerArray });
    });

  });
});


// ............Emma..............SubmitedQuestion Students Question..........................................
router.post('/submit_questions', async (req, res) => {

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS SubmittedQuestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course VARCHAR(255) NOT NULL,
    subTopic VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    ans VARCHAR(255) NOT NULL
  );
`;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  const { selectedValueArray, subTopic, email, course } = req.body; // Array of question objects
  // Replace null values with periods
  const arrayWithPeriods = selectedValueArray.map(element => element === null ? '.' : element);

  // Convert array to string with default separator (comma)
  const selectedAnswers = arrayWithPeriods.join(', ');

  try {

    db.query(
      'SELECT * FROM SubmittedQuestions WHERE subTopic = ? AND course = ? AND email = ?',
      [subTopic, course, email],
      async (err, questionsResponse) => {


        if (questionsResponse.length > 0) {

          // Delete the existing submission's ans field
          db.query(
            'UPDATE SubmittedQuestions SET ans = ? WHERE subTopic = ? AND course = ? AND email = ?',
            [selectedAnswers, subTopic, course, email],
            async (err, result) => {
              if (err) {
                console.error('Error executing DELETE query:', err);
                return res.status(500).json({ message: 'Error deleting questions' });
              }

              return res.json({ message: 'Questions submitted successfully' });

            }
          );


        } else {
          // Insert a new submission
          db.query(
            'INSERT INTO SubmittedQuestions (subTopic, course, ans, email) VALUES (?, ?, ?, ?)',
            [subTopic, course, selectedAnswers, email],
            async (err, insertResponse) => {
              if (err) {
                console.error('Error executing INSERT query:', err);
                return res.status(500).json({ message: 'Error submitting questions' });
              }
              return res.json({ message: 'Questions submitted successfully' });
            }
          );
        }
      }
    );



  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error submitting questions' });
  }
});


// ..................Emma............. CALCULATE Test Score ..........................................
router.get('/check_test_score', async (req, res) => {
  const subTopic = req.headers.subtopic;
  const course = req.headers.course;
  const email = req.headers.email;
  const totalQuestions = req.headers.totalquestions;

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Percentage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course VARCHAR(255) NOT NULL,
    subTopic VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    percentageScore VARCHAR(255) NOT NULL DEFAULT 0,
    totalScore VARCHAR(255) NOT NULL DEFAULT 0,
    isPassed BOOLEAN NOT NULL DEFAULT 0,
    updatedAt TIMESTAMP NOT NULL
  );
`;



  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });


  try {
    // Fetch submitted answers from database
    db.query('SELECT * FROM SubmittedQuestions WHERE subTopic = ? AND course = ? AND email = ?', [subTopic, course, email], async (err, authAns) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error retrieving submitted questions' });
      }

      const answerArray = authAns[0].ans.split(', ')

      // Fetch correct answers for the given subTopic and course
      db.query('SELECT * FROM Questions WHERE subTopic = ? AND course = ?', [subTopic, course], (err, authQuestion) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error retrieving correct answers' });
        }

        let score = 0;


        // Iterate over each submitted question and compare with correct answer
        for (let i = 0; i < authQuestion.length; i++) {
          if (
            authQuestion[i]['correctAns'] === answerArray[i]
          ) {
            score += 1;

          }
        }


        // Calculate percentage score
        const cal = (score / parseInt(totalQuestions)) * 100;
        const percentageScore = cal.toFixed(1);
        let isPassed = parseFloat(percentageScore) >= 70;

        // Check if percentage record already exists for the user
        db.query('SELECT * FROM Percentage WHERE subTopic = ? AND course = ? AND email = ?', [subTopic, course, email], async (err, percentage) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error retrieving percentage record' });
          }

          if (percentage.length > 0) {
            // Update existing percentage record
            db.query(
              'UPDATE Percentage SET percentageScore = ?, totalScore = ?, isPassed = ?, updatedAt = CURRENT_TIMESTAMP WHERE subTopic = ? AND course = ? AND email = ?',
              [percentageScore, score, isPassed ? 1 : 0, subTopic, course, email],
              async (err, updateResponse) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ message: 'Error updating percentage record' });
                }
                console.log(score)
                return res.json({ message: `You Scored ${percentageScore}%.` });
              }
            );
          } else {
            // Insert new percentage record
            db.query(
              'INSERT INTO Percentage (subTopic, course, email, percentageScore, totalScore, isPassed) VALUES (?, ?, ?, ?, ?, ?)',
              [subTopic, course, email, percentageScore, score, isPassed ? 1 : 0],
              async (err, insertResponse) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ message: 'Error inserting new percentage record' });
                }

                if (insertResponse.affectedRows === 1) {
                  console.log(score)
                  return res.json({ message: `You Scored ${percentageScore}%.` });
                } else {
                  return res.status(500).json({ message: 'Failed to insert record' });
                }
              }
            );
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating or creating percentage' });
  }
});


// ...............Emma............. GET TEST SCORE .....................
router.get('/student-score', async (req, res) => {
  const { subtopic, course, email } = req.headers;

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Percentage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course VARCHAR(255) NOT NULL,
    subTopic VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    percentageScore VARCHAR(255) NOT NULL DEFAULT 0,
    totalScore VARCHAR(255) NOT NULL DEFAULT 0,
    isPassed BOOLEAN NOT NULL DEFAULT 0,
    updatedAt TIMESTAMP NOT NULL
  );
`;



  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });



  db.query('SELECT * FROM Percentage WHERE course = ? AND email = ? AND subTopic = ?', [course, email, subtopic], (err, score) => {
    if (err) {
      console.error('Error retrieving score:', err);
      return res.status(500).json({ error: 'An error occurred while retrieving the score.' });
    }

    if (score && score.length > 0) {
      return res.json({ message: `${score[0].percentageScore}`, score: `${score[0].totalScore}`, });
    } else {
      return res.json({ message: '0' });
    }
  });
});

// .............Emma............... GET TEST SCORE .....................
router.get('/test-status', async (req, res) => {
  const { course, email } = req.headers;

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Percentage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course VARCHAR(255) NOT NULL,
    subTopic VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    percentageScore VARCHAR(255) NOT NULL DEFAULT 0,
    totalScore VARCHAR(255) NOT NULL DEFAULT 0,
    isPassed BOOLEAN NOT NULL DEFAULT 0,
    updatedAt TIMESTAMP NOT NULL
  );
`;



  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });


  db.query('SELECT * FROM Percentage WHERE course = ? AND email = ?', [course, email], (err, score) => {
    if (err) {
      console.error('Error retrieving test status:', err);
      return res.status(500).json({ error: 'An error occurred while retrieving the test status.' });
    }

    if (score && score.length > 0) {
      return res.json({ message: score });
    } else {
      return res.json({ message: [] });
    }
  });
});

// ...........Emma...............  GET COURSE CURRICULUM ..........................................
router.get('/course-curriculum', async (req, res) => {
  const course = req.headers.course;

  try {

    db.query('SELECT * FROM Curriculum WHERE course = ?', [course], async (err, content) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching course curriculum' });
      }
      return res.json({ content });
    });


  } catch (error) {
    return res.status(500).json({ error: 'Unauthorized' });
  }
});

// ...........Emma...............  GET TOTAL CORRECT ANSWERS ..........................................
router.get('/total-passed-score', async (req, res) => {
  const { course, email } = req.headers;


  try {

    db.query('SELECT * FROM Percentage WHERE course = ? AND email = ?', [course, email], async (err, content) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching course curriculum' });
      }
      let totalScore = 0
      if (content.length > 0) {

        totalScore = content[0].totalScore
      }
      db.query('SELECT * FROM Questions WHERE course = ?', [course], async (err, questions) => {
        let totalQuestions = 0
        let percentageScore = 0
        if (questions.length > 0) {
          totalQuestions = questions.length
          percentageScore = (parseInt(totalScore) / parseInt(totalQuestions)) * 100
        }

        
        return res.json({ score: percentageScore });
      })
    });


  } catch (error) {
    return res.status(500).json({ error: 'Unauthorized' });
  }
});
// ...........Emma...............  GET TOTAL CORRECT ANSWERS ..........................................
router.get('/attendance', async (req, res) => {
  const { location, course, email } = req.headers;

  try {
    db.query('SELECT * FROM ClassReport WHERE location = ? AND course = ?', [location, course], async (err, content) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching course curriculum' });
      }
      
      let totalClass = 0;
      let classAttended = 0

      if (content.length > 0) {
        totalClass = content.length;
        for (let i = 0; i < content.length; i++) {
          let studentsAttended = content[i].studentsAttended.split(', ')
          for(let j = 0; j < studentsAttended.length; j++ ){

            if(email == studentsAttended[j]){
              classAttended+=1
            }
          }

        }
      }
      const percentageAttendance = (parseInt(classAttended) / parseInt(totalClass)) * 100


      return res.json({ attendance: percentageAttendance });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unauthorized' });
  }
});




module.exports = router;
