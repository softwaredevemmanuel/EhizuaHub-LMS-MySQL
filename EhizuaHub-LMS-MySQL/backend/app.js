const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express');


const options = require('./swagger/auth'); // Import the Swagger definition

const swaggerSpec = swaggerJSDoc(options)
const app = express();
const PORT = process.env.PORT || 5000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


app.use(cors());
app.use(bodyParser.json());


// .............. Ehizua MySQL Database Connection ............
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ehizua'

})
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Ehizua MySql Connected.....')
});



// .............. School MySQL Database Connection ............
const sch = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Schools'

})
sch.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('School MySql Connected.....')
});


// .............. Ehizua Staff MySQL Database Connection ............
const stf = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Schools'

})
stf.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Ehizua Staff MySql Connected.....')
});


//....... JSON WEB TOKEN ............
const createToken = (payload) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  return jwt.sign(payload, jwtSecretKey, { expiresIn: "3d" });
};



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


// ...............................  ADMIN LOGIN .......................................
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM AdminAuthorization WHERE email = ? AND password = ?', [email, password], (err, result) => {
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

    const payload = { id: crypto.randomBytes(16).toString("hex") };
    const token = createToken(payload);

    res.json({ token: token, admin_authorization: payload });
  });
});


// ............................. ADMIN REGISTER SCHOOL ................................
app.post('/api/auth/create-school', async (req, res) => {
  const { schoolName, course1, course2, course3, course4, course5, monday, tuesday, wednesday, thursday, friday, saturday, email, phone, course, duration, courseFee, amountPaid, schoolAddress } = req.body;

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS PartnerSchools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    schoolName VARCHAR(255) NOT NULL,
    course1 VARCHAR(255) NOT NULL,
    course2 VARCHAR(255) NOT NULL,
    course3 VARCHAR(255) NOT NULL,
    course4 VARCHAR(255) NOT NULL,
    course5 VARCHAR(255) NOT NULL,
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
    amountPaid VARCHAR(255) NOT NULL,
    schoolAddress VARCHAR(255) NOT NULL
  );
`;

  sch.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });
  // Check if the student with the same email already exists
  sch.query(`SELECT * FROM PartnerSchools WHERE schoolName = ?`, [schoolName], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length !== 0) {
      return res.status(400).json({ message: 'School with Name already exists' });
    }


    const total = courseFee - amountPaid;
    const sql = `
      INSERT INTO PartnerSchools (schoolName, course1, course2, course3, course4, course5, monday, tuesday, wednesday, thursday, friday, saturday, email, phone, duration, courseFee, amountPaid, schoolAddress)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    sch.query(sql, [schoolName, course1, course2, course3, course4, course5, monday, tuesday, wednesday, thursday, friday, saturday, email, phone, duration, courseFee, amountPaid, schoolAddress], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }


      // Create and send an email in an async function
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

      // Call the async function to send the email
      // await sendEmail();

      return res.json({ message: 'School created successfully', school: { schoolName, course1, course2, course3, course4, course5, monday, tuesday, wednesday, thursday, friday, saturday, email, course, phone, duration, courseFee, amountPaid, schoolAddress } });
    });
  });
});

// ............................. ADMIN GET LIST OF SCHOOLS ................................
app.get('/api/auth/partner-schools', async (req, res) => {

  sch.query('SELECT * FROM PartnerSchools', async (err, result) => {
    return res.json({ message: result });

  })
})

// ............................. ADMIN REGISTER SCHOOL STUDENT ................................
app.post('/api/auth/register-school-student', async (req, res) => {
  const { selectSchool, firstName, lastName, level, course1, course2, course3, course4, course5, year, term, guardiansPhone } = req.body;
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
    course1 VARCHAR(255) NOT NULL,
    course2 VARCHAR(255) NOT NULL,
    course3 VARCHAR(255) NOT NULL,
    course4 VARCHAR(255) NOT NULL,
    course5 VARCHAR(255) NOT NULL,
    year VARCHAR(255) NOT NULL,
    term VARCHAR(255) NOT NULL,
    guardiansPhone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    emailToken VARCHAR(255) NOT NULL,
    isVerified BOOLEAN NOT NULL DEFAULT false

    );
`;

  sch.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  // Check if the student with the same email already exists
  sch.query(`SELECT * FROM ${school} WHERE firstName = ? AND lastName = ? AND level = ?`, [firstName, lastName, level], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length !== 0) {
      return res.status(400).json({ message: 'Student already exists' });
    }


    const countQuery = `SELECT COUNT(*) AS studentCount FROM ${school}`;

    sch.query(countQuery, async (err, result) => {
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
      INSERT INTO ${school} (school, firstName, lastName, level, course1, course2, course3, course4, course5, year, term, guardiansPhone, email, password, emailToken)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      sch.query(sql, [school, firstName, lastName, level, course1, course2, course3, course4, course5, year, term, guardiansPhone, email, password, emailToken], async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }


        return res.json({ message: 'Student created successfully' });
      });
    })



  });
});


// ............................. ADMIN REGISTER EHIZUA STUDENT ................................
app.post('/api/auth/create-student', async (req, res) => {
  const { firstName, lastName, email, course, phone, guardiansPhone, duration, courseFee, amountPaid, homeAddress } = req.body;

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
    const id = `${email.substring(0, 2)}${shortid.generate()}${firstName.substring(0, 2)}`;
    const hashedPass = await bcrypt.hash(id, salt);

    // Generate a unique ID based on email and name
    const total = courseFee - amountPaid;
    let balance = total;
    let emailToken = crypto.randomBytes(64).toString("hex");
    let certificateApproved = '0'

    const sql = `
      INSERT INTO Students (firstName, lastName, email, course, phone, guardiansPhone, duration, courseFee, amountPaid, balance, homeAddress, certificateApproved, id, emailToken)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [firstName, lastName, email, course, phone, guardiansPhone, duration, courseFee, amountPaid, balance, homeAddress, certificateApproved, hashedPass, emailToken], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }


      // Create and send an email in an async function
      async function sendEmail() {
        const transporter = nodemailer.createTransport({
          host: 'mail.softwaredevemma.ng',
          port: 465,
          secure: true,
          auth: {
            user: 'main@softwaredevemma.ng',
            pass: 'bYFx.1zDu968O.'
          }
        });

        const info = await transporter.sendMail({
          from: 'Ehizua Hub <main@softwaredevemma.ng>',
          to: email,
          subject: 'Login Details',
          html: `<p>Hello ${firstName} ${lastName}, verify your email by clicking on this link.. </p>
          <a href='${process.env.CLIENT_URL}/verify-student-email?emailToken=${emailToken}&email=${email}'> Verify Your Email </a>
          <h2>Your Subsequent Student Log in details are : </h2>
          <p> Email: ${email} </p>
          <p> Password: ${id} </p>`,
        });

        console.log("message sent: " + info.messageId);
      }

      // Call the async function to send the email
      await sendEmail();

      return res.json({ message: 'Student created successfully', user: { id, firstName, lastName, email, course, phone, guardiansPhone, duration, courseFee, amountPaid, balance, homeAddress, emailToken } });
    });
  });
});

