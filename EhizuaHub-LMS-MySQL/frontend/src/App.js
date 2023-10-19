import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Admin/Dashboard'
import Login from './Admin/LoginForm'
import StudentDashboard from './Students/StudentDashboard';
import TutorDashboard from './Tutor/TutorDashboard';
import VerifyTutorEmail from './Tutor/VerifyTutorEmail';
import VerifyStudentEmail from './Students/VerifyStudentEmail';
import StudentForgotPassword from './Students/StudentForgetPassword';
import TutorForgotPassword from './Tutor/TutorForgotPassword';
import AllTutorDetails from './Admin/AllTutorDetails';
import AllStudentDetails from './Admin/AllStudentDetails';
import CourseTopic from './Students/CourseTopic';
import StudentDetails from './Tutor/StudentDetails';
import CreateStudents from './Admin/CreateStudents';
import TutorCreateQuestions from './Tutor/TutorCreateQuestions';
import TutorCourseContents from './Tutor/TutorCourseContents';
import Question from './Students/Question';
import DetailsPage from './Students/DetailsPage';
import Timer from './Students/Timer';
import CreateCurriculum from './Tutor/CreateCurriculum';
import CreateSchool from './Admin/partnerSchools/CreateSchool';
import RegisterStudent from './Admin/partnerSchools/RegisterStudent';
import SingleStudentDetailsPage from './Admin/SingleStudentDetails';
import StudentsProgress from './Admin/StudentsProgress';
import UpdateStudent from './Admin/UpdateStudent';
import UpdateTutor from './Admin/UpdateTutor';
import AllSchools from './Admin/partnerSchools/AllSchools';
import SchoolDetails from './Admin/partnerSchools/SchoolDetails';
import LeaveDashboard from './Tutor/LeaveDashboard';
import CreateContent from './Tutor/CreateContent';
import Test from './Admin/Test';
import CreateTutor from './Admin/CreateTutor';
import CreateLocation from './Admin/CreateLocation';
import AllOfices from './Admin/AllOffices';
import TutorDetails from './Tutor/TutorDetails';
import LeaveRequest from './Admin/LeaveRequest';
import ApprovedLeaveRequest from './Admin/ApprovedLeaveRequest';
import RejectedLeaveRequest from './Admin/RejectedLeaveRequest';
import PendingLeaveRequest from './Admin/PendingLeaveRequest';
import OfficeDetails from './Admin/OfficeDetails';
import PupilsDashboard from './SchoolPupils/PupilsDashboard';
import InstructorDashboard from './Admin/partnerSchools/Instructor/InstructorDashboard';
import CreateInstructor from './Admin/CreateInstructor';
import InstructorDetails from './Admin/partnerSchools/Instructor/InstructorDetails';
import InstructorCreateCurriculum from './Admin/partnerSchools/Instructor/InstructorCreateCurriculum';
import InstructorCreateContent from './Admin/partnerSchools/Instructor/InstructorCreateContent';



// import AllCourses from './Pages/AllCourses';

function App() {
  return (
    <div>
      
      <BrowserRouter>
      <Routes>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='/' element={<Login />} />
          <Route path='student_dashboard' element={<StudentDashboard />} />
          <Route path='tutor_dashboard' element={<TutorDashboard />} />
          <Route path='/verify-tutor-email' element={<VerifyTutorEmail />} />
          <Route path='/verify-student-email' element={<VerifyStudentEmail />} />
          <Route path='/student_forgot_password' element={<StudentForgotPassword />} />
          <Route path='/tutor_forgot_password' element={<TutorForgotPassword />} />
          <Route path='/tutor_details' element={<AllTutorDetails />} />
          <Route path='/all_student_details' element={<AllStudentDetails />} />
          <Route path='/course_topic' element={<CourseTopic />} />
          <Route path='/tutor_student_details' element={<StudentDetails />} />
          <Route path='/create_student' element={<CreateStudents />} />
          <Route path='/create_question' element={<TutorCreateQuestions />} />
          <Route path='/tutor_course_contents' element={<TutorCourseContents/>} />
          <Route path='/questions' element={<Question/>} />
          <Route path='/details/:id' element={<DetailsPage />} />
          <Route path='/timer' element={<Timer/>} />
          <Route path='/create_curriculum' element={<CreateCurriculum/>} />
          <Route path='/instructor_create_curriculum' element={<InstructorCreateCurriculum/>} />
          <Route path='/create_school' element={<CreateSchool/>} />
          <Route path='/register_school_students' element={<RegisterStudent/>} />
          <Route path='/single_student_details_page/:_id' element={<SingleStudentDetailsPage/>} />
          <Route path='/students_progress/:_id/:course/:email' element={<StudentsProgress/>} />
          <Route path='/update_student/:_id' element={<UpdateStudent/>} />
          <Route path='/update_tutor/:_id' element={<UpdateTutor/>} />
          <Route path='/all_schools' element={<AllSchools/>} />
          <Route path='/school_details/:id' element={<SchoolDetails/>} />
          <Route path='/leave' element={<LeaveDashboard/>} />
          <Route path='/create_content' element={<CreateContent/>} />
          <Route path='/instructor_create_content' element={<InstructorCreateContent/>} />
          <Route path='/test' element={<Test/>} />
          <Route path='/create_tutor' element={<CreateTutor/>} />
          <Route path='/create_location' element={<CreateLocation/>} />
          <Route path='/all_offices' element={<AllOfices/>} />
          <Route path='/tutor_details_page/:email' element={<TutorDetails/>} />
          <Route path='/instructor_details_page/:email' element={<InstructorDetails/>} />
          <Route path='/offices_details/:_id' element={<OfficeDetails/>} />
          <Route path='/all_leave_request' element={<LeaveRequest/>} />
          <Route path='/approved_leave_request' element={<ApprovedLeaveRequest/>} />
          <Route path='/rejected_leave_request' element={<RejectedLeaveRequest/>} />
          <Route path='/pending_leave_request' element={<PendingLeaveRequest/>} />
          <Route path='/school-student-dashboard' element={<PupilsDashboard/>} />
          <Route path='/instructor-dashboard' element={<InstructorDashboard/>} />
          <Route path='/create_instructor' element={<CreateInstructor/>} />


      </Routes>
      
      
      </BrowserRouter>
    </div>
  );
}

export default App;
