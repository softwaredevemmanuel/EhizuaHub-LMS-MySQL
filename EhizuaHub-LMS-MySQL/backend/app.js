const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();


app.use(cors());
app.use(bodyParser.json());


const authRoute = require("./routes/auth");
const staffRoute = require("./routes/staff");
const studentRoute = require("./routes/student");
const hubTutorRoute = require("./routes/hubTutor");
const schoolTutorRoute = require("./routes/schoolTutor");
const schoolPupilRoute = require("./routes/schoolPupils");


app.use("/api/auth", authRoute);
app.use("/api/staff", staffRoute);
app.use("/api/students", studentRoute);
app.use("/api/hub-tutor", hubTutorRoute);
app.use("/api/school-tutor", schoolTutorRoute);
app.use("/api/school_pupils", schoolPupilRoute);




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
