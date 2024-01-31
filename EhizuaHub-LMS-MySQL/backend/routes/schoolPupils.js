const router = require("express").Router();
const jwt = require("jsonwebtoken");

//....... JSON WEB TOKEN ............
const createToken = (payload) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  return jwt.sign(payload, jwtSecretKey, { expiresIn: "3d" });
};
const {sch} = require('../config/db'); // replace 'yourModuleName' with the actual path to the module




// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SCHOOL PUPILS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


// .................................SCHOOL PUPIL LOGIN ...........................................
router.post('/login', async (req, res) => {
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
      console.log(name)
      const course = (result[0].courses);
      console.log(course)
      const payload = { id: result[0].id };
      console.log(payload)
      const token = createToken(payload);
      console.log(token)

      res.json({ token: token, user: name, authHeader: result[0].id, course: course });
  
    });
  });
  
  
  // .................................... PUPILS COURSE SECTION ...............................
router.get('/course-section', async (req, res) => {
  
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
router.get('/course-curriculum', async (req, res) => {
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
router.get('/course-content', async (req, res) => {
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

  module.exports = router;
