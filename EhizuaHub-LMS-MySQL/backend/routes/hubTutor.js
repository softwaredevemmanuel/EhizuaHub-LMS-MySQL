const router = require("express").Router();

const { db, sch } = require('../config/db');

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HUB TUTOR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// ............emma............... HUB TUTOR CREATE CURRICULUM .................................
router.post('/create-curriculum', (req, res) => {
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



  const { course, mainTopic, subTopicArray } = req.body;

  const subTopic = subTopicArray.join(', ')


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


});

// ............emma............... HUB TUTOR UPDATE CURRICULUM .................................
router.put('/update-curriculum/:id', (req, res) => {

  const { course, mainTopic, subTopicArray } = req.body;
  const subTopic = subTopicArray.join(', ')
  const curriculumId = parseInt(req.params.id); // Convert the id to an integer
  // or using the unary plus operator to convert id to integer
  // const curriculumId = +req.params.id;


  // Update the student's information in the database
  const sql = `
      UPDATE Curriculum
      SET
        course = ?,
        mainTopic = ?,
        subTopic = ?
      WHERE id = ?
      `;

db.query(
  sql,
  [course, mainTopic, subTopic, curriculumId],
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

// ...............emma............ TUTOR CREATE CLASS REPORT .................................
router.post('/class-report', (req, res) => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ClassReport (
          id INT AUTO_INCREMENT PRIMARY KEY,
          location VARCHAR(255) NOT NULL,
          course VARCHAR(255) NOT NULL,
          classDate VARCHAR(50) NOT NULL,
          startTime VARCHAR(255) NOT NULL,
          endTime VARCHAR(255) NOT NULL,
          topic VARCHAR(300) NOT NULL,
          newTopic VARCHAR(255) NOT NULL DEFAULT '',
          newTopicComment TEXT NOT NULL DEFAULT '',
          classProgress VARCHAR(255) NOT NULL,
          studentsAttended TEXT NOT NULL
        );
      `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });


  const { course, classDate, startTime, endTime, topicArray, newTopic, newTopicComment, classProgress, location, studentsArray } = req.body;
  const topic = topicArray.join(', ')
  const studentsAttended = studentsArray.join(', ')

  db.query('SELECT * FROM ClassReport WHERE course = ? AND startTime = ? AND classDate = ? AND location = ?', [course, startTime, classDate, location], async (err, report) => {
    if (report.length > 0) {
      return res.status(401).json({ message: `class report for ${classDate} already exists` });

    } else {

      // Now, you can insert data into the Curriculum table
      const insertDataQuery = `
                  INSERT INTO ClassReport (location, course, classDate, startTime, endTime, topic, newTopic, newTopicComment, classProgress, studentsAttended)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                `;

      const values = [location, course, classDate, startTime, endTime, topic, newTopic, newTopicComment, classProgress, studentsAttended];


      db.query(insertDataQuery, values, (err) => {
        if (err) {
          console.error(err);
          throw new Error('Error inserting data');
        }
        return res.json({ message: ` Report saved successfully` });
      });
    }
  })


});

// .................emma............ GET CLASS REPORT.................................
router.get('/class-report', (req, res) => {

  const course = req.headers.course;
  const location = req.headers.location;

  db.query('SELECT * FROM ClassReport WHERE location = ? AND course = ?', [location, course], async (err, report) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching curriculum data' });
    }


    res.json({ content: report });

  });

});



// ............................. GET INSTRUCTOR COURSES.................................
router.get('/instructor-course', (req, res) => {
  const email = req.headers.email;

  db.query('SELECT * FROM HubInstructors WHERE email = ?', [email], async (err, hubInstructor) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching curriculum data' });
    }
    const coursesArray = hubInstructor[0].courses.split(',')


    res.json({ courses: coursesArray });

  });

});

// .............emma................ GET HUB CURRICULUM MAINTOPIC.................................
router.get('/maintopic', (req, res) => {
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

// ............................. GET HUB CURRICULUM SUBTOPIC.................................
router.get('/subtopic', (req, res) => {
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

// .........emma...............  HUB TUTOR CREATE COURSE CONTENT .................................
router.post('/create-content', async (req, res) => {

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Contents (
      id INT AUTO_INCREMENT PRIMARY KEY,
      mainTopic VARCHAR(255) NOT NULL,
      subTopic VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      course VARCHAR(255) NOT NULL,
      videoUrl VARCHAR(800) NOT NULL DEFAULT '',
      createdAt TIMESTAMP NOT NULL
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(err);
      throw new Error('Error creating table');
    }
  });
  
  const { main_topic, content, course, sub_topic, videoUrl } = req.body;

  try {

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
          INSERT INTO Contents (mainTopic, content, course, subTopic, videoUrl)
          VALUES (?, ?, ?, ?, ?)
        `;

      db.query(sql, [main_topic, content, course, sub_topic, videoUrl], async (err, result) => {
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

// ...........emma............... TUTOR GET HUB COURSE CONTENT ..........................................
router.get('/course-content', async (req, res) => {
  const course = req.headers.course;

  try {
    db.query('SELECT * FROM Staff ', [], async (err, result) => {

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

// ...................... TUTOR GET HUB COURSE CONTENT DETAILS ..........................................
router.get('/course-content-details', async (req, res) => {
  const id = req.headers.id;


  try {

    db.query('SELECT * FROM Contents WHERE id = ?', [id], async (err, content) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching course content' });
      }
      // console.log(content)
      return res.json({ content });
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unauthorized!! Please login to view courses' });
  }
});

// ...........emma............... TUTOR GET HUB COURSE CURRICULUM ..........................................
router.get('/course-curriculum', async (req, res) => {
  const course = req.headers.course;

  try {

    db.query('SELECT * FROM Curriculum WHERE course = ?', [course], async (err, content) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching course content' });
      }
      return res.json({ content });
    });


  } catch (error) {
    return res.status(500).json({ error: 'Unauthorized' });
  }
});



// ..............emma............ INSTRUCTOR GET  COURSE DETAILS ................................
router.get('/hub-course-details', async (req, res) => {
  const course = req.headers.course.trim()

  try {
    db.query('SELECT * FROM Courses WHERE course = ?', [course], async (err, result) => {

      return res.json({ content: result });

    })

  } catch {

  }

})

// ............................. GET TUTOR STUDENTS ..........................................
router.get('/students', async (req, res) => {

  const {course, location} = req.headers;


  try {

    db.query('SELECT * FROM StudentEnrolledCourses WHERE course = ? AND location = ?', [course, location], async (err, students) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching course content' });
      }
      console.log(students)
      return res.json({ students });
    });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unauthorized!! Please login to view courses' });
  }
});

// ..............emma.................HUB TUTOR CREATE QUESTION..........................................
router.post('/create-questions', async (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Questions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      course VARCHAR(255) NOT NULL,
      mainTopic VARCHAR(255) NOT NULL,
      subTopic VARCHAR(255) NOT NULL,
      question VARCHAR(255) NOT NULL,
      ans1 VARCHAR(255) NOT NULL DEFAULT '',
      ans2 VARCHAR(255) NOT NULL DEFAULT '',
      ans3 VARCHAR(255) NOT NULL DEFAULT '',
      ans4 VARCHAR(255) NOT NULL DEFAULT '',
      correctAns TEXT NOT NULL DEFAULT '',
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
    db.query('SELECT * FROM HubInstructors WHERE email = ?', [email], async (err, tutor) => {


      db.query('SELECT * FROM Questions WHERE question = ? AND mainTopic = ? AND subTopic = ?', [question, mainTopic, subTopic], async (err, result) => {
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

// ............................. VIEW QUESTIONS  ..........................................
router.get('/questions', async (req, res) => {

  const course = req.headers.course;
  try {

    db.query('SELECT * FROM Questions WHERE course = ?', [course], async (err, question) => {
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

    db.query('SELECT * FROM Questions WHERE course = ? AND question = ? AND mainTopic = ?', [course, question, topic], async (err, question) => {
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
      UPDATE Questions
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

// ............emma............... UPDATE QUESTION .................................
router.put('/update-content/:id', (req, res) => {

  const { course, mainTopic, subTopic, content, videoUrl } = req.body;
  const contentId = parseInt(req.params.id); // Convert the id to an integer
  // or using the unary plus operator to convert id to integer
  // const curriculumId = +req.params.id;

  // Update the student's information in the database
  const sql = `
      UPDATE Contents
      SET
        course = ?,
        mainTopic = ?,
        subTopic = ?,
        content = ?,
        videoUrl = ?
       
      WHERE id = ?
      `;

  
db.query(
  sql,
  [course, mainTopic, subTopic, content, videoUrl, contentId],
  async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }


    // Check if the Question was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Content not found', content: result });
    }

    // Send a response indicating success
    return res.json({ message: 'Content updated successfully' });

  }
);

});



module.exports = router;

