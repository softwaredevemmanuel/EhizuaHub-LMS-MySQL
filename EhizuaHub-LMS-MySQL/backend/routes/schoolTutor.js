const router = require("express").Router();

const { db, sch } = require('../config/db');

//....... JSON WEB TOKEN ............
const createToken = (payload) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  return jwt.sign(payload, jwtSecretKey, { expiresIn: "3d" });
};


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SCHOOL TUTOR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// ............emma................. GET INSTRUCTOR COURSES.................................
router.get('/instructor-course', (req, res) => {
  const email = req.headers.email;

  db.query('SELECT * FROM SchoolInstructors WHERE email = ?', [email], async (err, hubInstructor) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching curriculum data' });
    }
    const coursesArray = hubInstructor[0].courses.split(',')


    res.json({ courses: coursesArray });

  });

});

// ............emma............... SCHOOL TUTOR CREATE CURRICULUM .................................
router.post('/create-curriculum', (req, res) => {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS SchoolCurriculum (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course VARCHAR(255) NOT NULL,
        mainTopic VARCHAR(255) NOT NULL,
        subTopic VARCHAR(255) NOT NULL,
        courseCode VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP NOT NULL
      );
    `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });


  const { course, mainTopic, subTopicArray, courseCode } = req.body;

  const subTopic = subTopicArray.join(', ')


  db.query('SELECT * FROM SchoolCurriculum WHERE mainTopic = ? AND course = ?', [mainTopic, course], async (err, curriculum) => {
    if (curriculum.length > 0) {
      return res.status(401).json({ message: `${mainTopic} Topic already exists` });

    } else {

      // Now, you can insert data into the Curriculum table
      const insertDataQuery = `
                INSERT INTO SchoolCurriculum (course, mainTopic, subTopic, courseCode)
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


});

// .............emma..........GET LIST OF SCHOOL COURSES/CODE ................................
router.get('/school-courses', async (req, res) => {
  const course = req.headers.course

  db.query('SELECT * FROM SchoolCourses WHERE course = ?', [course], async (err, result) => {

    return res.json({ message: result });

  })
})

// ................emma............. GET SCHOOL CURRICULUM MAINTOPIC.................................
router.get('/maintopic', (req, res) => {
  const course = req.headers.course;

  db.query('SELECT * FROM SchoolCurriculum WHERE course = ?', [course], async (err, curriculum) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching curriculum data' });
    }

    // Extract MainTopic values from the curriculum data
    const main_topics = JSON.parse(JSON.stringify(curriculum));

    res.json({ message: main_topics });
  });
});

