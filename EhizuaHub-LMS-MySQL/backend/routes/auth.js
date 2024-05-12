const router = require("express").Router();
const shortid = require('shortid');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { db } = require('../config/db'); // replace 'yourModuleName' with the actual path to the module

// app.post('/create_database', function (req, res) {
//   const {school} = req.body
//   let sql = `CREATE DATABASE ${school}`;
//   db.query(sql, (err, result) => {
//     if(err) throw err;
//     console.log(result)
//     res.send("Database Created......");
//   });
// });



// app.post('/insert', (req, res) =>{
//   db.query('INSERT INTO AdminAuthorization SET ?', {
//     email:"admin@gmail.com",  
//     password :"1234",
//   },(err) => {
//     if (err) throw new Error(err);
//     console.log('1 record inserted');
//     res.end();
//   })
// })




// app.post('/insert', (req, res) =>{
//   db.query('INSERT INTO Contents SET ?', {
//     topic:"Lense",  
//     content :"Photography Page React page This is the React World page we will be creating",
//     course: "Photography"
//   },(err) => {
//     if (err) throw new Error(err);
//     console.log('1 record inserted');
//     res.end();
//   })
// })

// app.post('/insert', (req, res) =>{
//   db.query('INSERT INTO Questions SET ?', {
//     topic:"html",  
//     question :"What is a div",
//     course: "FullStack",
//     ans1: "Container",
//     ans2: "door",
//     ans3: "window",
//     ans4: "house",
//     correctAns: "Container"
//   },(err) => {
//     if (err) throw new Error(err);
//     console.log('1 record inserted');
//     res.end();
//   })
// })

// app.post('/insert', (req, res) =>{
//   db.query('INSERT INTO Percentage SET ?', {
//     topic:"html",  
//     email :"eokereke47@gmail.com",
//     course: "FullStack",
//     isPassed: true,
//     score: 100,

//   },(err) => {
//     if (err) throw new Error(err);
//     console.log('1 record inserted');
//     res.end();
//   })
// })


// app.post('/insert', (req, res) =>{
//   db.query('INSERT INTO SubmittedQuestions SET ?', {
//     topic:"html",  
//     question : "What is p tag",
//     email :"eokereke47@gmail.com",
//     course: "FullStack",
//     ans: "paragraph",
//     isPassed: false,


//   },(err) => {
//     if (err) throw new Error(err);
//     console.log('1 record inserted');
//     res.end();
//   })
// })


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<ADMIN>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//   router.get('/isadmin', isAdmin, async (req, res) =>{
//     const authHeader = req.headers;
//     console.log(authHeader)
//     return res.json({message: 'Authorised'})
//   })


//....... JSON WEB TOKEN ............
const createToken = (payload) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  return jwt.sign(payload, jwtSecretKey, { expiresIn: "1day" });
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

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ADMIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// ...............................  USER LOGIN .......................................
router.post('/login', async (req, res) => {
  const { email, password } = req.body;


  db.query('SELECT * FROM LoginAuthorization WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }



    if (result.length === 0) {
      // No matching record found, indicating incorrect email or password
      res.status(401).json({ error: 'Incorrect email or password' });
      return;
    }
    const validated = await bcrypt.compare(password, result[0].password);
    if (!validated) {
      return res.status(404).json({ error: "Wrong Email or Password." });

    }
    const user = result[0].user

    const firstName = result[0].firstName;
    const lastName = result[0].lastName;
    const title = result[0].title;

    const payload = { password: crypto.randomBytes(16).toString("hex") };
    const token = createToken(payload);


    res.json({ user: user, token: token, firstName: firstName, lastName: lastName, title: title, email: email });


  });
});

// ...........................USER FORGET PASSWORD ..........................
router.post('/forgot_password', async (req, res) => {
  
  const { email } = req.body;
  try {
    db.query('SELECT * FROM LoginAuthorization WHERE email = ?', [email], async (err, result) => {
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
      // const id = `${email.substring(2, 4)}-${firstName.substring(0, 2)}-${randomId.substring(2, 3)}${randomId.substring(5, 6)}${randomId.substring(0, 1)}`;
      // const hashedId = await bcrypt.hash(id, salt);

      // Generate a unique Id based on email and name
      const password = `${email.substring(0, 2)}${shortid.generate()}${firstName.substring(0, 2)}`;
      const hashedPass = await bcrypt.hash(password, salt);


      // Update the emailToken and isVerified fields
      const updateSql = `
           UPDATE LoginAuthorization
           SET password = ?
           WHERE email = ?
         `;
      db.query(updateSql, [hashedPass, email], async (err, updateResult) => {
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

        console.log(password)



        res.status(200).json(`Password has been sent to ${email}. `);

      });

    });

  } catch {
    return res.json('Something went wrong')
  }

})

// ...............................  ADMIN AUTHORIZATION .......................................
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

    const validated = await bcrypt.compare(id, result[0].id);
    if (!validated) {
      return res.status(404).json({ error: "Invalid Staff Id" });

    }

    return res.json({ message: 'Logged In Successfully!!!', token: token });


  });
});


// ............................. ADMIN REGISTER OFFICE ...............................
router.post('/register-office', async (req, res) => {
  const { officeName, officePhoneNumber, officeEmail, state, officeAddress, email } = req.body;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Offices (
      _id INT AUTO_INCREMENT PRIMARY KEY,
      officeName VARCHAR(255) NOT NULL,
      officePhone VARCHAR(255) NOT NULL,
      officeEmail VARCHAR(255) NOT NULL,
      officeAddress VARCHAR(255) NOT NULL
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  // Check if the Office with the same Name already exists
  db.query(`SELECT * FROM Offices WHERE officeName = ?`, [officeName], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length !== 0) {
      return res.status(400).json({ message: 'Office with Name already exists' });
    }


    const sql = `
        INSERT INTO Offices (officeName, officePhone, officeEmail, officeAddress)
        VALUES (?, ?, ?, ?)
      `;

    const newOfficeLoaction = `${officeName} ${state}`

    db.query(sql, [newOfficeLoaction, officePhoneNumber, officeEmail, officeAddress], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      db.query(`SELECT * FROM Staff WHERE email = ?`, [email], async (err, staff) => {
        // Store this activity in the history section
        db.query('SELECT * FROM History', async (err, history) => {

          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
          const title = `${officeName} office was created in ${state}`
          const userEmail = `${email}`
          const fullName = `${staff[0].first_name} ${staff[0].last_name}`

          const sql = `
              INSERT INTO History (title, userEmail, fullName)
              VALUES (?, ?, ?)
            `;

          db.query(sql, [title, userEmail, fullName], async (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }

            return res.json({ message: 'Office Registered successfully' });
          });


        })
      })



    });
  });
});



// ............................. ADMIN GET LIST OF OFFICES ................................
router.get('/all_offices', authenticateToken, async (req, res) => {

  db.query('SELECT * FROM Offices', async (err, result) => {
    return res.json({ message: result });

  })
})
// ............................. ADMIN GET HISTORY ACTIVITIES ................................
router.get('/history', authenticateToken, async (req, res) => {

  db.query('SELECT * FROM History', async (err, result) => {
    return res.json({ message: result });

  })
})


