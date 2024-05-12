const router = require("express").Router();
const shortid = require('shortid');
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { db } = require('../config/db'); 


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ADMIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// .............Done........... ADMIN REGISTER EHIZUA STUDENT ................................

router.post('/create-student', async (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Students (
      _id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      id VARCHAR(255) NOT NULL,
      course VARCHAR(255) NOT NULL,
      phone VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      guardiansPhone VARCHAR(255) NOT NULL,
      duration VARCHAR(255) NOT NULL,
      courseFee VARCHAR(255) NOT NULL,
      amountPaid VARCHAR(255) NOT NULL,
      balance VARCHAR(255) NOT NULL,
      certificateApproved BOOLEAN NOT NULL DEFAULT 0,
      homeAddress VARCHAR(255) NOT NULL,
      isVerified BOOLEAN NOT NULL DEFAULT 0,
      emailToken VARCHAR(255) NOT NULL,
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
    title VARCHAR(255) NOT NULL,
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


  const {firstName, lastName, email, course, phone, location, address, guardiansFullname, guardiansPhone, guardiansAddress } = req.body;


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

    const sql = `
        INSERT INTO Students (firstName, lastName, email, course, phone, location, homeAddress, guardiansFullname, guardiansPhone, guardiansAddress, id, emailToken, isVerified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

    db.query(sql, [firstName, lastName, email, course, phone, location, guardiansPhone, address, hashedPass, emailToken], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      db.query('SELECT * FROM LoginAuthorization WHERE email = ?', [email], async (err, result) => {
        const LoginAuthorization = `
          INSERT INTO LoginAuthorization (email, password, user, title, firstName, lastName)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(LoginAuthorization, [email, hashedPass, user, title, first_name, last_name], async (err, result) => {
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
      console.log(id)

      return res.json({ message: 'Student created successfully', user: { id, firstName, lastName, email, course, phone, guardiansPhone, duration, courseFee, amountPaid, balance, homeAddress, emailToken } });
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
  const location = req.headers.location

  try {
    db.query('SELECT * FROM Courses WHERE location = ?', [location], async (err, result) => {

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


// ..............done............... ADMIN APPROVE LEAVE REQUEST ................................
router.put('/approve-leave-request/:id', async (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM LeaveApplication WHERE _id = ?', [id], async (err, leave) => {
    const numberOfDays = parseInt(leave[0].numberOfDays)
    const email = leave[0].email
    db.query('SELECT * FROM Staff WHERE email = ?', [email], async (err, staff) => {
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

// ...............done............... ADMIN GET ALL LEAVE REQUEST ..........................................
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