// .............................. ADMIN GET ALL EHIZUA STUDENTS ..........................................
app.get('/api/auth/students', (req, res) => {
  try {
    db.query('SELECT _id, firstName, lastName, email, course, phone, guardiansPhone, duration, courseFee, amountPaid, balance, homeAddress, certificateApproved, isVerified, createdAt FROM Students', async (err, students) => {
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

// ............................. ADMIN EDIT EHIZUA STUDENT ................................
app.put('/api/auth/update-student/:id', async (req, res) => {
  const studentId = req.params.id; // Get the student's ID from the route parameter
  const { firstName, lastName, email, course, phone, guardiansPhone, duration, courseFee, amountPaid, homeAddress } = req.body;

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
      homeAddress = ?
    WHERE _id = ?
  `;

  db.query(
    sql,
    [firstName, lastName, email, course, phone, guardiansPhone, duration, courseFee, amountPaid, homeAddress, studentId],
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

// ............................ADMIN CREATE TUTOR ............................
app.post('/api/auth/create-tutor', async (req, res) => {
  const { first_name, last_name, email, office, course, phone, sick_leave } = req.body;

  // Check if the student with the same email already exists

  db.query('SELECT * FROM Tutors WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length !== 0) {
      return res.status(400).json({ message: 'Tutor with email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const id = `${email.substring(0, 2)}${shortid.generate()}${first_name.substring(0, 2)}`;
    const hashedPass = await bcrypt.hash(id, salt);

    // Generate a unique ID based on email and name
    let emailToken = crypto.randomBytes(64).toString("hex");

    const sql = `
        INSERT INTO Tutors (first_name, last_name, email, office, course, phone, sickLeave, id, emailToken)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;


    db.query(sql, [first_name, last_name, email, office, course, phone, sick_leave, hashedPass, emailToken], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }


      // Create and send an email in an async function
      async function sendEmail() {
        const transporter = nodemailer.createTransport({
          host: 'mail.softwaredevemma.ng',
          port: 465,
          secure: true,
          auth: {
            user: 'main@softwaredevemma.ng',
            pass: 'bYFx.1zDu968O.'
          }
        });

        const info = await transporter.sendMail({
          from: 'Ehizua Hub <main@softwaredevemma.ng>',
          to: email,
          subject: 'Login Details',
          html: `<p>Hello ${first_name} ${last_name}, verify your email by clicking on this link.. </p>
            <a href='${process.env.CLIENT_URL}/verify-tutor-email?emailToken=${emailToken}&email=${email}'> Verify Your Email </a>
            <h2>Your Subsequent Tutor Log in details are : </h2>
            <p> Email: ${email} </p>
            <p> Password: ${id} </p>`,
        });

        console.log("message sent: " + info.messageId);
      }

      // Call the async function to send the email
      await sendEmail();

      return res.json({ message: 'Tutor created successfully', user: { id, first_name, last_name, email, course, phone, emailToken } });
    });
  });

});

// .............................. ADMIN GET ALL TUTOR DETAILS ..........................................
app.get('/api/auth/tutors', (req, res) => {
  try {
    db.query('SELECT * FROM Tutors', async (err, tutors) => {
      if (err) {
        console.error('Error retrieving tutors:', err); // Log the error
        return res.status(500).json({ message: 'Error retrieving tutors' });
      }

      return res.json({ tutors });
    });
  } catch (error) {
    console.error('Error retrieving tutors:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving tutors' });
  }
});

// ............................. ADMIN EDIT TUTOR ................................
app.put('/api/auth/update-tutor/:id', async (req, res) => {
  const tutorId = req.params.id; // Get the student's ID from the route parameter
  const { firstName, lastName, email, course, phone } = req.body;

  // Update the student's information in the database
  const sql = `
    UPDATE Tutors
    SET
      first_name = ?,
      last_name = ?,
      email = ?,
      course = ?,
      phone = ?
    WHERE _id = ?
  `;

  db.query(
    sql,
    [firstName, lastName, email, course, phone, tutorId],
    async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      // Check if the student was found and updated
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Tutor not found' });
      }

      // Send a response indicating success
      return res.json({ message: 'Tutor updated successfully' });
    }
  );
});