// ............................. ADMIN CREATE TIME TABLE ...............................
router.post('/time-table', async (req, res) => {
  const {adminEmail, location, startTime, endTime, mondayArray, tuesdayArray, wednesdayArray, thursdayArray, fridayArray, saturdayArray, courseBreak } = req.body;
  const monday = mondayArray.join(', ');
  const tuesday = tuesdayArray.join(', ');
  const wednesday = wednesdayArray.join(', ');
  const thursday = thursdayArray.join(', ');
  const friday = fridayArray.join(', ');
  const saturday = saturdayArray.join(', ');

  const createTimeTableQuery = `
    CREATE TABLE IF NOT EXISTS TimeTable (
      _id INT AUTO_INCREMENT PRIMARY KEY,
      location VARCHAR(500) NOT NULL,
      startTime VARCHAR(50) NOT NULL,
      endTime VARCHAR(50) NOT NULL,
      monday TEXT NOT NULL DEFAULT '',
      tuesday TEXT NOT NULL DEFAULT '',
      wednesday TEXT NOT NULL DEFAULT '',
      thursday TEXT NOT NULL DEFAULT '',
      friday TEXT NOT NULL DEFAULT '',
      saturday TEXT NOT NULL DEFAULT ''
    );
  `;

  db.query(createTimeTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  // Check if the Office with the same Name already exists
  db.query(`SELECT * FROM TimeTable WHERE location = ?`, [location], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if(result.length >= 2){
      const lastRow = result.length
      let mystarttime = result[lastRow - 1].startTime
      if(mystarttime > startTime){
        return res.status(400).json({ message: `The next Start time ${startTime} cannot be less than the previous Start Time ${mystarttime}` });

      }
    }
    
    


    db.query(`SELECT * FROM TimeTable WHERE startTime = ?`, [startTime], async (err, time) => {
      if (time.length !== 0) {
        return res.status(400).json({ message: `Start time ${startTime} already exists` });
      }
        const sql = `
        INSERT INTO TimeTable (startTime, endTime, monday, tuesday,wednesday, thursday, friday, saturday, location)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;


         db.query(sql, [startTime, endTime, monday, tuesday, wednesday, thursday, friday, saturday, location, courseBreak], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      db.query(`SELECT * FROM Staff WHERE email = ?`, [adminEmail], async (err, staff) => {
        // Store this activity in the history section
        db.query('SELECT * FROM History', async (err, history) => {

          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
          const title = `Time table was created`
          const userEmail = `${adminEmail}`
          const fullName = `${staff[0].firstName} ${staff[0].lastName}`

          const sql = `
              INSERT INTO History (title, userEmail, fullName)
              VALUES (?, ?, ?)
            `;

          db.query(sql, [title, userEmail, fullName], async (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }

            return res.json({ message: 'Time Table Created successfully' });
          });

        })
      })



         });
      })

  });
});

// ............................. ADMIN GET TIME TABLE BY LOCATION ................................
router.get('/time-table', async (req, res) => {
  const location = req.headers.location
 
  db.query('SELECT * FROM TimeTable WHERE location = ?', [location],async (err, result) => {
    return res.json({ message: result });

  })
})

// ............................. ADMIN EDIT TIME TABLE ................................
router.put('/time-table/:id', async (req, res) => {
  const timeTableId = req.params.id;
  const {adminEmail, location, startTime, endTime, mondayArray, tuesdayArray, wednesdayArray, thursdayArray, fridayArray, saturdayArray, courseBreak } = req.body;
  const monday = mondayArray.join(', ');
  const tuesday = tuesdayArray.join(', ');
  const wednesday = wednesdayArray.join(', ');
  const thursday = thursdayArray.join(', ');
  const friday = fridayArray.join(', ');
  const saturday = saturdayArray.join(', ');

  const createHistoryTableQuery = `
  CREATE TABLE IF NOT EXISTS History (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    userEmail VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    details VARCHAR(255) NOT NULL DEFAULT '',
    createdAt TIMESTAMP NOT NULL
    );
`;

 // Check if the Office with the same Name already exists
 db.query(`SELECT * FROM TimeTable WHERE location = ?`, [location], async (err, result) => {
  if (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
 // prevent from creating timetable with same start time or 
  if(result.length >= 2){
    const lastRow = result.length
    let mystarttime = result[lastRow - 1].startTime
    if(mystarttime > startTime){
      return res.status(400).json({ message: `The next Start time ${startTime} cannot be less or equal to the current Start Time ${mystarttime}` });

    }
  }

      db.query(createHistoryTableQuery, (err) => {
        if (err) {
          console.error(err);
          throw new Error('Error creating table');
        }
      });

      const sql = `
      UPDATE TimeTable
      SET
        location = ?,
        startTime = ?,
        endTime = ?,
        monday = ?,
        tuesday = ?,
        wednesday = ?,
        thursday = ?,
        friday = ?,
        saturday = ?
        
      WHERE _id = ?
    `;

      db.query(
        sql,
        [location, startTime, endTime, monday, tuesday, wednesday, thursday, friday, saturday, timeTableId],
        async (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Office not found' });
          }

          db.query(`SELECT * FROM Staff WHERE email = ?`, [adminEmail], async (err, staff) => {
            // Store this activity in the history section
            db.query('SELECT * FROM History', async (err, history) => {

              if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
              }
              const title = `${location} TIme Table was updated`
              const userEmail = `${adminEmail}`
              const fullName = `${staff[0].firstName} ${staff[0].lastName}`
              const details = `Monday: ${monday} / Tuesday: ${tuesday} / Wednesday: ${wednesday} / Thursday: ${thursday} / Friday: ${friday} / Saturday: ${saturday}`

              const sql = `
                  INSERT INTO History (title, userEmail, fullName, details)
                  VALUES (?, ?, ?, ?)
                `;

              db.query(sql, [title, userEmail, fullName, details], async (err, result) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send('Internal Server Error');
                }

                return res.json({ message: 'Time Table updated successfully' });
              });


            })
          })
        }
      );
 })

})


router.delete('/time-table/:id', async (req, res) => {
  const timeTableIdString = req.params.id;
  
  // convert the timeTableIdString to an integer with a radix of 10 (decimal). 
  const timeTableId = parseInt(timeTableIdString, 10);  
  const adminEmail =req.headers.email

 
  const createHistoryTableQuery = `
  CREATE TABLE IF NOT EXISTS History (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    userEmail VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    details VARCHAR(255) NOT NULL DEFAULT '',
    createdAt TIMESTAMP NOT NULL
    );
`;

      db.query(createHistoryTableQuery, (err) => {
        if (err) {
          console.error(err);
          throw new Error('Error creating table');
        }
      });

     
      db.query(`DELETE FROM TimeTable WHERE _id = ?`, [timeTableId], async (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }

        

          db.query(`SELECT * FROM Staff WHERE email = ?`, [adminEmail], async (err, staff) => {
            // Store this activity in the history section
            db.query('SELECT * FROM History', async (err, history) => {

              if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
              }
              const title = `Time Table was Deleted`
              const userEmail = `${adminEmail}`
              const fullName = `${staff[0].firstName} ${staff[0].lastName}`
              const details = ``

              const sql = `
                  INSERT INTO History (title, userEmail, fullName, details)
                  VALUES (?, ?, ?, ?)
                `;

              db.query(sql, [title, userEmail, fullName, details], async (err, result) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send('Internal Server Error');
                }

                return res.json({ message: 'Time Table deleted successfully' });
              });


            })
          })
        }
      );


})


// ............................. ADMIN GET OFFICES DETAILS................................
router.get('/office-details', async (req, res) => {
  const location = req.headers.location;

  db.query('SELECT * FROM Offices WHERE officeName = ?', [location], async (err, result) => {
    return res.json({ message: result[0] });

  })
})

// ............................. ADMIN UPDATE OFFICE DETAILS ................................
router.put('/update-office/:id', async (req, res) => {
  const locationId = req.params.id;
  const { officeName, officePhoneNumber, officeEmail, officeAddress, email } = req.body;

  const createHistoryTableQuery = `
  CREATE TABLE IF NOT EXISTS History (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    userEmail VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    details VARCHAR(255) NOT NULL DEFAULT '',
    createdAt TIMESTAMP NOT NULL
    );
`;

  db.query(createHistoryTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  const sql = `
      UPDATE Offices
      SET
        officeName = ?,
        officePhone = ?,
        officeEmail = ?,
        officeAddress = ?
        
      WHERE _id = ?
    `;


  db.query(
    sql,
    [officeName, officePhoneNumber, officeEmail, officeAddress, locationId],
    async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Office not found' });
      }

      db.query(`SELECT * FROM Staff WHERE email = ?`, [email], async (err, staff) => {
        // Store this activity in the history section
        db.query('SELECT * FROM History', async (err, history) => {

          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
          const title = `${officeName} was updated`
          const userEmail = `${email}`
          const fullName = `${staff[0].first_name} ${staff[0].last_name}`
          const details = `${officeName} / ${officeEmail} / ${officePhoneNumber} / ${officeAddress}`

          const sql = `
              INSERT INTO History (title, userEmail, fullName, details)
              VALUES (?, ?, ?, ?)
            `;

          db.query(sql, [title, userEmail, fullName, details], async (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }

            return res.json({ message: 'Location updated successfully' });
          });


        })
      })
    }
  );
});

// ............................ADMIN CREATE STAFF ............................
router.post('/create-staff', async (req, res) => {

  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Staff (
        _id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(20) NOT NULL,
        user VARCHAR(20) NOT NULL,
        firstName VARCHAR(20) NOT NULL,
        lastName VARCHAR(20) NOT NULL,
        middleName VARCHAR(20) NOT NULL DEFAULT '',
        email VARCHAR(255) NOT NULL,
        dateOfBirth VARCHAR(255) NOT NULL,
        dateEmployed VARCHAR(255) NOT NULL DEFAULT '',
        office VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        selectedJobType VARCHAR(255) NOT NULL,
        hubInstructor VARCHAR(255) NOT NULL DEFAULT 0,
        schoolInstructor VARCHAR(255) NOT NULL DEFAULT 0,
        phone VARCHAR(255) NOT NULL,
        salary VARCHAR(255) NOT NULL,
        accountNumber VARCHAR(255) NOT NULL,
        bankName VARCHAR(255) NOT NULL,
        sickLeave VARCHAR(255) NOT NULL,
        id VARCHAR(255) NOT NULL,
        HMO VARCHAR(255) NOT NULL DEFAULT 10,
        homeAddress VARCHAR(255) NOT NULL,
        nextOfKinFullName VARCHAR(255) NOT NULL,
        nextOfKinPhoneNumber VARCHAR(255) NOT NULL,
        nextOfKinAddress VARCHAR(255) NOT NULL,
        isVerified BOOLEAN NOT NULL DEFAULT 0,
        createdAt TIMESTAMP NOT NULL
      );
      `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  const createHubInstructorTable = `
    CREATE TABLE IF NOT EXISTS HubInstructors (
      _id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      courses VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      office VARCHAR(255) NOT NULL,
      phone VARCHAR(255) NOT NULL,
      isAdmin VARCHAR(255) NOT NULL DEFAULT 0
    );
    `;

  db.query(createHubInstructorTable, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });


  const createSchoolInstructorTable = `
    CREATE TABLE IF NOT EXISTS SchoolInstructors (
      _id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      courses VARCHAR(255) NOT NULL DEFAULT "",
      email VARCHAR(255) NOT NULL,
      office VARCHAR(255) NOT NULL,
      phone VARCHAR(255) NOT NULL,
      school VARCHAR(255) NOT NULL DEFAULT "",
      isAdmin VARCHAR(255) NOT NULL DEFAULT 0
    
    );
    `;


  db.query(createSchoolInstructorTable, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  const createLoginAuthorizationTable = `
  CREATE TABLE IF NOT EXISTS LoginAuthorization (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(200) NOT NULL,
    user VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL DEFAULT '',
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL
  
  );
  `;


  db.query(createLoginAuthorizationTable, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  const { title, user, firstName, middleName, lastName, email, dateOfBirth, office, position, selectedJobType, hubInstructor, schoolInstructor, school, phone, salary, accountNumber, bankName, sick_leave, homeAddress, nextOfKinFullName, nextOfKinNumber, nextOfKinAddress, hubCourse, schoolCourse } = req.body;

  // Check if the Staff with the same email already exists

  db.query('SELECT * FROM Staff WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length !== 0) {
      return res.status(400).json({ message: 'Staff with email already exists' });
    }

    const salt = await bcrypt.genSalt(10);

    const id = `${email.substring(0, 2)}${shortid.generate()}${firstName.substring(0, 2)}`;
    const hashedPass = await bcrypt.hash(id, salt);

    const password = `${email.substring(2, 4)}-${firstName.substring(0, 2)}-${id.substring(2, 3)}${id.substring(5, 6)}${id.substring(0, 1)}`;
    const hashedId = await bcrypt.hash(password, salt);

    const sql = `
            INSERT INTO Staff (title, user, firstName, middleName, lastName, email, dateOfBirth, office, position, selectedJobType, hubInstructor, schoolInstructor, phone, salary, accountNumber, bankName, sickLeave, id, homeAddress, nextOfKinFullName, nextOfKinPhoneNumber, nextOfKinAddress )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
    db.query(sql, [title, user, firstName, middleName, lastName, email, dateOfBirth, office, position, selectedJobType, hubInstructor, schoolInstructor, phone, salary, accountNumber, bankName, sick_leave, hashedId, homeAddress, nextOfKinFullName, nextOfKinNumber, nextOfKinAddress], async (err, result) => {

      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }


      // Convert checkedCourses array to a string
      const hubCourseInString = hubCourse.join(', ');
      const schoolCourseInString = schoolCourse.join(', ');

      // Convert checkedSchool array to a string
      const schoolString = school.join(', ');

      if (hubInstructor != "false") {
        db.query('SELECT * FROM HubInstructors WHERE email = ?', [email], async (err, result) => {
          const hubInstructor = `
              INSERT INTO HubInstructors (first_name, last_name, email, courses, office, phone)
              VALUES (?, ?, ?, ?, ?, ?)
            `;


          let hubCousreStatus
          if (hubCourse.length == 0) {
            hubCousreStatus = "NULL"
          } else {
            hubCousreStatus = hubCourseInString
          }

          db.query(hubInstructor, [firstName, lastName, email, hubCousreStatus, office, phone], async (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }
          })

        });
      }

      if (schoolInstructor != "false") {
        db.query('SELECT * FROM SchoolInstructors WHERE email = ?', [email], async (err, result) => {
          const SchoolInstructor = `
            INSERT INTO SchoolInstructors (first_name, last_name, email, courses, office, phone, school)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;

          let schoolCousreStatus
          if (schoolCourse.length == 0) {
            schoolCousreStatus = "NULL"
          } else {
            schoolCousreStatus = schoolCourseInString
          }

          let schoolStatus
          if (school.length == 0) {
            schoolStatus = ""
          } else {
            schoolStatus = schoolString
          }
          db.query(SchoolInstructor, [firstName, lastName, email, schoolCousreStatus, office, phone, schoolStatus], async (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }
          })

        });
      }

      db.query('SELECT * FROM LoginAuthorization WHERE email = ?', [email], async (err, result) => {
        const LoginAuthorization = `
          INSERT INTO LoginAuthorization (email, password, user, title, firstName, lastName)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(LoginAuthorization, [email, hashedPass, user, title, firstName, lastName], async (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
        })

      });



      // // Create and send an email in an async function
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
      //     subject: 'Login Details',
      //     html: `<p>Hello ${first_name} ${last_name}, verify your email by clicking on this link.. </p>
      //       <a href='${process.env.CLIENT_URL}/verify-tutor-email?emailToken=${emailToken}&email=${email}'> Verify Your Email </a>
      //       <h2>Your Subsequent Tutor Log in details are : </h2>
      //       <p> Email: ${email} </p>
      //       <p> Password: ${id} </p>`,
      //   });

      //   console.log("message sent: " + info.messageId);
      // }

      // // Call the async function to send the email
      // await sendEmail();

      console.log(id)
      console.log(password)


      return res.json({ message: 'Staff created successfully' });


    })
  })
});

