const router = require("express").Router();
const jwt = require("jsonwebtoken");
const shortid = require('shortid');
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { db } = require('../config/db');


//....... CREATE JSON WEB TOKEN ............
const createToken = (payload) => {

  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  return jwt.sign(payload, jwtSecretKey, { expiresIn: "10s" });

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



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< STAFF >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// ...............................  STAFF AUTHORIZATION .......................................
router.post('/authorization', authenticateToken, async (req, res) => {
  const { id } = req.body;
  const localEmail = req.headers.localemail;
  const token = req.headers.token;



  db.query('SELECT * FROM Staff WHERE email = ?', [localEmail], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');

    }

    if (result.length === 0) {
      // No matching record found, indicating incorrect email
      return res.status(401).json({ error: 'Invalid Staff Details' });

    }
    const location = result[0].office


    const validated = await bcrypt.compare(id, result[0].id);
    if (!validated) {
      return res.status(404).json({ error: "Invalid Staff Id" });

    }
    console.log(location)

    return res.json({ message: 'Logged In Successfully!!!', token: token, location: location });


  });
});


// ...........................STAFF FORGET ID ..........................
router.post('/forgot_id', async (req, res) => {

  const { email } = req.body;
  try {
    db.query('SELECT * FROM Staff WHERE email = ?', [email], async (err, result) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }

      if (result.length === 0) {
        return res.status(401).json({ error: 'No User with Email found' });
      }
      if (result[0].emailToken === null && result[0].isVerified === 0) {
        return res.status(404).json({ error: 'Your account has been suspended. Please contact Ehizua Hub Admin.' });
      }

      firstName = result[0].firstName
      lastName = result[0].lastName


      const salt = await bcrypt.genSalt(10);
      const randomId = shortid.generate()

      // Generate a unique Id based on email and name
      const id = `${email.substring(2, 4)}-${firstName.substring(0, 2)}-${randomId.substring(2, 3)}${randomId.substring(5, 6)}${randomId.substring(0, 1)}`;
      const hashedId = await bcrypt.hash(id, salt);




      // Update the emailToken and isVerified fields
      const updateSql = `
           UPDATE Staff
           SET id = ?
           WHERE email = ?
         `;
      db.query(updateSql, [hashedId, email], async (err, updateResult) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }


        // // ..........Send Email to Tutor ............
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
        //     html: `<p>Hello ${first_name} ${last_name} your Tutor Login password has been reset successfully

        //         <h2>Your New Log in details are : </h2>
        //         <p> Email: ${email} </p>
        //         <p> Password: ${id} </p>`,

        //   })
        //   console.log("message sent: " + info.messageId);
        // }

        // await sendEmail();

        console.log(id)



        res.status(200).json(`Your Login ID has been sent to ${email}. `);

      });

    });

  } catch {
    return res.json('Something went wrong')
  }

})

// ............................. GET INSTRUCTOR STATUS.................................
router.get('/instructor-status', (req, res) => {
  const email = req.headers.email;
  let hub_instructor = false
  let school_instructor = false



  db.query('SELECT * FROM Staff WHERE email = ?', [email], async (err, staff) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching curriculum data' });
    }
    if (staff[0].hubInstructor == 1) {
      hub_instructor = true

    }
    if (staff[0].schoolInstructor == 1) {
      school_instructor = true

    }

    res.json({ hubinstructor: hub_instructor, schoolInstructor: school_instructor });

  });

});