// ...............emma.............. GET SCHOOL CURRICULUM SUBTOPIC.................................
router.get('/subtopic', (req, res) => {
  const course = req.headers.course;
  const mainTopic = req.headers.main_topic;

  db.query('SELECT * FROM SchoolCurriculum WHERE course = ? AND mainTopic = ?', [course, mainTopic], async (err, curriculum) => {
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


// ..........emma.................. CREATE  COURSE CONTENT .................................
router.post('/create-content', async (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS SchoolContents (
      id INT AUTO_INCREMENT PRIMARY KEY,
      mainTopic VARCHAR(255) NOT NULL,
      subTopic VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
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
  const { main_topic, content, course, sub_topic } = req.body;

  try {
    // Check if the Content with the same Main Topic and Sub Topic already exists
    db.query('SELECT * FROM SchoolContents WHERE mainTopic = ? AND subTopic = ?', [main_topic, sub_topic], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      if (result.length !== 0) {
        return res.status(400).json({ error: 'Topic already exists' });
      }


      const sql = `
          INSERT INTO SchoolContents (mainTopic, content, course, subTopic)
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

  } catch (error) {
    return res.status(500).json({ message: 'Error creating content' });
  }


});


// .............emma................. TUTOR CREATE QUESTION..........................................
router.post('/create-questions', async (req, res) => {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS SchoolQuestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course VARCHAR(255) NOT NULL,
    mainTopic VARCHAR(255) NOT NULL,
    subTopic VARCHAR(255) NOT NULL,
    question VARCHAR(255) NOT NULL,
    ans1 VARCHAR(255) NOT NULL,
    ans2 VARCHAR(255) NOT NULL,
    ans3 VARCHAR(255) NOT NULL,
    ans4 VARCHAR(255) NOT NULL,
    correctAns TEXT NOT NULL,
    createdAt TIMESTAMP NOT NULL
  );
`;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });
  const { course, mainTopic, subTopic, question, ans1, ans2, ans3, ans4, correctAns, } = req.body;

  try {

    db.query('SELECT * FROM SchoolQuestions WHERE question = ? AND mainTopic = ?', [question, mainTopic, subTopic], async (err, result) => {
      if (result.length > 0) {
        return res.status(400).json({ error: 'Question already exists! Set another' });

      } else {
        // Create a new content with the tutor's course
        const sql = `INSERT INTO SchoolQuestions (course, mainTopic, subTopic, question, ans1, ans2, ans3, ans4, correctAns)
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

  } catch (error) {
    return res.status(500).json({ message: 'Error creating content' });
  }
});

// ...............emma........ TUTOR GET SCHOOL COURSE CURRICULUM ..........................................
router.get('/course-curriculum', async (req, res) => {
  const course = req.headers.course;

  try {

    db.query('SELECT * FROM SchoolCurriculum WHERE course = ?', [course], async (err, content) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching course content' });
      }
      return res.json({ content });
    });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unauthorized!! Please login to view courses' });
  }
});

// ............emma............... TUTOR UPDATE CURRICULUM .................................
router.put('/update-curriculum/:id', (req, res) => {

  const { course, mainTopic, subTopicArray, courseCode } = req.body;
  const subTopic = subTopicArray.join(', ')
  const curriculumId = parseInt(req.params.id); // Convert the id to an integer
  // or using the unary plus operator to convert id to integer
  // const curriculumId = +req.params.id;


  // Update the student's information in the database
  const sql = `
      UPDATE SchoolCurriculum
      SET
        course = ?,
        mainTopic = ?,
        subTopic = ?,
        courseCode = ?
      WHERE id = ?
      `;

db.query(
  sql,
  [course, mainTopic, subTopic, courseCode, curriculumId],
  async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    // Check if the Curriculum was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Curriculum not found', content: result });
    }

    // Send a response indicating success
    return res.json({ message: 'Curriculum updated successfully' });
  }
);

});

// .......emma............... TUTOR GET SCHOOL COURSE CONTENT LIST ..........................................
router.get('/course-contents', async (req, res) => {
  const course = req.headers.course;


  try {


      db.query('SELECT * FROM SchoolContents WHERE course = ?', [course], async (err, content) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error fetching course content' });
        }
        return res.json({ content });
      });

    

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unauthorized!! Please login to view courses' });
  }
});

// .......emma............... TUTOR GET SCHOOL COURSE CONTENT  ..........................................
router.get('/course-content-details', async (req, res) => {
  const id = req.headers.id;


  try {

      db.query('SELECT * FROM SchoolContents WHERE id = ?', [id], async (err, content) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error fetching course content' });
        }
        return res.json({ content });
      });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unauthorized!!' });
  }
});

// ............................. VIEW QUESTIONS  ..........................................
router.get('/questions', async (req, res) => {

  const course = req.headers.course;
  try {

    db.query('SELECT * FROM SchoolQuestions WHERE course = ?', [course], async (err, question) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching course content' });
      }
      return res.json({ question });
    });



  } catch (error) {
    return res.status(500).json({ error });
  }
});

// ..........emma................... VIEW SELECTED QUESTION  ..........................................
router.get('/selected-question', async (req, res) => {

  const course = req.headers.course;
  const question = req.headers.question;
  const topic = req.headers.topic;


  try {

    db.query('SELECT * FROM SchoolQuestions WHERE course = ? AND question = ? AND mainTopic = ?', [course, question, topic], async (err, question) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching course content' });
      }

      return res.json({ question });
    });



  } catch (error) {
    return res.status(500).json({ error });
  }
});

// ............emma............... UPDATE QUESTION .................................
router.put('/update-question/:id', (req, res) => {

  const { course, mainTopic, subTopic, question, ans1, ans2, ans3,ans4, correctAns } = req.body;
  const questionId = parseInt(req.params.id); // Convert the id to an integer
  // or using the unary plus operator to convert id to integer
  // const curriculumId = +req.params.id;


  // Update the student's information in the database
  const sql = `
      UPDATE SchoolQuestions
      SET
        course = ?,
        mainTopic = ?,
        subTopic = ?,
        question = ?,
        ans1 = ?,
        ans2 = ?,
        ans3 = ?,
        ans4 = ?,
        correctAns = ?

      WHERE id = ?
      `;

db.query(
  sql,
  [course, mainTopic, subTopic, question, ans1, ans2, ans3, ans4, correctAns, questionId],
  async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }


    // Check if the Question was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Question not found', content: result });
    }

    // Send a response indicating success
    return res.json({ message: 'Question updated successfully' });
  }
);

});

// .............emma............. GET INSTRUCTOR SCHOOLS ..........................................
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

// ...............emma........... GET ALL CLASSES LIST (EG Primary 1)..........................................
router.get('/session', (req, res) => {
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
// ...............emma........... GET ALL CLASSES LIST (EG Primary 1)..........................................
router.get('/class-list', (req, res) => {
  const { school, course, session } = req.headers
  const words = school.split(' ')


  // Remove Spaces from the School
  const schools = words.map((word) => word).join('');

  if (schools == '') {
    return res.json({ student: [] });

  } else {

  
    try {
      sch.query(`SELECT * FROM ${schools} WHERE isVerified = ? AND courses REGEXP ? AND year = ?`, [1, `\\b${course}\\b`, session], async (err, studentClass) => {
        if (err) {

          return res.status(500).json({ message: 'Error retrieving Students' });
        }

        return res.json({ studentClass });
      });

    } catch (error) {
      return res.status(500).json({ message: 'Error retrieving Students' });
    }
  }

});


// .............emma............. GET INSTRUCTOR  CLASS STUDENT..........................................
router.get('/fetch-students-by-classes', (req, res) => {
  const { studentclass, school, course, session } = req.headers

  const words = school.split(' ')

  // Remove Spaces from the School
  const schools = words.map((word) => word).join('');

  if (schools && studentclass) {
    try {
      sch.query(`SELECT * FROM ${schools} WHERE level = ? AND isVerified = ?  AND courses REGEXP ? AND year = ?`, [studentclass, 1, `\\b${course}\\b`, session], async (err, student) => {
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

// .........emma................. INSTRUCTOR GET SCHOOL COURSE CODE ..........................................
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

// ..........emma................ INSTRUCTOR UPDATE STUDENT COURSE CODE ..........................................
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
router.get('/all-school-subject', async (req, res) => {
  const course = req.headers.course

  sch.query('SELECT * FROM Courses WHERE course = ?', [course], async (err, result) => {

    return res.json({ message: result });

  })
})


module.exports = router;