// .............................. ADMIN GET ALL STAFF DETAILS ..........................................
router.get('/staff', authenticateToken, async (req, res) => {

  try {
    db.query('SELECT * FROM Staff', async (err, staff) => {
      if (err) {
        console.error('Error retrieving Staff:', err); // Log the error
        return res.status(500).json({ message: 'Error retrieving Staff' });
      }
      const totalStaff = staff.length

      return res.json({ totalStaff, staff });
    });
  } catch (error) {
    console.error('Error retrieving Staff:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving Staff' });
  }
});

// .............................. ADMIN GET  STAFF BY LOCATION ..........................................
router.get('/staff-by-location', (req, res) => {

  const location = req.headers.location;

  try {
    db.query('SELECT * FROM Staff WHERE office = ?', [location], async (err, staff) => {
      if (err) {
        console.error('Error retrieving Staff:', err); // Log the error
        return res.status(500).json({ message: 'Error retrieving Staff' });
      }
      const numberOfStaff = staff.length

      return res.json({ numberOfStaff, staff });
    });
  } catch (error) {
    console.error('Error retrieving Staff:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving Staff' });
  }
});

// ............................. ADMIN EDIT STAFF ................................
router.put('/update-staff/:id', async (req, res) => {
  const staffId = req.params.id;
  const { adminEmail, title, firstName, middleName, lastName, email, dateOfBirth, dateEmployed, office, position, selectedJobType, salary, hubInstructor, schoolInstructor, phone, accountNumber, bankName, sickLeave, homeAddress, nextOfKinFullName, nextOfKinPhoneNumber, nextOfKinAddress, isVerified, } = req.body;
  console.log(isVerified)

  const createHistoryTableQuery = `
  CREATE TABLE IF NOT EXISTS History (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(1000) NOT NULL,
    userEmail VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    details VARCHAR(2000) NOT NULL DEFAULT '',
    createdAt TIMESTAMP NOT NULL
    );
`;

  db.query(createHistoryTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  // Update the Staff's information in the database
  const sql = `
      UPDATE Staff
      SET
        title = ?,
        firstName = ?,
        middleName = ?,
        lastName = ?,
        email = ?,
        selectedJobType = ?,
        salary = ?,
        dateOfBirth = ?,
        dateEmployed = ?,
        office = ?,
        position = ?,
        hubInstructor = ?,
        schoolInstructor = ?,
        phone = ?,
        accountNumber = ?,
        bankName = ?,
        sickLeave = ?,
        homeAddress = ?,
        nextOfKinFullName = ?,
        nextOfKinPhoneNumber = ?,
        nextOfKinAddress = ?,
        isVerified = ?
      WHERE _id = ?
    `;

  // Compare Staff details
  db.query('SELECT * FROM Staff WHERE _id = ?', [staffId], async (err, staff) => {

    const array1 =
      [
        title,
        firstName,
        lastName,
        middleName,
        email,
        selectedJobType,
        salary,
        dateOfBirth,
        dateEmployed,
        office,
        position,
        hubInstructor,
        schoolInstructor,
        phone,
        accountNumber,
        bankName,
        sickLeave,
        homeAddress,
        nextOfKinFullName,
        nextOfKinPhoneNumber,
        nextOfKinAddress,
        isVerified,
      ];

    const array2 = [
      staff[0].title,
      staff[0].firstName,
      staff[0].lastName,
      staff[0].middleName,
      staff[0].email,
      staff[0].selectedJobType,
      staff[0].salary,
      staff[0].dateOfBirth,
      staff[0].dateEmployed,
      staff[0].office,
      staff[0].position,
      staff[0].hubInstructor,
      staff[0].schoolInstructor,
      staff[0].phone,
      staff[0].accountNumber,
      staff[0].bankName,
      staff[0].sickLeave,
      staff[0].homeAddress,
      staff[0].nextOfKinFullName,
      staff[0].nextOfKinPhoneNumber,
      staff[0].nextOfKinAddress,
      staff[0].isVerified
    ];


    let array4 = []

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        array4.push(`${array2[i]} to ${array1[i]}`)
      }
    }


    const updatesString = array4.join(', ');

    // Update the info
    db.query(
      sql,
      [title, firstName, middleName, lastName, email, selectedJobType, salary, dateOfBirth, dateEmployed, office, position, hubInstructor, schoolInstructor, phone, accountNumber, bankName, sickLeave, homeAddress, nextOfKinFullName, nextOfKinPhoneNumber, nextOfKinAddress, isVerified, staffId],
      async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        // Check if the student was found and updated
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Staff not found' });
        }

        // Store in History
        db.query(`SELECT * FROM Staff WHERE email = ?`, [adminEmail], async (err, admin) => {
          // Store this activity in the history section
          db.query('SELECT * FROM History', async (err, history) => {

            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }
            if (updatesString == '1 to 0') {
              const title = `${firstName} ${lastName} was suspended`
              const userEmail = `${adminEmail}`
              const fullName = `${admin[0].firstName} ${admin[0].lastName}`

              const sql = `
                    INSERT INTO History (title, userEmail, fullName)
                    VALUES (?, ?, ?)
                  `;

              db.query(sql, [title, userEmail, fullName], async (err, result) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send('Internal Server Error');
                }

                  return res.json({ message: 'Staff has been suspended' });


              });
            }else if(updatesString == '0 to 1'){
              const title = `${firstName} ${lastName} was Verified`
              const userEmail = `${adminEmail}`
              const fullName = `${admin[0].firstName} ${admin[0].lastName}`

              const sql = `
                    INSERT INTO History (title, userEmail, fullName)
                    VALUES (?, ?, ?)
                  `;

              db.query(sql, [title, userEmail, fullName], async (err, result) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send('Internal Server Error');
                }

             
                  return res.json({ message: 'Staff Verified successfully' });

                


              });
            }
            else {
              const title = `${firstName} ${lastName} was updated from ${updatesString}`
              const userEmail = `${adminEmail}`
              const fullName = `${admin[0].firstName} ${admin[0].lastName}`

              const sql = `
                    INSERT INTO History (title, userEmail, fullName)
                    VALUES (?, ?, ?)
                  `;

              db.query(sql, [title, userEmail, fullName], async (err, result) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send('Internal Server Error');
                }

                return res.json({ message: 'Staff updated successfully' });


              });

            }




          })
        })


      }
    );
  })


});

