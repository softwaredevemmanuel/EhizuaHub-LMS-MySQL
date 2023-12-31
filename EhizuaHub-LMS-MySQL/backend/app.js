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

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<ADMIN>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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

// ............................. ADMIN REGISTER OFFICE ................................
app.post('/api/auth/register-office', async (req, res) => {
  const { officeName, officePhoneNumber, officeEmail, state, officeAddress } = req.body;

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

      return res.json({ message: 'Office Registered successfully' });
    });
  });
});

// ............................. ADMIN GET LIST OF OFFICES ................................
app.get('/api/auth/all_offices', async (req, res) => {
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

  db.query('SELECT * FROM Offices', async (err, result) => {
    return res.json({ message: result });

  })
})

// ============= SCHOOL

// ............................. ADMIN REGISTER SCHOOL ................................
app.post('/api/auth/create-school', async (req, res) => {
  const { schoolName, checkedCourses, monday, tuesday, wednesday, thursday, friday, saturday, email, phone, course, duration, courseFee, amountPaid, schoolAddress } = req.body;

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
  // Check if the school with the same name already exists
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
      INSERT INTO PartnerSchools (schoolName, courses, monday, tuesday, wednesday, thursday, friday, saturday, email, phone, duration, courseFee, amountPaid, schoolAddress)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;


    // Convert checkedCourses array to a string
    const coursesString = checkedCourses.join(', ');

    sch.query(sql, [schoolName, coursesString, monday, tuesday, wednesday, thursday, friday, saturday, email, phone, duration, courseFee, amountPaid, schoolAddress], async (err, result) => {
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
app.get('/api/auth/partner-schools', async (req, res) => {

  sch.query('SELECT * FROM PartnerSchools', async (err, result) => {
    return res.json({ message: result });

  })
})

// ............................. ADMIN GET PARTNER SCHOOLS REGISTERED COURSES................................
app.get('/api/auth/partner-schools-course', async (req, res) => {
  const school = req.headers.school;

  sch.query(`SELECT * FROM PartnerSchools WHERE schoolName = ?`, [school], async (err, result) => {
    if (result.length > 0) {
      const coursesArray = result[0].courses.split(',').map(course => course.trim());
      return res.json({ courses: coursesArray });
    } else {
      return res.status(404).json({ message: 'School not found' });
    }
  });
});

// ............................. ADMIN REGISTER SCHOOL STUDENT ................................
app.post('/api/auth/register-school-student', async (req, res) => {
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
      INSERT INTO ${school} (school, firstName, lastName, level, courses, year, term, guardiansPhone, email, password, emailToken)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      const coursesString = checkedCourses.join(', ');

      sch.query(sql, [school, firstName, lastName, level, coursesString, year, term, guardiansPhone, email, password, emailToken], async (err, result) => {
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
app.get('/api/auth/partner-school-students', async (req, res) => {

  const schoolName = req.headers.schoolname

  const school = schoolName.replace(/\s/g, '')


  sch.query(`SELECT * FROM ${school}`, async (err, result) => {
    // console.log(result)
    return res.json({ message: result });

  })
})

// ............................ADMIN CREATE A NEW SCHOOL COURSE ............................
app.post('/api/auth/create-subject', async (req, res) => {
  const { course } = req.body;

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Courses (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    course VARCHAR(255) NOT NULL,
    courseCode VARCHAR(255) NOT NULL
    
  );
`;

  sch.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  // Check if the Course with the same name already exists

  sch.query('SELECT * FROM Courses WHERE course = ?', [course], async (err, result) => {
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
        INSERT INTO Courses (course, courseCode)
        VALUES (?, ?)
      `;


    sch.query(sql, [course, resultString], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      return res.json({ message: `${course} created successfully` });
    });
  });

});


//============ ADMIN EHIZUA STUDENTS

// ............................ADMIN CREATE A NEW UPSKILL COURSE ............................
app.post('/api/auth/create-course', async (req, res) => {
  const { course, price, duration } = req.body;

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Courses (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    course VARCHAR(255) NOT NULL,
    price INT(30) NOT NULL,
    durationInWeeks INT(255) NOT NULL
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


    const sql = `
        INSERT INTO Courses (course, price, durationInWeeks)
        VALUES (?, ?, ?)
      `;


    db.query(sql, [course, price, duration], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      return res.json({ message: `${course} created successfully` });
    });
  });

});

// ...........done.................ADMIN CREATE DISCOUNT UPSKILL COURSE ............................
app.post('/api/auth/create-discount-course', async (req, res) => {

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
app.put('/api/auth/create-discount-course/:idParam', async (req, res) => {

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

  }else{
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


// ............................. ADMIN GET UPSKILL COURSES ................................
app.get('/api/auth/all_upskill_courses', async (req, res) => {

  try {
    db.query('SELECT * FROM Courses', async (err, result) => {

      return res.json({ message: result });

    })

  } catch {

  }


})

// ............................. ADMIN GET DISCOUNT COURSES ................................
app.get('/api/auth/discount-courses', async (req, res) => {

  try {
    db.query('SELECT * FROM CourseDiscount', async (err, result) => {

      return res.json({ message: result });

    })

  } catch {

  }


})

// ............................. ADMIN EDIT DISCOUNT COURSE ................................
app.put('/api/auth/update-discount-course/:id', async (req, res) => {
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
app.get('/api/auth/all-students', (req, res) => {

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
app.get('/api/auth/students/course-email', (req, res) => {
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
app.get('/api/auth/sort-students/location', (req, res) => {
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
app.get('/api/auth/sort-students/location-course', (req, res) => {
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
app.get('/api/auth/upskill-course-curriculum', async (req, res) => {

  const course = req.headers.course;

  db.query('SELECT * FROM Curriculum WHERE course = ?', [course], async (err, content) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching course content' });
    }
    return res.json({ content });
  });


});

// .............Done........... ADMIN REGISTER EHIZUA STUDENT ................................
app.post('/api/auth/create-student', async (req, res) => {
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
    profilePicture VARCHAR(255) NOT NULL DEFAULT 0,
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

  const { selectedValue, firstName, lastName, email, course, phone, location, guardiansPhone, duration, courseFee, amountPaid, homeAddress } = req.body;


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
      INSERT INTO Students (firstName, lastName, email, course, phone, location, guardiansPhone, duration, courseFee, amountPaid, balance, homeAddress, id, emailToken, isVerified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [firstName, lastName, email, course, phone, location, guardiansPhone, duration, courseFee, amountPaid, balance, homeAddress, hashedPass, emailToken, selectedValue], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
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
      console.log(id)

      return res.json({ message: 'Student created successfully', user: { id, firstName, lastName, email, course, phone, guardiansPhone, duration, courseFee, amountPaid, balance, homeAddress, emailToken } });
    });
  });
});

// ............................. ADMIN EDIT EHIZUA STUDENT ................................
app.put('/api/auth/update-student/:id', async (req, res) => {
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

// ============== STAFF
// ..........done..................ADMIN CREATE STAFF ............................
app.post('/api/auth/create-staff', async (req, res) => {

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Staff (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    dateOfBirth VARCHAR(255) NOT NULL,
    office VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    hubInstructor VARCHAR(255) NOT NULL DEFAULT 0,
    schoolInstructor VARCHAR(255) NOT NULL DEFAULT 0,
    phone VARCHAR(255) NOT NULL,
    accountNumber VARCHAR(255) NOT NULL,
    bank VARCHAR(255) NOT NULL,
    sickLeave VARCHAR(255) NOT NULL,
    id VARCHAR(255) NOT NULL,
    emailToken VARCHAR(255) NOT NULL,
    HMO VARCHAR(255) NOT NULL DEFAULT 10,
    homeAddress VARCHAR(255) NOT NULL,
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


  const { first_name, last_name, email, dateOfBirth, office, position, hubInstructor, schoolInstructor, school, phone, accountNumber, bankName, sick_leave, homeAddress, nextOfKinNumber, nextOfKinAddress, hubCourse, schoolCourse } = req.body;

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
    const id = `${email.substring(0, 2)}${shortid.generate()}${first_name.substring(0, 2)}`;
    const hashedPass = await bcrypt.hash(id, salt);

    // Generate a unique ID based on email and name
    let emailToken = crypto.randomBytes(64).toString("hex");


    const sql = `
        INSERT INTO Staff (first_name, last_name, email, dateOfBirth, office, position, hubInstructor, schoolInstructor, phone, accountNumber, bank, sickLeave, id, emailToken, homeAddress, nextOfKinPhoneNumber, nextOfKinAddress )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
    db.query(sql, [first_name, last_name, email, dateOfBirth, office, position, hubInstructor, schoolInstructor, phone, accountNumber, bankName, sick_leave, hashedPass, emailToken, homeAddress, nextOfKinNumber, nextOfKinAddress], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      // Convert checkedCourses array to a string
      const hubCourseInString = hubCourse.join(', ');
      const schoolCourseInString = schoolCourse.join(', ');

      // Convert checkedSchool array to a string
      const schoolString = school.join(', ');

      if (hubInstructor) {
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

          db.query(hubInstructor, [first_name, last_name, email, hubCousreStatus, office, phone], async (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }
          })

        });
      }

      if (schoolInstructor) {
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
          db.query(SchoolInstructor, [first_name, last_name, email, schoolCousreStatus, office, phone, schoolStatus], async (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }
          })

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

      return res.json({ message: 'Staff created successfully' });


    })
  })
});

// ..........done.................... ADMIN GET ALL STAFF DETAILS ..........................................
app.get('/api/auth/staff', (req, res) => {

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Staff (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    dateOfBirth VARCHAR(255) NOT NULL,
    office VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    hubInstructor VARCHAR(255) NOT NULL DEFAULT 0,
    schoolInstructor VARCHAR(255) NOT NULL DEFAULT 0,
    phone VARCHAR(255) NOT NULL,
    accountNumber VARCHAR(255) NOT NULL,
    bank VARCHAR(255) NOT NULL,
    sickLeave VARCHAR(255) NOT NULL,
    sickLeaveTaken INT(100) DEFAULT 0,
    id VARCHAR(255) NOT NULL,
    emailToken VARCHAR(255) NOT NULL,
    HMO VARCHAR(255) NOT NULL DEFAULT 10,
    homeAddress VARCHAR(255) NOT NULL,
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

  try {
    db.query('SELECT * FROM Staff', async (err, staff) => {
      if (err) {
        console.error('Error retrieving Staff:', err); // Log the error
        return res.status(500).json({ message: 'Error retrieving Staff' });
      }

      return res.json({ staff });
    });
  } catch (error) {
    console.error('Error retrieving Staff:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving Staff' });
  }
});

// ............................. ADMIN EDIT STAFF ................................
app.put('/api/auth/update-staff/:id', async (req, res) => {
  const tutorId = req.params.id; // Get the student's ID from the route parameter
  const { firstName, lastName, email, dateOfBirth, office, position, hubInstructor, schoolInstructor, phone, accountNumber, bank, sickLeave, HMO, homeAddress, isVerified, } = req.body;

  // Update the Staff's information in the database
  const sql = `
    UPDATE Staff
    SET
      first_name = ?,
      last_name = ?,
      email = ?,
      dateOfBirth = ?,
      office = ?,
      position = ?,
      hubInstructor = ?,
      schoolInstructor = ?,
      phone = ?,
      accountNumber = ?,
      bank = ?,
      sickLeave = ?,
      HMO = ?,
      homeAddress = ?,
      isVerified = ?
    WHERE _id = ?
  `;


  db.query(
    sql,
    [firstName, lastName, email, dateOfBirth, office, position, hubInstructor, schoolInstructor, phone, accountNumber, bank, sickLeave, HMO, homeAddress, isVerified, tutorId],
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

// .............done................ ADMIN REJECT LEAVE REQUEST ................................
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


// ..............done............... ADMIN APPROVE LEAVE REQUEST ................................
app.put('/api/auth/approve-leave-request/:id', async (req, res) => {
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
app.get('/api/auth/staff-leave-request', (req, res) => {


  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS LeaveApplication (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    numberOfDays VARCHAR(255) NOT NULL,
    leaveStartDate VARCHAR(255) NOT NULL,
    leaveEndDate VARCHAR(255) NOT NULL,
    purposeOfLeave VARCHAR(255) NOT NULL,
    allocatedLeave VARCHAR(255) NOT NULL,
    daysRemaining VARCHAR(255) NOT NULL,
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
app.get('/api/auth/hub_instructor/location', (req, res) => {

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
app.get('/api/auth/hub_instructor', (req, res) => {

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

// ============== SCHOOL INSTRUCTORS
// .............................. ADMIN GET ALL SCHOOL INSTRUCTOR BY LOCATION ..........................................
app.get('/api/auth/school_instructor/location', (req, res) => {

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
app.get('/api/auth/school_instructor', (req, res) => {

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
app.put('/api/auth/update-school-instructor/:id', async (req, res) => {
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

// ............................. ADMIN GET LIST OF SCHOOL COURSE ................................
app.get('/api/auth/all_school_subject', async (req, res) => {

  sch.query('SELECT * FROM Courses', async (err, result) => {

    return res.json({ message: result });

  })
})



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< STAFF >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// .................................STAFF APPLY FOR LEAVE ...................................
app.post('/api/staff/leave-application', async (req, res) => {
  const leaveRequest = req.body


  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS LeaveApplication (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    numberOfDays VARCHAR(255) NOT NULL,
    leaveStartDate VARCHAR(255) NOT NULL,
    leaveEndDate VARCHAR(255) NOT NULL,
    purposeOfLeave VARCHAR(255) NOT NULL,
    allocatedLeave VARCHAR(255) NOT NULL,
    daysRemaining VARCHAR(255) NOT NULL,
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

    db.query('SELECT * FROM Staff WHERE email = ?', [leaveRequest.email], async (err, result) => {
      const position = result[0].position
      const allocatedLeave = result[0].sickLeave
      const daysRemaining = result[0].sickLeaveTaken

      db.query('SELECT * FROM LeaveApplication', async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }


        const sql = `
              INSERT INTO LeaveApplication (fullName, email, location, position, numberOfDays, leaveStartDate, leaveEndDate, purposeOfLeave, allocatedLeave, daysRemaining)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;


        db.query(sql, [leaveRequest.name, leaveRequest.email, leaveRequest.office, position, leaveRequest.formData.selectedDays, leaveRequest.formData.leaveStartDate, leaveRequest.formData.leaveEndDate, leaveRequest.formData.purposeOfLeave, allocatedLeave, daysRemaining], async (err, result) => {

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

// ..........................STAFF  VERIFICATION EMAIL ..................................
app.post('/api/staff/verify-tutor-email', async (req, res) => {
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
app.post('/api/staff/login', async (req, res) => {
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

// ...........................STAFF FORGET PASSWORD ..........................
app.post('/api/staff/forgot_password', async (req, res) => {
  const { email } = req.body;
  try {
    db.query('SELECT * FROM Staff WHERE email = ?', [email], async (err, result) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }
      // If there are no users with that email address in our database then we have to tell the client they don't exist!

      if (result.length === 0) {
        return res.status(401).json({ error: 'No Staff with Email found' });
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
         UPDATE Staff
         SET id = ?
         WHERE email = ?
       `;
      db.query(updateSql, [updatedId, email], async (err, updateResult) => {
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



        res.status(200).json(`Password has been sent to ${email}. `);

      });

    });

  } catch {
    return res.json('Something went wrong')
  }

})

// ........................... STAFF DETAILS ..........................................

app.get('/api/staff/details', (req, res) => {

  const { email } = req.headers

  try {
    db.query('SELECT * FROM Staff WHERE email = ?', [email], async (err, staff) => {
      if (err) {
        console.error('Error retrieving Staff:', err); // Log the error
        return res.status(500).json({ message: 'Error retrieving Staff' });
      }

      const sickLeaveRemaining = parseInt(staff[0].sickLeave) - parseInt(staff[0].sickLeaveTaken)
      return res.json({ staff, leaveLeft: sickLeaveRemaining });
    });
  } catch (error) {
    console.error('Error retrieving Staff:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving Staff' });
  }
});

// ........................... STAFF FILTER ALL LEAVE REQUEST ..........................................
app.get('/api/staff/leave-request', (req, res) => {


  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS LeaveApplication (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    numberOfDays VARCHAR(255) NOT NULL,
    leaveStartDate VARCHAR(255) NOT NULL,
    leaveEndDate VARCHAR(255) NOT NULL,
    purposeOfLeave VARCHAR(255) NOT NULL,
    allocatedLeave VARCHAR(255) NOT NULL,
    daysRemaining VARCHAR(255) NOT NULL,
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
      return res.json({ leave });
    });
  } catch (error) {
    console.error('Error retrieving leave application:', error); // Log the error
    return res.status(500).json({ message: 'Error retrieving tutors' });
  }
});





// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< EHIZUA STUDENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// .......................... STUDENT VERIFICATION EMAIL ..................................
app.post('/api/students/verify-student-email', async (req, res) => {
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
    res.json({ token: token, user: name, authHeader: result[0].id, course: course, location: result[0].location});

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

// ............................ STUDENT DISCOUNT COURSE SECTION ...............................
app.get('/api/students/course-advert', async (req, res) => {
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

// ............................ STUDENT COURSE CONTENT ...............................
app.get('/api/students/student-course-content', async (req, res) => {

  const { authheader, courses } = req.headers;

  try {
    db.query('SELECT * FROM Students WHERE id = ?', [authheader], async (err, response) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }

      if (response[0].emailToken === null && response[0].isVerified === 0) {
        return res.status(404).json("Your account has been suspended. Please contact Ehizua Hub Admin.");
      }



      db.query('SELECT * FROM Contents WHERE course = ?', [courses], async (err, content) => {
        return res.status(200).json({ content });
      })
    })

  } catch (error) {
    console.error('Error retrieving course content:', error);
    return res.status(500).json({ message: 'An error occurred while retrieving course content' });
  }
});


// ................................. GET QUESTIONS ..........................................
app.get('/api/students/questions', async (req, res) => {
  const authHeader = req.headers.authheader;
  const subTopic = req.headers.sub_topic;
  const course = req.headers.course;
  const email = req.headers.email;


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

            const totalQuestions = questionsResponse.length

            return res.json({ message: `${subTopic} Questions`, questions, totalQuestions: totalQuestions });
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
          const totalQuestions = questionsResponse.length

          return res.json({ message: `${subTopic} Questions`, questions, totalQuestions: totalQuestions });
        });
      });
    }
  });
});



// ....................SubmitedQuestion Students Question..........................................
app.post('/api/students/submit_questions', async (req, res) => {
  const questionsArray = req.body; // Array of question objects


  try {
    const submittedQuestions = [];

    for (const { sub_topic, course, question, ans, email } of questionsArray) {
      db.query(
        'SELECT * FROM SubmittedQuestions WHERE subTopic = ? AND course = ? AND email = ?',
        [sub_topic, course, email, question],
        async (err, questionsResponse) => {
          if (err) {
            console.error('Error executing SELECT query:', err);
            return res.status(500).json({ message: 'Error submitting questions' });
          }

          if (questionsResponse.length > 0) {

            // Delete the existing submission's ans field
            db.query(
              'DELETE FROM SubmittedQuestions WHERE subTopic = ? AND course = ? AND email = ?',
              [sub_topic, course, email],
              async (err, result) => {
                if (err) {
                  console.error('Error executing DELETE query:', err);
                  return res.status(500).json({ message: 'Error deleting questions' });
                }

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
  const totalQuestions = req.headers.totalquestions


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

        console.log(totalQuestions)
        const cal = (score / parseInt(totalQuestions)) * 100;
        console.log(cal)
        const percentageScore = cal.toFixed(1);
        console.log(percentageScore)
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
                    if (currentScore == prevScore) {
                      db.query(
                        'UPDATE Percentage SET score = ?, isPassed = ?, updatedAt = CURRENT_TIMESTAMP WHERE subTopic = ? AND course = ? AND email = ?',
                        [percentageScore, myPercent ? 1 : 0, subTopic, course, email],
                        async (err, updateResponse) => {

                          // add a condition if need be
                          return res.json({ message: `previous score ${prevScore}, Current Score ${percentageScore}. Please Try again` });

                        }
                      );


                    }else if (currentScore < prevScore) {
                      db.query(
                        'UPDATE Percentage SET score = ?, isPassed = ?, updatedAt = CURRENT_TIMESTAMP WHERE subTopic = ? AND course = ? AND email = ?',
                        [percentageScore, myPercent ? 1 : 0, subTopic, course, email],
                        async (err, updateResponse) => {

                          // add a condition if need be
                          return res.json({ message: `previous score ${prevScore}, Current Score ${percentageScore}. This score will not be updated` });

                        }
                      );


                    }else {

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
                  

                    if (prevScore > percentageScore) {
                      return res.json({ message: `previous score ${prevScore}, Current Score ${percentageScore}. This score will not be updated` });

                    } else {
                      db.query(
                        'UPDATE Percentage SET score = ?, isPassed = ?, updatedAt = CURRENT_TIMESTAMP WHERE subTopic = ? AND course = ? AND email = ?',
                        [percentageScore, myPercent ? 1 : 0, subTopic, course, email],
                        async (err, updateResponse) => {

                          return res.json({ message: `Previous score has been updated` });


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
              if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
              }

              // Check if the insertion was successful
              if (insertResponse.affectedRows === 1) {
                // The record was successfully inserted
                return res.json({ message: 'Record inserted successfully' });
              } else {
                // The record was not inserted
                return res.status(500).send('Failed to insert record');
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



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HUB TUTOR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// ........................... HUB TUTOR CREATE CURRICULUM .................................
app.post('/api/hub-tutor/create-curriculum', (req, res) => {
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

  db.query('SELECT * FROM Staff WHERE id = ?', [authHeader], async (err, result) => {
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
              INSERT INTO Curriculum (course, mainTopic, subTopic, courseCode)
              VALUES (?, ?, ?, ?);
            `;

        const values = [course, mainTopic, subTopic, courseCode];

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

// ............................. GET HUB CURRICULUM MAINTOPIC.................................
app.get('/api/tutor/hub-maintopic', (req, res) => {
  const course = req.headers.course;
  console.log(course)

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

// ............................. GET HUB CURRICULUM SUBTOPIC.................................
app.get('/api/tutor/hub-subtopic', (req, res) => {
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

// .........Done...............  HUB TUTOR CREATE COURSE CONTENT .................................
app.post('/api/tutor/create-hub-content', async (req, res) => {
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
    db.query('SELECT * FROM Staff WHERE id = ?', [authHeader], async (err, result) => {
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

// .......................... TUTOR GET HUB COURSE CONTENT ..........................................
app.get('/api/tutor/hub-course-content', async (req, res) => {
  const authHeader = req.headers.authheader;
  const course = req.headers.course;


  try {
    db.query('SELECT * FROM Staff WHERE id = ?', [authHeader], async (err, result) => {
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

// .......................... TUTOR GET HUB COURSE CURRICULUM ..........................................
app.get('/api/tutor/hub-course-curriculum', async (req, res) => {
  const authHeader = req.headers.authheader;
  const course = req.headers.course;


  try {
    db.query('SELECT * FROM Staff WHERE id = ?', [authHeader], async (err, result) => {
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

      db.query('SELECT * FROM Curriculum WHERE course = ?', [course], async (err, content) => {
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

// ............................. GET TUTOR STUDENTS ..........................................
app.get('/api/tutor/students', async (req, res) => {
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

// ...............................HUB TUTOR CREATE QUESTION..........................................
app.post('/api/tutor/hub-create-questions', async (req, res) => {
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
  const { email, course, mainTopic, subTopic, question, ans1, ans2, ans3, ans4, correctAns, } = req.body;

  try {
    db.query('SELECT * FROM HubInstructors WHERE email = ?', [email], async (err, result) => {
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

// ....................... TUTOR GET LIST OF SCHOOL COURSE CODE ................................
app.get('/api/auth/all-school-subject', async (req, res) => {
  const course = req.headers.course

  sch.query('SELECT * FROM Courses WHERE course = ?', [course], async (err, result) => {

    return res.json({ message: result });

  })
})



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SCHOOL TUTOR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// .........Done..............SCHOOL TUTOR CREATE CURRICULUM .................................
app.post('/api/school-tutor/create-curriculum', (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Curriculum (
      id INT AUTO_INCREMENT PRIMARY KEY,
      course VARCHAR(255) NOT NULL,
      mainTopic VARCHAR(255) NOT NULL,
      subTopic VARCHAR(255) NOT NULL,
      courseCode VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP NOT NULL
    );
  `;

  sch.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });

  const { authHeader, course, mainTopic, subTopic, courseCode } = req.body;

  db.query('SELECT * FROM Staff WHERE id = ?', [authHeader], async (err, result) => {
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
              INSERT INTO Curriculum (course, mainTopic, subTopic, courseCode)
              VALUES (?, ?, ?, ?);
            `;

        const values = [course, mainTopic, subTopic, courseCode];

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

// .........Done........... TUTOR CREATE SCHOOL COURSE CONTENT .................................
app.post('/api/tutor/create-school-content', async (req, res) => {
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

  sch.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });
  const { authHeader, main_topic, content, course, sub_topic } = req.body;

  try {
    db.query('SELECT * FROM Staff WHERE id = ?', [authHeader], async (err, result) => {
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
        INSERT INTO Contents (mainTopic, content, course, subTopic)
        VALUES (?, ?, ?, ?)
      `;

        sch.query(sql, [main_topic, content, course, sub_topic], async (err, result) => {
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

// ..........Done................ GET SCHOOL CURRICULUM MAINTOPIC.................................
app.get('/api/tutor/school-maintopic', (req, res) => {
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

// ...........Done.............. GET SCHOOL CURRICULUM SUBTOPIC.................................
app.get('/api/tutor/school-subtopic', (req, res) => {
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

// .......done............... TUTOR GET SCHOOL COURSE CONTENT LIST ..........................................
app.get('/api/tutor/school-course-content-list', async (req, res) => {
  const authHeader = req.headers.authheader;
  const course = req.headers.course;


  try {
    db.query('SELECT * FROM Staff WHERE id = ?', [authHeader], async (err, result) => {
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

      sch.query('SELECT * FROM Contents WHERE course = ?', [course], async (err, content) => {
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

// .......done............... TUTOR GET SCHOOL COURSE CONTENT  ..........................................
app.get('/api/tutor/school-course-content', async (req, res) => {
  const authHeader = req.headers.authheader;
  const id = req.headers.id;
  console.log(id)


  try {
    db.query('SELECT * FROM Staff WHERE id = ?', [authHeader], async (err, result) => {
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

      sch.query('SELECT * FROM Contents WHERE id = ?', [id], async (err, content) => {
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

// .......Done................ TUTOR GET SCHOOL COURSE CURRICULUM ..........................................
app.get('/api/tutor/school-course-curriculum', async (req, res) => {
  const authHeader = req.headers.authheader;
  const course = req.headers.course;



  try {
    db.query('SELECT * FROM Staff WHERE id = ?', [authHeader], async (err, result) => {
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

      sch.query('SELECT * FROM Curriculum WHERE course = ?', [course], async (err, content) => {
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

// .......Done................... GET INSTRUCTOR SCHOOLS ..........................................
app.get('/api/tutor/assigned-school', (req, res) => {
  const email = req.headers.email

  try {
    db.query('SELECT * FROM SchoolInstructors WHERE email = ?', [email], async (err, staff) => {
      if (err) {
        console.error('Error retrieving School Instructors:', err);
        return res.status(500).json({ message: 'Error retrieving School Instructors' });
      }
      const schools = staff[0].school

      return res.json({ schools });
    });
  } catch (error) {
    console.error('Error retrieving Hub Instructors Details:', error);
    return res.status(500).json({ message: 'Error retrieving School Instructors' });
  }
});

// ........Done.................. GET ALL CLASSES LIST (EG Primary 1)..........................................
app.get('/api/tutor/fetch-school-classes', (req, res) => {
  const { school, course } = req.headers
  const words = school.split(' ')

  // Remove Spaces from the School
  const schools = words.map((word) => word).join('');

  if (schools == '') {
    return res.json({ student: [] });

  } else {

    try {
      sch.query(`SELECT * FROM ${schools} WHERE isVerified = ? AND courses REGEXP ?`, [1, `\\b${course}\\b`], async (err, student) => {
        if (err) {

          return res.status(500).json({ message: 'Error retrieving Students' });
        }

        return res.json({ student });
      });

    } catch (error) {
      return res.status(500).json({ message: 'Error retrieving Students' });
    }
  }

});

// ........Done.................. GET INSTRUCTOR  CLASS STUDENT..........................................
app.get('/api/tutor/fetch-students-by-classes', (req, res) => {
  const { studentclass, school, course } = req.headers

  const words = school.split(' ')

  // Remove Spaces from the School
  const schools = words.map((word) => word).join('');

  if (schools && studentclass) {
    try {
      sch.query(`SELECT * FROM ${schools} WHERE level = ? AND isVerified = ?  AND courses REGEXP ?`, [studentclass, 1, `\\b${course}\\b`], async (err, student) => {
        if (err) {

          return res.status(500).json({ message: 'Error retrieving Students' });
        }

        return res.json({ student });
      });

    } catch (error) {
      return res.status(500).json({ message: 'Error retrieving Students' });
    }

  } else {
    return res.json({ student: [] });

  }

});

// .........Done................. INSTRUCTOR GET SCHOOL COURSE CODE ..........................................
app.get('/api/tutor/fetch-course_code', (req, res) => {
  const course = req.headers.course

  try {
    sch.query(`SELECT * FROM Courses WHERE course = ?`, [course], async (err, courseCode) => {
      if (err) {

        return res.status(500).json({ message: 'Error retrieving Course Code' });
      }
      const courseCodeString = courseCode[0].courseCode

      return res.json({ courseCodeString });
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving Course Code' });
  }


});

// ..........Done................ INSTRUCTOR UPDATE STUDENT COURSE CODE ..........................................
app.get('/api/tutor/update-course-code', (req, res) => {
  const { studentids, coursecode, selectedschool } = req.headers;
  const studentIdArray = studentids.split(',').map(id => parseInt(id, 10));

  const school = selectedschool.replace(/\s+/g, '');

  const updateQuery = `
    UPDATE ${school}
    SET courseCode = CONCAT(courseCode, ', ', ?)
    
    WHERE id IN (?) AND NOT EXISTS (
      SELECT 1 FROM ${school} AS subquery
      WHERE subquery.id = ${school}.id AND subquery.courseCode LIKE ?
    )
  `;



  sch.query(updateQuery, [coursecode, studentIdArray, `%${coursecode}%`], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error updating students' });
    }

    return res.json({ studentIdArray: "Students course code updated successfully" });
  });
});





// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SCHOOL PUPILS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


// .................................SCHOOL PUPIL LOGIN ...........................................
app.post('/api/school_pupils/login', async (req, res) => {
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

    if (result[(result.length) - 1].password !== id) {
      return res.status(401).json({ message: 'Wrong Email or Password' });
    }


    if (result[(result.length) - 1].isVerified === 0) {
      return res.status(400).json({ message: 'Please verify your account.. Or contact Ehizua Hub Admin for assistance' });
    }

    if (result[(result.length) - 1].emailToken === null && result[(result.length) - 1].isVerified === 0) {
      return res.status(404).json("Your account has been suspended. Please contact Ehizua Hub Admin.");
    }
    if (!id === result[(result.length) - 1].password) {
      return res.status(404).json({ message: "Wrong Email or Password." });

    }




    const name = (`${result[0].firstName} ${result[0].lastName}`);
    const course = (result[0].courses);
    const payload = { id: result[0]._id };
    const token = createToken(payload);
    res.json({ token: token, user: name, authHeader: result[0].id, course: course });

  });
});


// .................................... PUPILS COURSE SECTION ...............................
app.get('/api/school_pupils/course-section', async (req, res) => {

  const { email, school } = req.headers;
  const words = school.split(' ');
  const schoolSelected = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');


  try {
    sch.query(`SELECT * FROM ${schoolSelected} WHERE email = ? AND school = ?`, [email, schoolSelected], async (err, response) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }

      if (response[0].emailToken === null && response[0].isVerified === 0) {
        return res.status(404).json("Your account has been suspended. Please contact Ehizua Hub Admin.");
      }

      const currentDate = new Date();
      const options = { month: 'numeric', day: '2-digit', year: 'numeric' };
      const formattedString = currentDate.toLocaleDateString('en-US', options).replace(/\//g, '');
      const term = response[(response.length) - 1].term
      const year = response[(response.length) - 1].year
      const session = `${term}${year}`


      const course = (response[(response.length - 1)].courses)
      const ArrayCourse = course.split(', ')

      return res.json({ message: ArrayCourse });


    })



  } catch (error) {
    console.error('Error retrieving course content:', error);
    return res.status(500).json({ message: 'An error occurred while retrieving course content' });
  }
});


// .................................... PUPILS COURSE CURRICULUM ...............................
app.get('/api/school_pupils/course-curriculum', async (req, res) => {
  const { email, school, course } = req.headers;
  const words = school.split(' ');
  const schoolSelected = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');

  sch.query(`SELECT * FROM ${schoolSelected} WHERE email = ? AND school = ?`, [email, schoolSelected], async (err, pupil) => {
    const courseList = pupil[(pupil.length - 1)].courseCode
    const courseCode = courseList.split(', ')

    try {
      sch.query(`SELECT * FROM Curriculum WHERE course = ?`, [course], async (err, response) => {
        if (err) {
          return res.status(500).send('Internal Server Error');
        }

        let myCourse = [];
        const queries = [];

        for (let i = 0; i < courseCode.length; i++) {
          const queryPromise = new Promise((resolve, reject) => {
            sch.query(`SELECT * FROM Curriculum WHERE course = ? AND courseCode = ?`, [course, courseCode[i]], (err, store) => {
              if (err) {
                reject(err);
              } else {
                // Only push to myCourse if store has a value
                if (store.length > 0) {
                  myCourse.push(store[0]);
                }
                resolve(store);
              }
            });
          });

          queries.push(queryPromise);
        }

        // Wait for all queries to complete
        Promise.all(queries)
          .then(results => {
            // console.log(myCourse);
            return res.json({ message: myCourse });
          })
          .catch(error => {
            console.error('Error executing queries:', error);
          });




      })
    } catch (error) {
      console.error('Error retrieving course content:', error);
      return res.status(500).json({ message: 'An error occurred while retrieving course content' });
    }
  })
});

// .................................... PUPILS COURSE CONTENT ...............................
app.get('/api/school_pupils/course-content', async (req, res) => {
  const { subtopic, maintopic } = req.headers;

  sch.query(`SELECT * FROM Contents WHERE mainTopic = ? AND subTopic = ?`, [maintopic, subtopic], async (err, pupil) => {
    if (pupil.length == 0) {
      return res.json({
        message: [{
          mainTopic: maintopic,
          subTopic: subtopic,
          content: 'SORRY!! THIS CONTENT IS NOT YET AVAILABLE AT THE MOMENT..... CONTACT YOUR INSTRUCTOR FOR FURTHER INSTRUCTIONS',
        }]
      });

    }

    return res.json({ message: pupil });

  })
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
