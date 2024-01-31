const router = require("express").Router();

const { db, sch} = require('../config/db'); 

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HUB TUTOR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// ........................... HUB TUTOR CREATE CURRICULUM .................................
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
  
  // ............................. GET HUB CURRICULUM MAINTOPIC.................................
  router.get('/maintopic', (req, res) => {
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
  
  // .........Done...............  HUB TUTOR CREATE COURSE CONTENT .................................
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
  router.get('/course-content', async (req, res) => {
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

    // .......done............... TUTOR GET HUB COURSE CONTENT DETAILS ..........................................
    router.get('/course-content-details', async (req, res) => {
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
    
          db.query('SELECT * FROM Contents WHERE id = ?', [id], async (err, content) => {
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
  router.get('/students', async (req, res) => {
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
  router.get('/all-school-subject', async (req, res) => {
    const course = req.headers.course
  
    sch.query('SELECT * FROM Courses WHERE course = ?', [course], async (err, result) => {
  
      return res.json({ message: result });
  
    })
  })


  module.exports = router;

  