// ............................. ADMIN CREATE POSITION ...............................
router.post('/create-position', async (req, res) => {
  const { jobTitle, status, description, location, email } = req.body;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Positions (
      _id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL DEFAULT 0,
      isVerified BOOLEAN NOT NULL DEFAULT 0
      );
  `;


  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  db.query(`SELECT * FROM Positions`, async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    const sql = `
        INSERT INTO Positions (title, status, description, location)
        VALUES (?, ?, ?, ?)
      `;


    db.query(sql, [jobTitle, status, description, location], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      db.query(`SELECT * FROM Staff WHERE email = ?`, [email], async (err, staff) => {
        // Store this activity in the history section
        db.query('SELECT * FROM History', async (err, history) => {

          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
          const title = `${jobTitle} position was created in ${location}`
          const userEmail = `${email}`
          const fullName = `${staff[0].first_name} ${staff[0].last_name}`

          const sql = `
                INSERT INTO History (title, userEmail, fullName)
                VALUES (?, ?, ?)
              `;

          db.query(sql, [title, userEmail, fullName], async (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }

            return res.json({ message: 'Position Created successfully' });
          });


        })
      })


    });
  });
});

// ............................. ADMIN GET OFFICE POSITIONS ................................
router.get('/office-positions', async (req, res) => {
  const location = req.headers.location;

  db.query('SELECT * FROM Positions WHERE location = ?', [location], async (err, result) => {
    const total = result.length
    return res.json({ totalPosition: total, message: result });

  })
})

router.delete('/delete-location', async (req, res) => {
  const location = req.headers.location;
  const { adminId, email } = req.body;
  console.log(adminId)

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS History (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    userEmail VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    details VARCHAR(255) NOT NULL DEFAULT '',
    createdAt TIMESTAMP NOT NULL
    );
`;


  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  // Validate the adminId
  db.query('SELECT * FROM Staff WHERE email = ?', [email], async (err, staff) => {

    const validated = await bcrypt.compare(adminId, staff[0].id);
    if (!validated) {
      return res.status(404).json({ error: "You are not authorized!!!" });

    }

    // Delete the location record from the database
    db.query('DELETE FROM Offices WHERE officeName = ?', [location], async (err, office) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Check if a record was deleted
      if (office.affectedRows > 0) {

        // Store this activity in the history section
        db.query('SELECT * FROM History', async (err, history) => {

          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
          const title = `${location} location was deleted`
          const userEmail = `${email}`
          const fullName = `${staff[0].first_name} ${staff[0].last_name}`

          const sql = `
            INSERT INTO History (title, userEmail, fullName)
            VALUES (?, ?, ?)
          `;

          db.query(sql, [title, userEmail, fullName], async (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }

            return res.json({ message: 'Location deleted successfully' });
          });


        })
      } else {
        return res.status(404).json({ error: 'Location not found' });
      }
    });

  })


});



