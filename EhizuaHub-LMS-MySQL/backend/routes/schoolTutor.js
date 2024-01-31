const router = require("express").Router();

const { db, sch} = require('../config/db');

//....... JSON WEB TOKEN ............
const createToken = (payload) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  return jwt.sign(payload, jwtSecretKey, { expiresIn: "3d" });
};


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SCHOOL TUTOR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// .........Done..............SCHOOL TUTOR CREATE CURRICULUM .................................
router.post('/create-curriculum', (req, res) => {
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
  router.post('/create-content', async (req, res) => {
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
  router.get('/maintopic', (req, res) => {
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
  router.get('/subtopic', (req, res) => {
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
  router.get('/course-content-list', async (req, res) => {
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
  router.get('/course-content', async (req, res) => {
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
  router.get('/course-curriculum', async (req, res) => {
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
  router.get('/assigned-school', (req, res) => {
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
  router.get('/fetch-classes', (req, res) => {
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
  router.get('/fetch-students-by-classes', (req, res) => {
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
  router.get('/fetch-course_code', (req, res) => {
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
  router.get('/update-course-code', (req, res) => {
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

 // ....................... TUTOR GET LIST OF SCHOOL COURSE CODE ................................
 router.get('/all-subject', async (req, res) => {
  const course = req.headers.course

  sch.query('SELECT * FROM Courses WHERE course = ?', [course], async (err, result) => {

    return res.json({ message: result });

  })
})
  
 // ...............................HUB TUTOR CREATE QUESTION..........................................
 router.post('/create-questions', async (req, res) => {
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

  sch.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });
  const { email, course, mainTopic, subTopic, question, ans1, ans2, ans3, ans4, correctAns, } = req.body;

  try {
    db.query('SELECT * FROM Staff WHERE email = ?', [email], async (err, result) => {
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


      sch.query('SELECT * FROM Questions WHERE question = ? AND mainTopic = ?', [question, mainTopic, subTopic], async (err, result) => {
        if (result.length > 0) {
          return res.status(400).json({ error: 'Question already exists! Set another' });

        } else {
          // Create a new content with the tutor's course
          const sql = `INSERT INTO Questions (course, mainTopic, subTopic, question, ans1, ans2, ans3, ans4, correctAns)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          sch.query(sql, [course, mainTopic, subTopic, question, ans1, ans2, ans3, ans4, correctAns], async (err, newContent) => {
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

  module.exports = router;