// ..............Emma.................STAFF APPLY FOR LEAVE ...................................
router.post('/leave-application', async (req, res) => {
  const leaveRequest = req.body

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS LeaveApplication (
      _id INT AUTO_INCREMENT PRIMARY KEY,
      fullName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      position VARCHAR(255) NOT NULL,
      leaveType VARCHAR(255) NOT NULL,
      leaveStartDate VARCHAR(255) NOT NULL,
      leaveEndDate VARCHAR(255) NOT NULL,
      purposeOfLeave TEXT NOT NULL,
      requestedLeave VARCHAR(255) NOT NULL,
      daysRemaining VARCHAR(255) NOT NULL,
      adminComment TEXT NOT NULL DEFAULT '',
      isApproved BOOLEAN DEFAULT 0
    );
  `;



  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  try {

    db.query('SELECT * FROM Staff WHERE email = ?', [leaveRequest.email], async (err, staff) => {
      const position = staff[0].position
      const allocatedLeave = staff[0].sickLeave
      const office = staff[0].office
      const fullName = `${staff[0].firstName} ${staff[0].lastName}`

      db.query('SELECT * FROM LeaveApplication WHERE email = ?', [leaveRequest.email], async (err, leaveapplication) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }
        const startDateString = leaveRequest.startDate;
        const endDateString = leaveRequest.returnDate;

        // Convert dates to Date objects
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        // Calculate the difference in milliseconds
        const differenceInMilliseconds = endDate.getTime() - startDate.getTime();

        // Convert milliseconds to days
        const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);

        
        if (leaveapplication.length > 0) {
          let lastRequest = leaveapplication[leaveapplication.length - 1]
          let daysTaken = lastRequest.daysRemaining
          const daysRemaining =  parseInt(daysTaken) -  differenceInDays


          const sql = `
                  INSERT INTO LeaveApplication (fullName, email, location, position, leaveType, leaveStartDate, leaveEndDate, purposeOfLeave, requestedLeave, daysRemaining)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;


          db.query(sql, [fullName, leaveRequest.email, office, position, leaveRequest.leaveType, leaveRequest.startDate, leaveRequest.returnDate, leaveRequest.content, differenceInDays, daysRemaining], async (err, result) => {

            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }

            return res.json({ message: 'Request sent successfully' });


          });
        } else {
      
          const daysRemaining = parseInt(allocatedLeave) - differenceInDays
         
          const sql = `
          INSERT INTO LeaveApplication (fullName, email, location, position, leaveType, leaveStartDate, leaveEndDate, purposeOfLeave, requestedLeave, daysRemaining)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

          db.query(sql, [fullName, leaveRequest.email, office, position, leaveRequest.leaveType, leaveRequest.startDate, leaveRequest.returnDate, leaveRequest.content, differenceInDays, daysRemaining], async (err, result) => {

            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }

            return res.json({ message: 'Request sent successfully' });


          });

        }
      });
    })

  } catch (error) {
    return res.status(500).json({ message: 'Error creating content' });
  }

})

// ..........................STAFF  VERIFICATION EMAIL ..................................
router.post('/verify-tutor-email', async (req, res) => {
  try {
    const { emailToken, email } = req.body;

    if (!emailToken) {
      return res.status(404).json("EmailToken not found...");
    }

    db.query('SELECT * FROM Staff WHERE email = ?', [email], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      if (result.length === 0) {
        return res.status(404).json("Staff not found.");
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
            UPDATE Staff
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

// .............................. STAFF LOGIN ....................................
router.post('/login', async (req, res) => {
  const { email, id } = req.body;


  db.query('SELECT * FROM Staff WHERE email = ?', [email], async (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }


    if (result.length === 0) {
      return res.status(401).json({ message: 'Wrong Email or Password' });
    }

    const validated = await bcrypt.compare(id, result[0].id);

    if (result[0].emailToken === null && result[0].isVerified === 0) {
      return res.status(404).json({ message: "Your account has been suspended. Please contact Ehizua Hub Admin." });
    }

    if (result[0].isVerified === 0) {
      return res.status(400).json({ message: 'Please verify your account.. Or contact Ehizua Hub Admin for assistance' });
    }


    if (!validated) {
      return res.status(404).json({ message: "Wrong Email or Password." });

    }
    const name = (`${result[0].first_name} ${result[0].last_name}`);
    const course = (result[0].course);
    const payload = { id: result[0]._id };
    const token = createToken(payload);

    if (result[0].hubInstructor == '1' && result[0].schoolInstructor == '1') {
      db.query('SELECT * FROM HubInstructors WHERE email = ?', [email], async (err, course1) => {
        db.query('SELECT * FROM SchoolInstructors WHERE email = ?', [email], async (err, course2) => {

          const courses1 = course1[0].courses
          const courses2 = course2[0].courses


          res.json({ token: token, staff: name, staff_authorization: result[0].id, hubCourse: courses1, schoolCourse: courses2, office: result[0].office, email: email, instructor: 'hub_SchoolInstructor' });
        })


      })

    }
    else if (result[0].hubInstructor == "1") {

      db.query('SELECT * FROM HubInstructors WHERE email = ?', [email], async (err, courses) => {

        const AllCourses = courses[0].courses
        res.json({ token: token, staff: name, staff_authorization: result[0].id, hubCourse: AllCourses, office: result[0].office, email: email, instructor: 'hubInstructor' });

      })

    }
    else if (result[0].schoolInstructor == "1") {
      db.query('SELECT * FROM SchoolInstructors WHERE email = ?', [email], async (err, courses) => {
        const AllCourses = courses[0].courses
        res.json({ token: token, staff: name, staff_authorization: result[0].id, schoolCourse: AllCourses, office: result[0].office, email: email, instructor: 'schoolInstructor' });

      })
    } else {
      res.json({ token: token, staff: name, staff_authorization: result[0].id, course: course, office: result[0].office, email: email, instructor: false });

    }

  });
});


// .............Emma.............. STAFF DETAILS ..........................................

router.get('/details', (req, res) => {

  const { email } = req.headers

  try {
    db.query('SELECT * FROM Staff WHERE email = ?', [email], async (err, staff) => {
      if (err) {
        console.error('Error retrieving Staff:', err); // Log the error
        return res.status(500).json({ message: 'Error retrieving Staff' });
      }

      return res.json({ staff, allocatedLeave: staff[0].sickLeave });
    });
  } catch (error) {
    console.error('Error retrieving Staff:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving Staff' });
  }
});

// .............Emma............. STAFF FILTER ALL LEAVE REQUEST ..........................................
router.get('/leave-request', (req, res) => {


  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS LeaveApplication (
      _id INT AUTO_INCREMENT PRIMARY KEY,
      fullName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      position VARCHAR(255) NOT NULL,
      leaveType VARCHAR(255) NOT NULL,
      leaveStartDate VARCHAR(255) NOT NULL,
      leaveEndDate VARCHAR(255) NOT NULL,
      purposeOfLeave TEXT NOT NULL,
      requestedLeave VARCHAR(255) NOT NULL,
      daysRemaining VARCHAR(255) NOT NULL,
      adminComment TEXT NOT NULL DEFAULT '',
      isApproved BOOLEAN DEFAULT 0
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });


  const { email } = req.headers

  try {
    db.query('SELECT * FROM LeaveApplication WHERE email = ?', [email], async (err, leave) => {
      if (err) {
        console.error('Error retrieving leav application:', err); // Log the error
        return res.status(500).json({ message: 'Error retrieving leav application' });
      }
      const lastLeave = leave[leave.length - 1]
      const daysRemaining = lastLeave.daysRemaining
      
      return res.json({ leave, daysRemaining});
    });
  } catch (error) {
    console.error('Error retrieving leave application:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving tutors' });
  }
});


// ................Emma........... POST NEW FEEDBACK OR COMPLAINTS ...................................
router.post('/feedback_complaints', async (req, res) => {
  const { email, title, starsArray, reportType, content } = req.body

  stars = starsArray.join(', ')

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Complaints (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      complaintId VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL DEFAULT '',
      readComplaint BOOLEAN NOT NULL DEFAULT 0,
      createdAt TIMESTAMP
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  const createFeedbackQuery = `
    CREATE TABLE IF NOT EXISTS Feedback (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      star VARCHAR(255) NOT NULL,
      feedbackId VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP
    );
  `;


  db.query(createFeedbackQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });
  const uniqueid = `${email.substring(0, 5)}${shortid.generate()}${title.substring(0, 2)}`;


  try {
    if (reportType == 'complaints') {

      const sql = `
          INSERT INTO Complaints (email, title, content, complaintId, status)
          VALUES (?, ?, ?, ?, ?)
        `;


      db.query(sql, [email, title, content, uniqueid, 'main'], async (err, result) => {

        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        return res.json({ message: 'Your complaints have been sent' });
      });
    }

    if (reportType == 'feedback') {

      const sql = `
      INSERT INTO Feedback (email, star, content, feedbackId)
      VALUES (?, ?, ?, ?)
    `;

      db.query(sql, [email, stars, content, uniqueid], async (err, result) => {

        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        return res.json({ message: 'Your Review has been sent' });
      });
    }




  } catch (error) {
    return res.status(500).json({ message: 'Error creating content' });
  }

})

// ................Emma........... REPLY COMPLAINTS ...................................
router.post('/reply_complaints', async (req, res) => {
  const { email, title, reportType, content, uniqueid } = req.body

  try {
    if (reportType == 'complaints') {

      const sql = `
          INSERT INTO Complaints (email, title, content, complaintId, status)
          VALUES (?, ?, ?, ?, ?)
        `;


      db.query(sql, [email, title, content, uniqueid, 'reply'], async (err, result) => {

        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        return res.json({ message: 'Your complaints have been sent' });
      });
    }


  } catch (error) {
    return res.status(500).json({ message: 'Error creating content' });
  }

})

// ................Emma............GET FEEDBACK OR COMPLAINTS ...................................

router.get('/feedback_complaints', async (req, res) => {
  const email = req.headers.email

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Complaints (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      complaintId VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL DEFAULT '',
      readComplaint BOOLEAN NOT NULL DEFAULT 0,
      createdAt TIMESTAMP
    );
  `;


  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  const createFeedbackQuery = `
    CREATE TABLE IF NOT EXISTS Feedback (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      content VARCHAR(255) NOT NULL,
      star VARCHAR(255) NOT NULL,
      feedbackId VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP
    );
  `;


  db.query(createFeedbackQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });


  try {
    db.query('SELECT * FROM Complaints WHERE email = ? AND status = ?', [email, 'main'], async (err, complaints) => {
      if (err) {
        console.error('Error retrieving leav complaints:', err); // Log the error
      }
      db.query('SELECT * FROM Feedback WHERE email = ?', [email], async (err, feedback) => {
        return res.json({ complaints, feedback });

      })
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error creating content' });
  }

})

// ................Emma............FEEDBACK OR COMPLAINTS DETAILS...................................

router.get('/feedback_complaints-details', async (req, res) => {
  const id = req.headers.id

  try {
    db.query('SELECT * FROM Complaints WHERE complaintId = ?', [id], async (err, complaints) => {
      if (err) {
        console.error('Error retrieving leav complaints:', err); // Log the error
      }
      db.query('SELECT * FROM Feedback WHERE feedbackId = ?', [id], async (err, feedback) => {
        return res.json({ complaints, feedback });

      })
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error creating content' });
  }

})

module.exports = router;