// ............................. ADMIN GET VACANT POSITIONS ................................
router.get('/vacant-positions', async (req, res) => {
  const location = req.headers.location;

  db.query('SELECT * FROM Positions WHERE location = ?', [location], async (err, positions) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    db.query('SELECT * FROM Staff WHERE office = ?', [location], async (err, staff) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      // Count how many positions have matching positions in the staff data
      let matchingPositionsCount = 0;

      let allPositions = []
      let loopPosition = ''

      positions.forEach(position => {
        staff.forEach(staffMember => {
          if (position.title === staffMember.position) {
            matchingPositionsCount++;
            loopPosition = position.title

          }
        });
        if (position.title !== loopPosition) {
          allPositions.push(position)

        }


      });


      const vacantPosition = (Number(positions.length) - Number(matchingPositionsCount))
      return res.json({ message: vacantPosition, allPositions });
    });
  });
});

// ............................. ADMIN GET THOSE ON LEAVE ................................
router.get('/on-leave', async (req, res) => {
  const location = req.headers.location;

  db.query('SELECT * FROM LeaveApplication WHERE location = ?', [location], async (err, staff) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    let leaveCount = 0;
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    staff.forEach(staffMember => {

      if (
        (staffMember.leaveStartDate == formattedDate) && (staffMember.isApproved == 1) ||
        ((formattedDate > staffMember.leaveStartDate) && (formattedDate <= staffMember.leaveEndDate)) && (staffMember.isApproved == 1)

      ) {
        leaveCount++;
      }
    });

    return res.json({ message: leaveCount });
  });
});







//.........................  EHIZUA STUDENTS
// ==================================================================

// .............Emma........... ADMIN REGISTER EHIZUA STUDENT ................................
router.post('/create-student', async (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Students (
      _id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      id VARCHAR(255) NOT NULL,
      phone VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      homeAddress VARCHAR(255) NOT NULL,
      guardiansFullname VARCHAR(255) NOT NULL,
      guardiansPhoneNumber VARCHAR(255) NOT NULL,
      guardiansAddress VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP NOT NULL
    );
    `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  const createLoginAuthorizationTable = `
    CREATE TABLE IF NOT EXISTS LoginAuthorization (
      _id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(50) NOT NULL,
      password VARCHAR(200) NOT NULL,
      user VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL DEFAULT '',
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL
    
    );
  `;


  db.query(createLoginAuthorizationTable, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  const createStudentEnrolledCourses = `
    CREATE TABLE IF NOT EXISTS StudentEnrolledCourses (
      _id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(50) NOT NULL,
      course VARCHAR(200) NOT NULL,
      location VARCHAR(200) NOT NULL,
      firstName VARCHAR(200) NOT NULL,
      lastName VARCHAR(200) NOT NULL
    );
  `;


  db.query(createStudentEnrolledCourses, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });


  const {firstName, lastName, email, courseArray, phone, location, address, guardiansFullname, guardiansPhone, guardiansAddress } = req.body;
  //  const course  = courseArray.join(', ')

  // Check if the student with the same email already exists
  db.query('SELECT * FROM Students WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length !== 0) {
      return res.status(400).json({ message: 'Student with email already exists' });
    }


    const salt = await bcrypt.genSalt(10);

    const password = `${email.substring(0, 2)}${shortid.generate()}${firstName.substring(0, 2)}`;
    const id = `${email.substring(2, 4)}-${firstName.substring(0, 2)}-${password.substring(2, 3)}${password.substring(5, 6)}${password.substring(0, 1)}`;
    
    const hashedPass = await bcrypt.hash(password, salt);
    const hashedId = await bcrypt.hash(id, salt);

    // Generate a unique ID based on email and name

    const sql = `
        INSERT INTO Students (firstName, lastName, email, phone, location, homeAddress,  guardiansPhoneNumber, guardiansFullname,  guardiansAddress, id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

    db.query(sql, [firstName, lastName, email, phone, location, address, guardiansPhone, guardiansFullname, guardiansAddress, hashedId], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      const LoginAuthorization = `
      INSERT INTO LoginAuthorization (email, password, user, firstName, lastName)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    db.query(LoginAuthorization, [email, hashedPass, "Student", firstName, lastName], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      // Handle success if needed
    });
    

      for (let i = 0; i < courseArray.length; i++) {
        const course = courseArray[i];
        db.query('INSERT INTO StudentEnrolledCourses (email, course, location, firstName, lastName) VALUES (?, ?, ?, ?, ?)', [email, course, location, firstName, lastName], async (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
          // Handle success if needed
        });
      }
      


      // // Create and send an email in an async function
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
      //     subject: 'Login Details',
      //     html: `<p>Hello ${firstName} ${lastName}, verify your email by clicking on this link.. </p>
      //     <a href='${process.env.CLIENT_URL}/verify-student-email?emailToken=${emailToken}&email=${email}'> Verify Your Email </a>
      //     <h2>Your Subsequent Student Log in details are : </h2>
      //     <p> Email: ${email} </p>
      //     <p> Password: ${id} </p>`,
      //   });

      //   console.log("message sent: " + info.messageId);
      // }

      // // Call the async function to send the email
      // await sendEmail();
      console.log(password)
      console.log(id)

      return res.json({ message: 'Student created successfully', user: result});
    });
  });
});