// ............................. ADMIN APPROVE CERTIFICATE ................................
app.put('/api/auth/approve-certificate/:id', async (req, res) => {
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
app.get('/api/auth/student-course-content', async (req, res) => {
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
app.get('/api/auth/student-score', async (req, res) => {
  const course = req.headers.course;
  const email = req.headers.email;


  db.query('SELECT * FROM Percentage WHERE course = ? AND email = ?', [course, email], async (err, score) => {
    return res.json({ message: score });
  })
})


// ............................. ADMIN REGISTER OFFICE ................................
app.post('/api/auth/register-office', async (req, res) => {
  const { officeName, officePhoneNumber, officeEmail, state, officeAddress } = req.body;

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Offices (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    officeName VARCHAR(255) NOT NULL,
    officePhone VARCHAR(255) NOT NULL,
    officeEmail VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
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
      INSERT INTO Offices (officeName, officePhone, officeEmail, state, officeAddress)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [officeName, officePhoneNumber, officeEmail, state, officeAddress], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      return res.json({ message: 'Office Registered successfully' });
    });
  });
});


// ............................. ADMIN GET LIST OF OFFICES ................................
app.get('/api/auth/all_offices', async (req, res) => {

  db.query('SELECT * FROM Offices', async (err, result) => {
    return res.json({ message: result });

  })
})


// ............................. ADMIN REJECT LEAVE REQUEST ................................
app.put('/api/auth/reject-leave-request/:id', async (req, res) => {
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


// ............................. ADMIN APPROVE LEAVE REQUEST ................................
app.put('/api/auth/approve-leave-request/:id', async (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM LeaveApplication WHERE _id = ?', [id], async (err, tutor) => {
    const numberOfDays = parseInt(tutor[0].numberOfDays)
    const email = tutor[0].email
    db.query('SELECT * FROM Tutors WHERE email = ?', [email], async (err, tutor) => {
      const leaveAllocated = parseInt(tutor[0].sickLeave)
      const leaveTaken = tutor[0].sickLeaveTaken
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
                  UPDATE Tutors
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


// .......................... STUDENT VERIFICATION EMAIL ..................................
app.post('/api/auth/verify-student-email', async (req, res) => {
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


// ................................. STUDENT LOGIN ...........................................
app.post('/api/students/student-login', async (req, res) => {
  const { email, id } = req.body;

  
  db.query('SELECT * FROM Students WHERE email = ?', [email], async (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }


    if (result.length === 0) {
      return res.status(401).json({ message: 'Wrong Email or Password' });
    }

    const validated = await bcrypt.compare(id, result[0].id);


    if (result[0].isVerified === 0) {
      return res.status(400).json({ message: 'Please verify your account.. Or contact Ehizua Hub Admin for assistance' });
    }

    if (result[0].emailToken === null && result[0].isVerified === 0) {
      return res.status(404).json("Your account has been suspended. Please contact Ehizua Hub Admin.");
    }
    if (!validated) {
      return res.status(404).json({ message: "Wrong Email or Password." });

    }
    const name = (`${result[0].firstName} ${result[0].lastName}`);
    const course = (result[0].course);
    const payload = { id: result[0]._id };
    const token = createToken(payload);
    res.json({ token: token, user: name, authHeader: result[0].id, course: course });

  });
});

// ........................... STUDENT FORGET PASSWORD ..........................
app.post('/api/auth/student_forgot_password', async (req, res) => {
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
        async function sendEmail() {
          const transporter = nodemailer.createTransport({
            host: 'mail.softwaredevemma.ng',
            port: 465,
            secure: true,
            auth: {
              user: 'main@softwaredevemma.ng',
              pass: 'bYFx.1zDu968O.'
            }

          });


          const info = await transporter.sendMail({
            from: 'Ehizua Hub <main@softwaredevemma.ng>',
            to: email,
            subject: 'Password Reset',
            html: `<p>Hello ${firstName} ${lastName} your student password has been reset successfully

                <h2>Your New Log in details are : </h2>
                <p> Email: ${email} </p>
                <p> Password: ${id} </p>`,

          })
          console.log("message sent: " + info.messageId);
        }

        await sendEmail();



        res.status(200).json(`Password has been sent to ${email}. `);

      });

    });

  } catch {
    return res.json('Something went wrong')
  }

})

// .................................... STUDENT COURSE CONTENT ...............................
app.get('/api/students/student-course-content', async (req, res) => {

  const authHeader = req.headers.authheader;

  try {
    db.query('SELECT * FROM Students WHERE id = ?', [authHeader], async (err, response) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }

      if (response[0].emailToken === null && response[0].isVerified === 0) {
        return res.status(404).json("Your account has been suspended. Please contact Ehizua Hub Admin.");
      }

      const course = response[0].course;
      db.query('SELECT * FROM Contents WHERE course = ?', [course], async (err, content) => {
        return res.status(200).json({ content });
      })
    })

  } catch (error) {
    console.error('Error retrieving course content:', error);
    return res.status(500).json({ message: 'An error occurred while retrieving course content' });
  }
});


// .................................... GET QUESTIONS ..........................................
app.get('/api/students/questions', async (req, res) => {
  const authHeader = req.headers.authheader;
  const subTopic = req.headers.sub_topic;
  const course = req.headers.course;
  const email = req.headers.email;
  const yes = req.headers.yes;


  // Check if there is a valid authHeader, topic, course, and email
  if (!authHeader || !subTopic || !course || !email) {
    return res.status(400).json({ message: 'Missing required headers' });
  }

  db.query('SELECT * FROM Percentage WHERE subTopic = ? AND course = ? AND email = ?', [subTopic, course, email], async (err, response) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (response.length === 1 && response[0].score == 100) {
      return res.status(500).json({ retake: `You already got a 100% score in ${subTopic}. Do well to go to the next topic` });

    }

    if (response.length === 1 && response[0].score < 100 && response[0].score >= 70) {
      return res.status(500).json({ retake: `You exceeded the pass mark but you can do better` });

    }
    if (response.length === 1) {
      const currentTime = Date.now();
      const submissionTime = response[0].updatedAt;
      const timeDifference = currentTime - submissionTime;
      const oneMinuteInMillis = 1 * 60 * 100000; // 1 minute in milliseconds

      const timeLeftInMillis = oneMinuteInMillis - timeDifference;
      if (timeDifference > oneMinuteInMillis) {
        db.query('SELECT * FROM Students WHERE id = ?', [authHeader], async (err, studentResponse) => {
          if (err) {
            console.error('Error executing SQL query for student:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }
          // Section to authenticate a student

          db.query('SELECT * FROM Questions WHERE subTopic = ? AND course = ?', [subTopic, course], async (err, questionsResponse) => {
            if (err) {
              console.error('Error executing SQL query for questions:', err);
              return res.status(500).json({ message: 'Internal server error' });
            }

            const questions = JSON.parse(JSON.stringify(questionsResponse));

            return res.json({ message: `${subTopic} Questions`, questions });
          });
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
      db.query('SELECT * FROM Students WHERE id = ?', [authHeader], async (err, studentResponse) => {
        if (err) {
          console.error('Error executing SQL query for student:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
        // Section to authenticate a student

        db.query('SELECT * FROM Questions WHERE subTopic = ? AND course = ?', [subTopic, course], async (err, questionsResponse) => {
          if (err) {
            console.error('Error executing SQL query for questions:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }

          const questions = JSON.parse(JSON.stringify(questionsResponse));

          return res.json({ message: `${subTopic} Questions`, questions });
        });
      });
    }
  });
});


// .......................... RETAKE YES BUTTON ......................
app.get('/api/students/retake', async (req, res) => {
  const subTopic = req.headers.sub_topic;
  const course = req.headers.course;

  db.query('SELECT * FROM Questions WHERE subTopic = ? AND course = ?', [subTopic, course], async (err, questionsResponse) => {
    if (err) {
      console.error('Error executing SQL query for questions:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    const questions = JSON.parse(JSON.stringify(questionsResponse));

    return res.json({ message: `${subTopic} Questions`, questions });
  });



});

// ....................SubmitedQuestion Students Question..........................................
app.post('/api/students/submit_questions', async (req, res) => {
  const questionsArray = req.body; // Array of question objects

  try {
    const submittedQuestions = [];

    for (const { sub_topic, course, question, ans, email } of questionsArray) {
      db.query(
        'SELECT * FROM SubmittedQuestions WHERE subTopic = ? AND course = ? AND email = ? AND question = ?',
        [sub_topic, course, email, question],
        async (err, questionsResponse) => {
          if (err) {
            console.error('Error executing SELECT query:', err);
            return res.status(500).json({ message: 'Error submitting questions' });
          }

          if (questionsResponse.length > 0) {

            // Update the existing submission's ans field
            db.query(
              'UPDATE SubmittedQuestions SET ans = ? WHERE subTopic = ? AND course = ? AND email = ? AND question = ?',
              [ans, sub_topic, course, email, question],
              async (err, updateResponse) => {
                if (err) {
                  console.error('Error executing UPDATE query:', err);
                  return res.status(500).json({ message: 'Error submitting questions' });
                }
                submittedQuestions.push(updateResponse);
              }
            );


          } else {
            // Insert a new submission
            db.query(
              'INSERT INTO SubmittedQuestions (subTopic, course, question, ans, email) VALUES (?, ?, ?, ?, ?)',
              [sub_topic, course, question, ans, email],
              async (err, insertResponse) => {
                if (err) {
                  console.error('Error executing INSERT query:', err);
                  return res.status(500).json({ message: 'Error submitting questions' });
                }
                submittedQuestions.push(insertResponse);
              }
            );
          }
        }
      );
    }


    return res.json({ message: 'Questions submitted successfully', answers: submittedQuestions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error submitting questions' });
  }
});


// .................................... CALCULATE Test Score ..........................................
app.get('/api/students/check_test_score', async (req, res) => {
  const authHeader = req.headers.authheader;
  const subTopic = req.headers.sub_topic;
  const course = req.headers.course;
  const email = req.headers.email;

  try {
    db.query('SELECT * FROM SubmittedQuestions WHERE subTopic = ? AND course = ? AND email = ?', [subTopic, course, email], async (err, authTopic) => {
      db.query('SELECT * FROM Questions WHERE subTopic = ? AND course = ?', [subTopic, course], (err, authAns) => {
        let score = 0;

        for (let i = 0; i < authTopic.length; i++) {
          if (
            authTopic[i]['question'] === authAns[i]['question'] &&
            authTopic[i]['ans'] === authAns[i]['correctAns']
          ) {
            score += 1;

            db.query('UPDATE SubmittedQuestions SET isPassed = 1 WHERE subTopic = ? AND course = ? AND email = ? AND question = ?',
              [authTopic[i]['subTopic'], authTopic[i]['course'], authTopic[i]['email'], authTopic[i]['question']],
              async (err, updateResponse) => {
                // Handle the update response if needed
              }
            );
          } else {
            db.query('UPDATE SubmittedQuestions SET isPassed = 0 WHERE subTopic = ? AND course = ? AND email = ? AND question = ?',
              [authTopic[i]['subTopic'], authTopic[i]['course'], authTopic[i]['email'], authTopic[i]['question']],
              async (err, updateResponse) => {
                // Handle the update response if needed
              }
            );
          }
        } // Loop ends


        const cal = (score / authTopic.length) * 100;
        const percentageScore = cal.toFixed(1);
        let myPercent = parseFloat(percentageScore) >= 70;

        db.query('SELECT * FROM Percentage WHERE subTopic = ? AND course = ? AND email = ?', [subTopic, course, email], async (err, percentage) => {
          if (percentage.length > 0) {
            const prevScore = parseFloat(percentage[0].score)
            const currentScore = parseFloat(percentageScore)
            // Update the existing percentage data
            db.query('SELECT * FROM RetakenPercentage WHERE subTopic = ? AND course = ? AND email = ?', [subTopic, course, email], async (err, retakenpercentage) => {
              if (retakenpercentage.length > 0) {
                db.query(
                  'UPDATE RetakenPercentage SET score = ?, isPassed = ?, updatedAt = CURRENT_TIMESTAMP WHERE subTopic = ? AND course = ? AND email = ?',
                  [percentageScore, myPercent ? 1 : 0, subTopic, course, email],
                  async (err, updateResponse) => {
                    if (currentScore < prevScore) {
                      return res.json({ message: `previous score ${prevScore}, Current Score ${percentageScore}. This score will not be updated` });

                    } else {

                      db.query(
                        'UPDATE Percentage SET score = ?, isPassed = ?, updatedAt = CURRENT_TIMESTAMP WHERE subTopic = ? AND course = ? AND email = ?',
                        [percentageScore, myPercent ? 1 : 0, subTopic, course, email],
                        async (err, updateResponse) => {

                          // add a condition if need be
                        }
                      );
                    }
                  }
                );

              } else {
                db.query(
                  'INSERT INTO RetakenPercentage (subTopic, course, email, score, isPassed) VALUES (?, ?, ?, ?, ?)',
                  [subTopic, course, email, percentageScore, myPercent ? 1 : 0],
                  async (err, insertResponse) => {
                    if (prevScore < percentageScore) {
                      return res.json({ message: `previous score ${prevScore}, Current Score ${percentageScore}. This score will not be updated` });

                    } else {
                      db.query(
                        'UPDATE Percentage SET score = ?, isPassed = ?, updatedAt = CURRENT_TIMESTAMP WHERE subTopic = ? AND course = ? AND email = ?',
                        [percentageScore, myPercent ? 1 : 0, subTopic, course, email],
                        async (err, updateResponse) => {

                          // add a condition if need be

                        }
                      );
                    }

                  }
                );

              }
            })

          } else {
            // Insert a new submission
            db.query(
              'INSERT INTO Percentage (subTopic, course, email, score, isPassed) VALUES (?, ?, ?, ?, ?)',
              [subTopic, course, email, percentageScore, myPercent ? 1 : 0],
              async (err, insertResponse) => {

                // add a condition if need be

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


// ............................ GET TEST SCORE .....................
app.get('/api/students/student-score', async (req, res) => {
  const subTopic = req.headers.sub_topic;
  const course = req.headers.course;
  const email = req.headers.email;


  db.query('SELECT * FROM Percentage WHERE course = ? AND email = ? AND subTopic = ?', [course, email, subTopic], async (err, score) => {
    if (score.length > 0) {
      return res.json({ message: `${score[0].score}` });

    } else {
      return res.json({ message: `0` });

    }
  })
})


// ..........................TUTOR  VERIFICATION EMAIL ..................................
app.post('/api/auth/verify-tutor-email', async (req, res) => {
  try {
    const { emailToken, email } = req.body;

    if (!emailToken) {
      return res.status(404).json("EmailToken not found...");
    }

    db.query('SELECT * FROM Tutors WHERE email = ?', [email], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      if (result.length === 0) {
        return res.status(404).json("Tutor not found.");
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
          UPDATE Tutors
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

// .............................. TUTOR LOGIN ....................................
app.post('/api/tutor/tutor-login', async (req, res) => {
  const { email, id } = req.body;


  db.query('SELECT * FROM Tutors WHERE email = ?', [email], async (err, result) => {

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

    res.json({ token: token, tutor: name, tutor_authorization: result[0].id, course: course, office: result[0].office, email: email });

  });
});


// ...........................TUTOR FORGET PASSWORD ..........................
app.post('/api/auth/tutor_forgot_password', async (req, res) => {
  const { email } = req.body;
  try {
    db.query('SELECT * FROM Tutors WHERE email = ?', [email], async (err, result) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }
      // If there are no users with that email address in our database then we have to tell the client they don't exist!

      if (result.length === 0) {
        return res.status(401).json({ error: 'No Tutor with Email found' });
      }
      if (result[0].emailToken === null && result[0].isVerified === 0) {
        return res.status(404).json({ error: 'Your account has been suspended. Please contact Ehizua Hub Admin.' });
      }
      first_name = result[0].first_name
      last_name = result[0].last_name


      const salt = await bcrypt.genSalt(10);
      // Generate a unique ID based on email and name
      const id = `${email.substring(0, 2)}${shortid.generate()}${first_name.substring(0, 2)}`;
      const hashedPass = await bcrypt.hash(id, salt);


      // Update the emailToken and isVerified fields
      const updatedId = hashedPass;
      const updateSql = `
         UPDATE Tutors
         SET id = ?
         WHERE email = ?
       `;
      db.query(updateSql, [updatedId, email], async (err, updateResult) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }


        // ..........Send Email to Tutor ............
        async function sendEmail() {
          const transporter = nodemailer.createTransport({
            host: 'mail.softwaredevemma.ng',
            port: 465,
            secure: true,
            auth: {
              user: 'main@softwaredevemma.ng',
              pass: 'bYFx.1zDu968O.'
            }

          });


          const info = await transporter.sendMail({
            from: 'Ehizua Hub <main@softwaredevemma.ng>',
            to: email,
            subject: 'Password Reset',
            html: `<p>Hello ${first_name} ${last_name} your Tutor Login password has been reset successfully

                <h2>Your New Log in details are : </h2>
                <p> Email: ${email} </p>
                <p> Password: ${id} </p>`,

          })
          console.log("message sent: " + info.messageId);
        }

        await sendEmail();



        res.status(200).json(`Password has been sent to ${email}. `);

      });

    });

  } catch {
    return res.json('Something went wrong')
  }

})


// ............................. TUTOR CREATE CURRICULUM .................................
app.post('/api/tutor/create-curriculum', (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Curriculum (
      id INT AUTO_INCREMENT PRIMARY KEY,
      course VARCHAR(255) NOT NULL,
      mainTopic VARCHAR(255) NOT NULL,
      subTopic VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP NOT NULL
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  const { authHeader, course, mainTopic, subTopic } = req.body;

  db.query('SELECT * FROM Tutors WHERE id = ?', [authHeader], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (result.length === 0) {
      return res.status(401).json({ error: 'Unauthorised to view this page. Please Login' });
    }

    if (result[0].emailToken === null && result[0].isVerified === 0) {
      return res.status(404).json({ error: 'Your account has been suspended. Please contact Ehizua Hub Admin.' });
    }

    if (result[0].isVerified === 0) {
      return res.status(400).json({ error: 'Please verify your account or contact Ehizua Hub Admin for assistance' });
    }



    db.query('SELECT * FROM Curriculum WHERE mainTopic = ? AND course = ?', [mainTopic, course], async (err, curriculum) => {
      if (curriculum.length > 0) {
        return res.status(401).json({ message: `${mainTopic} Topic already exists` });

      } else {

        // Now, you can insert data into the Curriculum table
        const insertDataQuery = `
              INSERT INTO Curriculum (course, mainTopic, subTopic)
              VALUES (?, ?, ?);
            `;

        const values = [course, mainTopic, subTopic];

        db.query(insertDataQuery, values, (err) => {
          if (err) {
            console.error(err);
            throw new Error('Error inserting data');
          }
          return res.json({ message: `${mainTopic} curriculum created successfully` });
        });
      }
    })
  })


});

// ............................. GET CURRICULUM MAINTOPIC.................................
app.get('/api/tutor/maintopic', (req, res) => {
  const course = req.headers.course;

  db.query('SELECT * FROM Curriculum WHERE course = ?', [course], async (err, curriculum) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching curriculum data' });
    }


    // Extract MainTopic values from the curriculum data
    const main_topics = JSON.parse(JSON.stringify(curriculum));

    res.json({ message: main_topics });
  });
});

// ............................. GET CURRICULUM SUBTOPIC.................................
app.get('/api/tutor/subtopic', (req, res) => {
  const course = req.headers.course;
  const mainTopic = req.headers.main_topic;

  db.query('SELECT * FROM Curriculum WHERE course = ? AND mainTopic = ?', [course, mainTopic], async (err, curriculum) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching curriculum data' });
    }


    // Extract subTopic values from the curriculum data
    const topics = JSON.parse(JSON.stringify(curriculum));
    subTopic = topics[0].subTopic
    const arrayOfItems = subTopic.split(', ');

    res.json({ subTopics: arrayOfItems });
  });
});


// ............................. TUTOR CREATE CONTENT .................................
app.post('/api/tutor/create-content', async (req, res) => {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Contents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mainTopic VARCHAR(255) NOT NULL,
    subTopic VARCHAR(255) NOT NULL,
    content VARCHAR(255) NOT NULL,
    course VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP NOT NULL
  );
`;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });
  const { authHeader, main_topic, content, course, sub_topic } = req.body;

  try {
    db.query('SELECT * FROM Tutors WHERE id = ?', [authHeader], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (result.length == 0) {
        return res.status(401).json({ error: 'Unauthorised to view this page. Please Login' });
      }

      if (result[0].emailToken === null && result[0].isVerified === 0) {
        return res.status(404).json({ error: 'Your account has been suspended. Please contact Ehizua Hub Admin.' });
      }

      if (result[0].isVerified == 0) {
        return res.status(400).json({ error: 'Please verify your account or contact Ehizua Hub Admin for assistance' });
      }



      // Check if the Content with the same Main Topic and Sub Topic already exists
      db.query('SELECT * FROM Contents WHERE mainTopic = ? AND subTopic = ?', [main_topic, sub_topic], async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        if (result.length !== 0) {
          return res.status(400).json({ error: 'Topic already exists' });
        }


        const sql = `
        INSERT INTO Contents (mainTopic, content, course, subTopic)
        VALUES (?, ?, ?, ?)
      `;

        db.query(sql, [main_topic, content, course, sub_topic], async (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }

          return res.json({ message: 'Content created successfully', content: result });
        });
      });

    })

  } catch (error) {
    return res.status(500).json({ message: 'Error creating content' });
  }


});


// .......................... TUTOR GET COURSE CONTENT ..........................................
app.get('/api/tutor-course-content', async (req, res) => {
  const authHeader = req.headers.authheader;
  const course = req.headers.course;

  try {
    db.query('SELECT * FROM Tutors WHERE id = ?', [authHeader], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (result.length === 0) {
        return res.status(401).json({ error: 'Unauthorised to view this page. Please Login' });
      }

      if (result[0].isVerified === 0) {
        return res.status(400).json({ error: 'Please verify your account or contact Ehizua Hub Admin for assistance' });
      }

      if (result[0].emailToken === null && result[0].isVerified === 0) {
        return res.status(404).json({ error: 'Your account has been suspended. Please contact Ehizua Hub Admin.' });
      }

      db.query('SELECT * FROM Contents WHERE course = ?', [course], async (err, content) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error fetching course content' });
        }
        return res.json({ content });
      });

    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unauthorized!! Please login to view courses' });
  }
});


// .................................... GET TUTOR STUDENTS ..........................................
app.get('/api/tutor-students', async (req, res) => {
  const authHeader = req.headers.authheader;
  const course = req.headers.course;

  try {
    db.query('SELECT * FROM Tutors WHERE id = ?', [authHeader], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (result.length === 0) {
        return res.status(401).json({ error: 'Unauthorised to view this page. Please Login' });
      }

      if (result[0].emailToken === null && result[0].isVerified === 0) {
        return res.status(404).json({ error: 'Your account has been suspended. Please contact Ehizua Hub Admin.' });
      }

      if (result[0].isVerified === 0) {
        return res.status(400).json({ error: 'Please verify your account or contact Ehizua Hub Admin for assistance' });
      }



      db.query('SELECT * FROM Students WHERE course = ?', [course], async (err, students) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error fetching course content' });
        }
        return res.json({ students });
      });

    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unauthorized!! Please login to view courses' });
  }
});


// ....................................TUTOR CREATE QUESTION..........................................
app.post('/api/tutor/create-questions', async (req, res) => {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course VARCHAR(255) NOT NULL,
    mainTopic VARCHAR(255) NOT NULL,
    subTopic VARCHAR(255) NOT NULL,
    question VARCHAR(255) NOT NULL,
    ans1 VARCHAR(255) NOT NULL,
    ans2 VARCHAR(255) NOT NULL,
    ans3 VARCHAR(255) NOT NULL,
    ans4 VARCHAR(255) NOT NULL,
    correctAns VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP NOT NULL
  );
`;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });
  const { authHeader, course, mainTopic, subTopic, question, ans1, ans2, ans3, ans4, correctAns, } = req.body;

  try {
    db.query('SELECT * FROM Tutors WHERE id = ?', [authHeader], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (result.length == 0) {
        return res.status(401).json({ error: 'Unauthorised to view this page. Please Login' });
      }

      if (result[0].emailToken === null && result[0].isVerified === 0) {
        return res.status(404).json({ error: 'Your account has been suspended. Please contact Ehizua Hub Admin.' });
      }

      if (result[0].isVerified == 0) {
        return res.status(400).json({ error: 'Please verify your account or contact Ehizua Hub Admin for assistance' });
      }


      db.query('SELECT * FROM Questions WHERE question = ? AND mainTopic = ?', [question, mainTopic, subTopic], async (err, result) => {
        if (result.length > 0) {
          return res.status(400).json({ error: 'Question already exists! Set another' });

        } else {
          // Create a new content with the tutor's course
          const sql = `INSERT INTO Questions (course, mainTopic, subTopic, question, ans1, ans2, ans3, ans4, correctAns)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          db.query(sql, [course, mainTopic, subTopic, question, ans1, ans2, ans3, ans4, correctAns], async (err, newContent) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }
            return res.json({ message: 'Question created successfully', question: newContent });

          })
        }


      })

    })

  } catch (error) {
    return res.status(500).json({ message: 'Error creating content' });
  }
});


// .................................TUTOR APPLY FOR LEAVE ...................................
app.post('/api/tutor/leave-application', async (req, res) => {
  const leaveRequest = req.body
  try {

    db.query('SELECT * FROM Tutors WHERE email = ?',[leaveRequest.email], async (err, result) => {
      const allocatedLeave = result[0].sickLeave
      const daysRemaining = result[0].sickLeaveTaken

        db.query('SELECT * FROM LeaveApplication', async (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }


          const sql = `
              INSERT INTO LeaveApplication (fullName, email, location, department, numberOfDays, leaveStartDate, leaveEndDate, purposeOfLeave, allocatedLeave, daysRemaining)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;


          db.query(sql, [leaveRequest.name, leaveRequest.email, leaveRequest.office, leaveRequest.course, leaveRequest.formData.selectedDays, leaveRequest.formData.leaveStartDate, leaveRequest.formData.leaveEndDate, leaveRequest.formData.purposeOfLeave, allocatedLeave, daysRemaining], async (err, result) => {

            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }

            return res.json({ message: 'Request sent successfully' });
          });
        });
  })

  } catch (error) {
    return res.status(500).json({ message: 'Error creating content' });
  }

})




// .............................. GET ALL LEAVE REQUEST ..........................................
app.get('/api/tutor/leave-request', (req, res) => {
  try {
    db.query('SELECT * FROM LeaveApplication', async (err, leave) => {
      if (err) {
        console.error('Error retrieving tutors:', err); // Log the error
        return res.status(500).json({ message: 'Error retrieving tutors' });
      }

      return res.json({ leave });
    });
  } catch (error) {
    console.error('Error retrieving tutors:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving tutors' });
  }
});

// =================================================================================================================

// .................................SCHOOL PUPIL LOGIN ...........................................
app.post('/api/students/pupil-login', async (req, res) => {
  const { email, id, selectSchool } = req.body;
  const words = selectSchool.split(' ');
  const school = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');



  
  sch.query(`SELECT * FROM ${school} WHERE email = ?`, [email], async (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }


    if (result.length === 0) {
      return res.status(401).json({ message: 'Wrong Email or Password' });
    }



    if (result[0].isVerified === 0) {
      return res.status(400).json({ message: 'Please verify your account.. Or contact Ehizua Hub Admin for assistance' });
    }

    if (result[0].emailToken === null && result[0].isVerified === 0) {
      return res.status(404).json("Your account has been suspended. Please contact Ehizua Hub Admin.");
    }
    if (!id === result[0].password) {
      return res.status(404).json({ message: "Wrong Email or Password." });

    }
    const name = (`${result[0].firstName} ${result[0].lastName}`);
    const course1 = (result[0].course1);
    const course2 = (result[0].course2);
    const course3 = (result[0].course3);
    const course4 = (result[0].course4);
    const course5 = (result[0].course5);
    const payload = { id: result[0]._id };
    const token = createToken(payload);
    res.json({ token: token, user: name, authHeader: result[0].id, course1 : course1, course2:course2, course3:course3, course4:course4, course5:course5 });

  });
});


// .................................... PUPILS COURSE CONTENT ...............................
app.get('/api/students/pupils-course-content', async (req, res) => {

  const {email, school} = req.headers;
  const words = school.split(' ');
  const schoolSelected = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');


  try {
    sch.query(`SELECT * FROM ${schoolSelected} WHERE email = ? AND school = ?`, [email, schoolSelected], async (err, response) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }

      // if (response[0].emailToken === null && response[0].isVerified === 0) {
      //   return res.status(404).json("Your account has been suspended. Please contact Ehizua Hub Admin.");
      // }

      

      let course1;
      let course2;
      let course3;
      let course4;
      let course5;




      if (response[0].course1) {
        course1 = response[0].course1;
      }

      if (response[0].course2) {
        course2 = response[0].course2;
      }

      if (response[0].course3) {
        course3 = response[0].course3;
      } 
      
      if (response[0].course4) {
        course4 = response[0].course4;
      }

      if (response[0].course5) {
        course5 = response[0].course5;
      }



 

      sch.query('SELECT * FROM Contents WHERE course1 = ?', [course1], async (err, content1) => {
        sch.query('SELECT * FROM Contents WHERE course2 = ?', [course2], async (err, content2) => {
          sch.query('SELECT * FROM Contents WHERE course3 = ?', [course3], async (err, content3) => {
            sch.query('SELECT * FROM Contents WHERE course4 = ?', [course4], async (err, content4) => {
              sch.query('SELECT * FROM Contents WHERE course5 = ?', [course5], async (err, content5) => {

                return res.status(200).json({ content1, content2, content3, content4, content5 });
              })            
            })          
          })
        })
      })
    })

    

  } catch (error) {
    console.error('Error retrieving course content:', error);
    return res.status(500).json({ message: 'An error occurred while retrieving course content' });
  }
});

// =================================================================================================================

// ............................ADMIN CREATE INSTRUCTOR ............................
app.post('/api/auth/create-instructor', async (req, res) => {
  const { first_name, last_name, email, office, course, phone, sick_leave } = req.body;

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Instructor (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    email VARCHAR(25) NOT NULL,
    office VARCHAR(55) NOT NULL,
    course VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    HMO VARCHAR(255) NULL,
    sickLeave VARCHAR(25) NOT NULL,
    sickLeaveTaken VARCHAR(25) NOT NULL DEFAULT 0,
    id VARCHAR(255) NOT NULL,
    emailToken VARCHAR(255) NOT NULL,
    isverified BOOLEAN NOT NULL DEFAULT 0,
    createdAt TIMESTAMP NOT NULL
  );
`;

sch.query(createTableQuery, (err) => {
  if (err) {
    console.error(err);
    throw new Error('Error creating table');
  }
});

  // Check if the instructor with the same email already exists

  sch.query('SELECT * FROM Instructor WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length !== 0) {
      return res.status(400).json({ message: 'Instructor with email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const id = `${email.substring(0, 2)}${shortid.generate()}${first_name.substring(0, 2)}`;
    const hashedPass = await bcrypt.hash(id, salt);

    // Generate a unique ID based on email and name
    let emailToken = crypto.randomBytes(64).toString("hex");

    const sql = `
        INSERT INTO Instructor (first_name, last_name, email, office, course, phone, sickLeave, id, emailToken)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;


    sch.query(sql, [first_name, last_name, email, office, course, phone, sick_leave, hashedPass, emailToken], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }


      // Create and send an email in an async function
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

      // Call the async function to send the email
      // await sendEmail();
      console.log(id)

      return res.json({ message: 'Instructor created successfully', user: { id, first_name, last_name, email, course, phone, emailToken } });
    });
  });

});

// .............................. INSTRUCTOR LOGIN ....................................
app.post('/api/instructor/instructor-login', async (req, res) => {
  const { email, id } = req.body;


  sch.query('SELECT * FROM Instructor WHERE email = ?', [email], async (err, result) => {

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

    res.json({ token: token, instructor: name, instructor_authorization: result[0].id, course: course, office: result[0].office, email: email });

  });
});

// .............................. ADMIN GET ALL TUTOR DETAILS ..........................................
app.get('/api/auth/instructors', (req, res) => {
  try {
    sch.query('SELECT * FROM Instructor', async (err, instructors) => {
      if (err) {
        console.error('Error retrieving Instructors:', err); // Log the error
        return res.status(500).json({ message: 'Error retrieving tutors' });
      }

      return res.json({ instructors });
    });
  } catch (error) {
    console.error('Error retrieving Instructors:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving Instructors' });
  }
});

// ............................. INSTRUCTOR CREATE CURRICULUM .................................
app.post('/api/instructor/create-curriculum', (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Curriculum (
      id INT AUTO_INCREMENT PRIMARY KEY,
      course VARCHAR(255) NOT NULL,
      mainTopic VARCHAR(255) NOT NULL,
      subTopic VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP NOT NULL
    );
  `;

  sch.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  const { authHeader, course, mainTopic, subTopic } = req.body;

  sch.query('SELECT * FROM Instructor WHERE id = ?', [authHeader], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (result.length === 0) {
      return res.status(401).json({ error: 'Unauthorised to view this page. Please Login' });
    }

    if (result[0].emailToken === null && result[0].isVerified === 0) {
      return res.status(404).json({ error: 'Your account has been suspended. Please contact Ehizua Hub Admin.' });
    }

    if (result[0].isVerified === 0) {
      return res.status(400).json({ error: 'Please verify your account or contact Ehizua Hub Admin for assistance' });
    }



    sch.query('SELECT * FROM Curriculum WHERE mainTopic = ? AND course = ?', [mainTopic, course], async (err, curriculum) => {
      if (curriculum.length > 0) {
        return res.status(401).json({ message: `${mainTopic} Topic already exists` });

      } else {

        // Now, you can insert data into the Curriculum table
        const insertDataQuery = `
              INSERT INTO Curriculum (course, mainTopic, subTopic)
              VALUES (?, ?, ?);
            `;

        const values = [course, mainTopic, subTopic];

        sch.query(insertDataQuery, values, (err) => {
          if (err) {
            console.error(err);
            throw new Error('Error inserting data');
          }
          return res.json({ message: `${mainTopic} curriculum created successfully` });
        });
      }
    })
  })


});

// .............................INSTRUCTOR GET CURRICULUM MAINTOPIC.................................
app.get('/api/instructor/maintopic', (req, res) => {
  const course = req.headers.course;

  sch.query('SELECT * FROM Curriculum WHERE course = ?', [course], async (err, curriculum) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching curriculum data' });
    }


    // Extract MainTopic values from the curriculum data
    const main_topics = JSON.parse(JSON.stringify(curriculum));

    res.json({ message: main_topics });
  });
});

// ............................. INSTRUCTOR GET CURRICULUM SUBTOPIC.................................
app.get('/api/instructor/subtopic', (req, res) => {
  const course = req.headers.course;
  const mainTopic = req.headers.main_topic;

  sch.query('SELECT * FROM Curriculum WHERE course = ? AND mainTopic = ?', [course, mainTopic], async (err, curriculum) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching curriculum data' });
    }


    // Extract subTopic values from the curriculum data
    const topics = JSON.parse(JSON.stringify(curriculum));
    subTopic = topics[0].subTopic
    const arrayOfItems = subTopic.split(', ');

    res.json({ subTopics: arrayOfItems });
  });
});

// ............................. INSTRUCTOR CREATE CONTENT .................................
app.post('/api/tutor/create-content', async (req, res) => {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Contents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mainTopic VARCHAR(255) NOT NULL,
    subTopic VARCHAR(255) NOT NULL,
    content VARCHAR(255) NOT NULL,
    course1 VARCHAR(255) NOT NULL DEFAULT '',
    course2 VARCHAR(255) NOT NULL DEFAULT '',
    course3 VARCHAR(255) NOT NULL DEFAULT '',
    course4 VARCHAR(255) NOT NULL DEFAULT '',
    course5 VARCHAR(255) NOT NULL DEFAULT '',
    createdAt TIMESTAMP NOT NULL
  );
`;

  sch.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });
  const { authHeader, main_topic, content, course, sub_topic } = req.body;

  try {
    sch.query('SELECT * FROM Instructor WHERE id = ?', [authHeader], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (result.length == 0) {
        return res.status(401).json({ error: 'Unauthorised to view this page. Please Login' });
      }

      if (result[0].emailToken === null && result[0].isVerified === 0) {
        return res.status(404).json({ error: 'Your account has been suspended. Please contact Ehizua Hub Admin.' });
      }

      if (result[0].isVerified == 0) {
        return res.status(400).json({ error: 'Please verify your account or contact Ehizua Hub Admin for assistance' });
      }



      // Check if the Content with the same Main Topic and Sub Topic already exists
      sch.query('SELECT * FROM Contents WHERE mainTopic = ? AND subTopic = ?', [main_topic, sub_topic], async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        if (result.length !== 0) {
          return res.status(400).json({ error: 'Topic already exists' });
        }


        const sql = `
        INSERT INTO Contents (mainTopic, content, course1, course2, course3, course4, course5, subTopic)
        VALUES (?, ?, ?, ?)
      `;

        sch.query(sql, [main_topic, content, , sub_topic], async (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }

          return res.json({ message: 'Content created successfully', content: result });
        });
      });

    })

  } catch (error) {
    return res.status(500).json({ message: 'Error creating content' });
  }


});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