// ............................ADMIN CREATE A NEW UPSKILL COURSE ............................
router.post('/create-course', async (req, res) => {
  const { course, price, duration, location, courseDetails} = req.body;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Courses (
      _id INT AUTO_INCREMENT PRIMARY KEY,
      course VARCHAR(255) NOT NULL,
      price INT(30) NOT NULL,
      durationInWeeks INT(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      description VARCHAR(500) NOT NULL
    );
  `;


  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  // Check if the Course with the same name already exists

  db.query('SELECT * FROM Courses WHERE course = ? AND location = ?', [course, location], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length !== 0) {
      return res.status(400).json({ message: 'Course with name already exists' });
    }

    const sql = `
          INSERT INTO Courses (location, course, price, durationInWeeks, description )
          VALUES (?, ?, ?, ?, ?)
        `;


    db.query(sql, [location, course, price, duration, courseDetails], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      return res.json({ message: `${course} created successfully` });
    });
  });

});

// ...........done.................ADMIN CREATE DISCOUNT UPSKILL COURSE ............................
router.post('/create-discount-course', async (req, res) => {

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS CourseDiscount (
      _id INT AUTO_INCREMENT PRIMARY KEY,
      course VARCHAR(255) NOT NULL,
      courseAmount VARCHAR(255) NOT NULL,
      percent VARCHAR(30) NOT NULL,
      discountRemoved VARCHAR(30) NOT NULL,
      discountPrice VARCHAR(30) NOT NULL,
      durationInWeeks VARCHAR(255) NOT NULL,
      office VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  const { course, duration, courseAmount, percent, discountRemoved, discountPrice, description, office } = req.body;

  // Check if the Course with the same name already exists

  db.query('SELECT * FROM CourseDiscount WHERE course = ? AND office = ?', [course, office], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length !== 0) {
      return res.status(400).json({ message: 'Course with name already exists' });
    }


    const sql = `
          INSERT INTO CourseDiscount (course, courseAmount, percent, discountRemoved, discountPrice, durationInWeeks, description, office)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;


    db.query(sql, [course, courseAmount, percent, discountRemoved, discountPrice, duration, description, office], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      return res.json({ message: `${course} discount created successfully` });
    });
  });

});

// ...........done.................ADMIN UPDATE DISCOUNT UPSKILL COURSE ............................
router.put('/create-discount-course/:idParam', async (req, res) => {

  const courseId = req.params.idParam; // Get the course ID from the route parameter
  const { office, percentage, discountRemoved, promoPrice, description, percent, percentageDiscount, discountPrice } = req.body;
  if (percent) {
    // Update the student's information in the database
    const sql = `
       UPDATE CourseDiscount
       SET
         office = ?,
         percent = ?,
         discountRemoved = ?,
         discountPrice = ?,
         description = ?
      
       WHERE _id = ?
     `;

    db.query(
      sql,
      [office, percent, percentageDiscount, discountPrice, description, courseId],
      async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        // Check if the student was found and updated
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Student not found' });
        }

        // Send a response indicating success
        return res.json({ message: 'Course Discount updated successfully' });
      }
    );

  } else {
    // Update the student's information in the database

    const sql = `
          UPDATE CourseDiscount
          SET
            office = ?,
            percent = ?,
            discountRemoved = ?,
            discountPrice = ?,
            description = ?
          
          WHERE _id = ?
        `;

    db.query(
      sql,
      [office, percentage, discountRemoved, promoPrice, description, courseId],
      async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        // Check if the student was found and updated
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Student not found' });
        }

        // Send a response indicating success
        return res.json({ message: 'Course Discount updated successfully' });
      }
    );
  }

});

// ..............emma............... ADMIN GET UPSKILL COURSES ................................
router.get('/upskill_courses', async (req, res) => {

  try {
    db.query('SELECT * FROM Courses', async (err, result) => {

      return res.json({ message: result });

    })

  } catch {

  }


})

// ............................. ADMIN GET DISCOUNT COURSES ................................
router.get('/discount-courses', async (req, res) => {

  try {
    db.query('SELECT * FROM CourseDiscount', async (err, result) => {

      return res.json({ message: result });

    })

  } catch {

  }


})

// ............................. ADMIN EDIT DISCOUNT COURSE ................................
router.put('/update-discount-course/:id', async (req, res) => {
  const studentId = req.params.id; // Get the student's ID from the route parameter
  const { firstName, lastName, email, course, phone, guardiansPhone, duration, courseFee, amountPaid, homeAddress, certificate, isVerified } = req.body;

  // Update the student's information in the database
  const sql = `
      UPDATE Students
      SET
        firstName = ?,
        lastName = ?,
        email = ?,
        course = ?,
        phone = ?,
        guardiansPhone = ?,
        duration = ?,
        courseFee = ?,
        amountPaid = ?,
        homeAddress = ?,
        certificateApproved = ?,
        isVerified = ?
      WHERE _id = ?
    `;


  db.query(
    sql,
    [firstName, lastName, email, course, phone, guardiansPhone, duration, courseFee, amountPaid, homeAddress, certificate, isVerified, studentId],
    async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      // Check if the student was found and updated
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Send a response indicating success
      return res.json({ message: 'Student updated successfully' });
    }
  );
});

// ............Done............. ADMIN GET ALL STUDENT..........................................
router.get('/all-students', (req, res) => {

  try {

    db.query('SELECT * FROM Students', async (err, students) => {
      if (err) {
        console.error('Error retrieving students:', err); // Log the error
        return res.status(500).json({ message: 'Error retrieving students' });
      }
      return res.json({ students });
    });

  } catch (error) {
    console.error('Error retrieving students:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving students' });
  }
});

// ............Done............. ADMIN GET STUDENT DETAILS BY EMAIL..........................................
router.get('/students/course-email', (req, res) => {
  const { email } = req.headers

  try {
    if (email) {

      db.query('SELECT * FROM Students WHERE email = ?', [email], async (err, student) => {
        if (err) {
          console.error('Error retrieving students:', err); // Log the error
          return res.status(500).json({ message: 'Error retrieving students' });
        }
        const students = student[0]
        return res.json({ students });
      });
    } else {
      return res.status(500).json({ message: 'Error retrieving students' });
    }

  } catch (error) {
    console.error('Error retrieving students:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving students' });
  }
});

// ............Done............. ADMIN GET STUDENTS BY LOCATION ONLY..........................................
router.get('/sort-students/location', (req, res) => {
  const { location } = req.headers

  try {
    if (location) {

      db.query('SELECT * FROM Students WHERE location = ?', [location], async (err, students) => {
        if (err) {
          console.error('Error retrieving students:', err); // Log the error
          return res.status(500).json({ message: 'Error retrieving students' });
        }
        return res.json({ students });
      });
    } else {
      return res.status(500).json({ message: 'Error retrieving students' });
    }

  } catch (error) {
    console.error('Error retrieving students:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving students' });
  }
});


// ............Done............. ADMIN GET STUDENTS BY LOCATION AND COURSE..........................................
router.get('/sort-students/location-course', (req, res) => {
  const { location, course } = req.headers

  try {
    if (location && course) {

      db.query('SELECT * FROM Students WHERE location = ? AND course REGEXP ?', [location, `\\b${course}\\b`], async (err, students) => {
        if (err) {
          console.error('Error retrieving students:', err); // Log the error
          return res.status(500).json({ message: 'Error retrieving students' });
        }
        return res.json({ students });
      });
    } else {
      return res.status(500).json({ message: 'Error retrieving students' });
    }

  } catch (error) {
    console.error('Error retrieving students:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving students' });
  }
});

// .......................... ADMIN GET UPSKILL CURRICULUM ..........................................
router.get('/upskill-course-curriculum', async (req, res) => {

  const course = req.headers.course;

  db.query('SELECT * FROM Curriculum WHERE course = ?', [course], async (err, content) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching course content' });
    }
    return res.json({ content });
  });


});



// ............................. ADMIN EDIT EHIZUA STUDENT ................................
router.put('/update-student/:id', async (req, res) => {
  const studentId = req.params.id; // Get the student's ID from the route parameter
  const { firstName, lastName, email, course, phone, guardiansPhone, duration, courseFee, amountPaid, homeAddress, certificate, isVerified } = req.body;

  // Update the student's information in the database
  const sql = `
      UPDATE Students
      SET
        firstName = ?,
        lastName = ?,
        email = ?,
        course = ?,
        phone = ?,
        guardiansPhone = ?,
        duration = ?,
        courseFee = ?,
        amountPaid = ?,
        homeAddress = ?,
        certificateApproved = ?,
        isVerified = ?
      WHERE _id = ?
    `;


  db.query(
    sql,
    [firstName, lastName, email, course, phone, guardiansPhone, duration, courseFee, amountPaid, homeAddress, certificate, isVerified, studentId],
    async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      // Check if the student was found and updated
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Send a response indicating success
      return res.json({ message: 'Student updated successfully' });
    }
  );
});

// ............................. ADMIN APPROVE CERTIFICATE ................................
router.put('/approve-certificate/:id', async (req, res) => {
  const studentId = req.params.id; // Get the student's ID from the route parameter

  // Update the student's information in the database
  const sql = `
      UPDATE Students
      SET
      certificateApproved = ?
      WHERE _id = ?
    `;

  db.query(
    sql, ['1', studentId],
    async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      // Check if the student was found and updated
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Send a response indicating success
      return res.json({ message: 'Students Certificate successfully Released' });
    }
  );
});

// ............................. ADMIN GET COURSE CONTENT ................................
router.get('/student-course-content', async (req, res) => {
  const course = req.headers.course

  try {

    db.query('SELECT * FROM Contents WHERE course = ?', [course], async (err, content) => {
      return res.status(200).json({ content });
    })

  } catch (error) {
    console.error('Error retrieving course content:', error);
    return res.status(500).json({ message: 'An error occurred while retrieving course content' });
  }
});

// ............................. ADMIN GET COURSE SCORE ................................
router.get('/student-score', async (req, res) => {
  const course = req.headers.course;
  const email = req.headers.email;

  db.query('SELECT * FROM Percentage WHERE course = ? AND email = ?', [course, email], async (err, score) => {
    return res.json({ message: score });
  })

})

// ============== STAFF

// .............done................ ADMIN REJECT LEAVE REQUEST ................................
router.put('/reject-leave-request/:id', async (req, res) => {
  const id = req.params.id;

  // Update the Tutors's information in the database
  const sql = `
      UPDATE LeaveApplication
      SET
      isApproved = ?
      WHERE _id = ?
    `;

  db.query(
    sql, ['2', id],
    async (err, result) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }

      // Check if the student was found and updated
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Send a response indicating success
      return res.json({ reject: 'Sick Leave Request Not Granted' });
    }
  );

});


// ..............Emma............... ADMIN APPROVE LEAVE REQUEST ................................
router.put('/approve-leave-request/:id', async (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM LeaveApplication WHERE _id = ?', [id], async (err, leave) => {
    const numberOfDays = parseInt(leave[0].numberOfDays)
    const email = leave[0].email
    console.log(email)
    db.query('SELECT * FROM Staff WHERE email = ?', [email], async (err, staff) => {
      console.log(staff)
      const leaveAllocated = parseInt(staff[0].sickLeave)
      const leaveTaken = staff[0].sickLeaveTaken
      const totalDays = parseInt(leaveTaken) + parseInt(numberOfDays)
      if (leaveAllocated < totalDays) {
        return res.status(404).json({
          notApprove: `
                  Staff has used ${leaveTaken} days out of ${leaveAllocated} days.
                  Adding ${numberOfDays} days leave will exceed his allocated leave`
        })

      } else {
        // Update the Tutors's information in the database
        const sql = `
                    UPDATE Staff
                    SET
                    sickLeaveTaken = ?
                    WHERE email = ?
                `;

        db.query(sql, [totalDays, email], async (err, result) => {
          if (err) {
            return res.status(500).send('Internal Server Error');
          }
 
          // Check if the student was found and updated
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tutor not found' });
          }


          const sql = `
                  UPDATE LeaveApplication
                  SET
                  isApproved = ?
                  WHERE _id = ?
                `;

          db.query(sql, ['1', id], async (err, result) => {
            if (err) {
              return res.status(500).send('Internal Server Error');
            }

            // Check if the student was found and updated
            if (result.affectedRows === 0) {
              return res.status(404).json({ message: 'Tutor not found' });
            }


            // Send a response indicating success
            return res.json({ approve: 'Sick Leave Request Granted' });
          }
          );
        }
        );


      }

    })
  })

});

// ...............Emma............... ADMIN GET ALL LEAVE REQUEST ..........................................
router.get('/staff-leave-request', (req, res) => {


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
      throw new Error('Error creating Leave Applications table');
    }
  });

  try {
    db.query('SELECT * FROM LeaveApplication', async (err, leave) => {
      if (err) {
        console.error('Error retrieving Leave Applications:', err); // Log the error
        return res.status(500).json({ message: 'Error retrieving Leave Applications' });
      }

      return res.json({ leave });
    });
  } catch (error) {
    console.error('Error retrieving Leave Applications:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving Leave Applications' });
  }
});


// ============== HUB INSTRUCTORS
// .............................. ADMIN GET ALL HUB INSTRUCTOR BY LOCATION ..........................................
router.get('/hub_instructor/location', (req, res) => {

  const createHubInstructorTable = `
      CREATE TABLE IF NOT EXISTS HubInstructors (
        _id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        courses VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        office VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        isAdmin VARCHAR(255) NOT NULL DEFAULT 0
      );
      `;
  db.query(createHubInstructorTable, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  const office = req.headers.office

  try {
    db.query('SELECT * FROM HubInstructors WHERE office = ?', [office], async (err, staff) => {
      if (err) {
        console.error('Error retrieving Hub Instructors:', err); // Log the error
        return res.status(500).json({ message: 'Error retrieving Hub Instructors' });
      }

      return res.json({ staff });
    });
  } catch (error) {
    console.error('Error retrieving Hub Instructors:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving Hub Instructors' });
  }
});

// .............................. ADMIN GET ALL HUB INSTRUCTOR  ..........................................
router.get('/hub_instructor', (req, res) => {

  const createHubInstructorTable = `
      CREATE TABLE IF NOT EXISTS HubInstructors (
        _id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        courses VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        office VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        isAdmin VARCHAR(255) NOT NULL DEFAULT 0
      );
      `;
  db.query(createHubInstructorTable, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });


  try {
    db.query('SELECT * FROM HubInstructors', async (err, staff) => {
      if (err) {
        console.error('Error retrieving Hub Instructors:', err); // Log the error
        return res.status(500).json({ message: 'Error retrieving Hub Instructors' });
      }

      return res.json({ staff });
    });
  } catch (error) {
    console.error('Error retrieving Hub Instructors:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving Hub Instructors' });
  }
});



// ................................... SCHOOL STUDENTS SECTION ......................
//===============================================================================================

// ................emma............. ADMIN REGISTER SCHOOL ................................
router.post('/create-school', async (req, res) => {
  const { schoolName, checkedCourses, monday, tuesday, wednesday, thursday, friday, saturday, email, phone, duration, courseFee, schoolAddress } = req.body;

  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS PartnerSchools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      schoolName VARCHAR(255) NOT NULL,
      courses VARCHAR(255) NOT NULL,
      monday VARCHAR(255) NOT NULL,
      tuesday VARCHAR(255) NOT NULL,
      wednesday VARCHAR(255) NOT NULL,
      thursday VARCHAR(255) NOT NULL,
      friday VARCHAR(255) NOT NULL,
      saturday VARCHAR(255) NOT NULL,
      phone VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      duration VARCHAR(255) NOT NULL,
      courseFee VARCHAR(255) NOT NULL,
      schoolAddress VARCHAR(255) NOT NULL
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });
  // Check if the school with the same name already exists
  db.query(`SELECT * FROM PartnerSchools WHERE schoolName = ?`, [schoolName], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length !== 0) {
      return res.status(400).json({ message: 'School with Name already exists' });
    }

    const sql = `
        INSERT INTO PartnerSchools (schoolName, courses, monday, tuesday, wednesday, thursday, friday, saturday, email, phone, duration, courseFee, schoolAddress)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;


    // Convert checkedCourses array to a string
    const coursesString = checkedCourses.join(', ');

    db.query(sql, [schoolName, coursesString, monday, tuesday, wednesday, thursday, friday, saturday, email, phone, duration, courseFee, schoolAddress], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      return res.json({
        message: 'School created successfully'
      });
    });
  });
});

// ............................. ADMIN GET LIST OF SCHOOLS ................................
router.get('/partner-schools', async (req, res) => {

  db.query('SELECT * FROM PartnerSchools', async (err, result) => {
    return res.json({ message: result });

  })
})

// .............emma........... ADMIN GET LIST OF SCHOOL COURSE ................................
router.get('/all_school_subject', async (req, res) => {

  db.query('SELECT * FROM SchoolCourses', async (err, result) => {

    return res.json({ message: result });

  })
})

// .............emma......... ADMIN GET PARTNER SCHOOLS REGISTERED COURSES................................
router.get('/partner-schools-course', async (req, res) => {
  const school = req.headers.school;

  db.query(`SELECT * FROM PartnerSchools WHERE schoolName = ?`, [school], async (err, result) => {
    if (result.length > 0) {
      const coursesArray = result[0].courses.split(',').map(course => course.trim());
      return res.json({ courses: coursesArray });
    } else {
      return res.status(404).json({ message: 'School not found' });
    }
  });
});

// ................emma.............  REGISTER SCHOOL STUDENT / PUPIL ................................
router.post('/register-school-student', async (req, res) => {
  const { selectSchool, firstName, lastName, level, checkedCourses, year, term, guardiansPhone } = req.body;
  const words = selectSchool.split(' ');

  // Capitalize the first letter of each word and join them without spaces
  const school = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${school} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      school VARCHAR(255) NOT NULL,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      level VARCHAR(255) NOT NULL,
      courses VARCHAR(255) NOT NULL,
      year VARCHAR(255) NOT NULL,
      term VARCHAR(255) NOT NULL,
      courseCode VARCHAR(255) NOT NULL DEFAULT '',
      guardiansPhone VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      emailToken VARCHAR(255) NOT NULL,
      isVerified BOOLEAN NOT NULL DEFAULT true

      );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  // Check if the student with the same email already exists
  db.query(`SELECT * FROM ${school} WHERE firstName = ? AND lastName = ? AND level = ? AND year = ? AND term = ?`, [firstName, lastName, level, year, term], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length !== 0) {
      return res.status(400).json({ message: 'Student already exists' });
    }


    const countQuery = `SELECT COUNT(*) AS studentCount FROM ${school}`;

    db.query(countQuery, async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      // Extract the student count from the result
      const studentCount = result[0].studentCount + 1;



      const domain = `ehizuahub.com`
      const email = `${firstName.toLowerCase()}${lastName.toLowerCase()}${studentCount}@${domain}`

      // Generate a unique ID based on email and name
      const salt = await bcrypt.genSalt(10);
      const password = `${email.substring(0, 2)}${shortid.generate()}${firstName.substring(0, 2)}`;
      const hashedPass = await bcrypt.hash(password, salt);

      let emailToken = crypto.randomBytes(64).toString("hex");


      const sql = `
        INSERT INTO ${school} (school, firstName, lastName, level, courses, year, term, guardiansPhone, email, password, emailToken)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const coursesString = checkedCourses.join(', ');

      db.query(sql, [school, firstName, lastName, level, coursesString, year, term, guardiansPhone, email, password, emailToken], async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }


        return res.json({ message: 'Student created successfully' });
      });
    })



  });
});

// ............................. ADMIN GET LIST OF SCHOOL STUDENT ................................
router.get('/partner-school-students', async (req, res) => {

  const schoolName = req.headers.schoolname

  const school = schoolName.replace(/\s/g, '')


  db.query(`SELECT * FROM ${school}`, async (err, result) => {
    // console.log(result)
    return res.json({ message: result });

  })
})

// ..............emma...........ADMIN CREATE A NEW SCHOOL COURSE ............................
router.post('/create-subject', async (req, res) => {
  const { course } = req.body;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS SchoolCourses (
      _id INT AUTO_INCREMENT PRIMARY KEY,
      course VARCHAR(255) NOT NULL,
      courseCode VARCHAR(255) NOT NULL
      
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  // Check if the Course with the same name already exists

  db.query('SELECT * FROM Courses WHERE course = ?', [course], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length !== 0) {
      return res.status(400).json({ message: 'Course with name already exists' });
    }

    const resultArray = [];

    for (let i = 1; i <= 10; i++) {
      const paddedNumber = i.toString().padStart(3, '0');
      const result = course.slice(0, 3) + paddedNumber;
      resultArray.push(result);
    }

    const resultString = resultArray.join(', ');

    const sql = `
          INSERT INTO SchoolCourses (course, courseCode)
          VALUES (?, ?)
        `;


    db.query(sql, [course, resultString], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      return res.json({ message: `${course} created successfully` });
    });
  });

});


// .............................. ADMIN GET ALL SCHOOL INSTRUCTOR BY LOCATION ..........................................
router.get('/school_instructor/location', (req, res) => {

  const createSchoolInstructorTable = `
      CREATE TABLE IF NOT EXISTS HubInstructors (
        _id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        courses VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        office VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        school VARCHAR(255) NOT NULL DEFAULT "",
        isAdmin VARCHAR(255) NOT NULL DEFAULT 0
      );
      `;
  db.query(createSchoolInstructorTable, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });
  const office = req.headers.office

  try {
    db.query('SELECT * FROM SchoolInstructors WHERE office = ?', [office], async (err, staff) => {
      if (err) {
        console.error('Error retrieving School Instructors:', err); // Log the error
        return res.status(500).json({ message: 'Error retrieving School Instructors' });
      }

      return res.json({ staff });
    });
  } catch (error) {
    console.error('Error retrieving Hub Instructors:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving School Instructors' });
  }
});

// .............................. ADMIN GET ALL SCHOOL INSTRUCTOR ..........................................
router.get('/school_instructor', (req, res) => {

  const createSchoolInstructorTable = `
      CREATE TABLE IF NOT EXISTS HubInstructors (
        _id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        courses VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        office VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        school VARCHAR(255) NOT NULL DEFAULT "",
        isAdmin VARCHAR(255) NOT NULL DEFAULT 0
      );
      `;
  db.query(createSchoolInstructorTable, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });
  const office = req.headers.office

  try {
    db.query('SELECT * FROM SchoolInstructors', async (err, staff) => {
      if (err) {
        console.error('Error retrieving School Instructors:', err); // Log the error
        return res.status(500).json({ message: 'Error retrieving School Instructors' });
      }

      return res.json({ staff });
    });
  } catch (error) {
    console.error('Error retrieving Hub Instructors:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving School Instructors' });
  }
});

// ...........done............... ADMIN EDIT SCHOOL INSTRUCTOR ................................
router.put('/update-school-instructor/:id', async (req, res) => {
  const tutorId = req.params.id; // Get the student's ID from the route parameter
  const { firstName, lastName, email, office, selectedSchools, phone } = req.body;

  // Convert checkedSchool array to a string
  const schoolString = selectedSchools.join(', ');

  // Update the Staff's information in the database
  const sql = `
      UPDATE SchoolInstructors
      SET
        first_name = ?,
        last_name = ?,
        email = ?,
        office = ?,
        phone = ?,
        school = ?
      WHERE _id = ?
    `;



  db.query(
    sql,
    [firstName, lastName, email, office, phone, schoolString, tutorId],
    async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }


      // Check if the student was found and updated
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Staff not found' });
      }

      // Send a response indicating success
      return res.json({ message: 'Staff updated successfully' });
    }
  );
});


module.exports = router;
