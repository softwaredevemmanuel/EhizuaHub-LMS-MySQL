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
import CreateSchool from './Admin/partnerSchools/CreateSchool';
import RegisterStudent from './Admin/partnerSchools/RegisterStudent';
import SingleStudentDetailsPage from './Admin/SingleStudentDetails';
import StudentsProgress from './Admin/StudentsProgress';
import UpdateStudent from './Admin/UpdateStudent';
import UpdateStaff from './Admin/UpdateStaff';
import AllSchools from './Admin/partnerSchools/AllSchools';
import SchoolDetails from './Admin/partnerSchools/SchoolDetails';
import LeaveDashboard from './Staff/LeaveDashboard';
import Test from './Admin/Test';
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
import CreateCourse from './Admin/CreateCourse';
import CreateSubjects from './Admin/partnerSchools/CreateSubjects';
import CreateStaff from './Admin/CreateStaff';
import StaffDetails from './Admin/StaffDetails';
import AllHubInstructors from './Admin/AllHubInstructors';
import AllSchoolInstructors from './Admin/AllSchoolInstructors';
import HomeDashboard from './Staff/HomeDashboard';
import CreateHubCourseCurriculum from './Tutor/CreateHubCourseCurriculum';
import CreateSchoolCourseCurriculum from './Tutor/CreateSchoolCourseCurriculum';
import CreateHubCourseContent from './Tutor/CreateHubCourseContent';
import CreateSchoolCourseContent from './Tutor/CreateSchoolCourseContent';
import ViewSchoolCousreContent from './Tutor/ViewSchoolCousreContent';
import ViewHubCourseContent from './Tutor/ViewHubCourseContent';
import ViewHubCurriculum from './Tutor/ViewHubCurriculum';
import ViewSchoolCurriculum from './Tutor/ViewSchoolCurriculum';



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
          <Route path='staff_dashboard' element={<HomeDashboard />} />
          <Route path='/verify-tutor-email' element={<VerifyTutorEmail />} />
          <Route path='/verify-student-email' element={<VerifyStudentEmail />} />
          <Route path='/student_forgot_password' element={<StudentForgotPassword />} />
          <Route path='/tutor_forgot_password' element={<TutorForgotPassword />} />
          <Route path='/all_staff' element={<AllTutorDetails />} />
          <Route path='/hub_instructors' element={<AllHubInstructors />} />
          <Route path='/school_instructors' element={<AllSchoolInstructors />} />
          <Route path='/all_student_details' element={<AllStudentDetails />} />
          <Route path='/course_topic' element={<CourseTopic />} />
          <Route path='/tutor_student_details' element={<StudentDetails />} />
          <Route path='/create_student' element={<CreateStudents />} />
          <Route path='/create_question' element={<TutorCreateQuestions />} />
          <Route path='/tutor_course_contents' element={<TutorCourseContents/>} />
          <Route path='/questions' element={<Question/>} />
          <Route path='/details/:id' element={<DetailsPage />} />
          <Route path='/timer' element={<Timer/>} />
          <Route path='/create_hub_course_curriculum/:course' element={<CreateHubCourseCurriculum/>} />
          <Route path='/create_school_course_curriculum/:course' element={<CreateSchoolCourseCurriculum/>} />
          <Route path='/instructor_create_curriculum' element={<InstructorCreateCurriculum/>} />
          <Route path='/create_school' element={<CreateSchool/>} />
          <Route path='/register_school_students' element={<RegisterStudent/>} />
          <Route path='/single_student_details_page/:_id' element={<SingleStudentDetailsPage/>} />
          <Route path='/students_progress/:_id/:course/:email' element={<StudentsProgress/>} />
          <Route path='/update_student/:_id' element={<UpdateStudent/>} />
          <Route path='/personal_staff_details/:_id' element={<StaffDetails/>} />
          <Route path='/update_staff/:_id' element={<UpdateStaff/>} />
          <Route path='/all_schools' element={<AllSchools/>} />
          <Route path='/school_details/:id' element={<SchoolDetails/>} />
          <Route path='/leave' element={<LeaveDashboard/>} />
          <Route path='/create_hub_course_content/:course' element={<CreateHubCourseContent/>} />
          <Route path='/create_school_course_content/:course' element={<CreateSchoolCourseContent/>} />
          <Route path='/view_school_course_content/:course' element={<ViewSchoolCousreContent/>} />
          <Route path='/view_hub_course_content/:course' element={<ViewHubCourseContent/>} />
          <Route path='/view_school_course_curriculum/:course' element={<ViewSchoolCurriculum/>} />
          <Route path='/view_hub_course_curriculum/:course' element={<ViewHubCurriculum/>} />
          <Route path='/instructor_create_content' element={<InstructorCreateContent/>} />
          <Route path='/test' element={<Test/>} />
          <Route path='/create_staff' element={<CreateStaff/>} />
          <Route path='/create_location' element={<CreateLocation/>} />
          <Route path='/all_offices' element={<AllOfices/>} />
          <Route path='/tutor_details_page/:email' element={<TutorDetails/>} />
          <Route path='/instructor_details_page/:email' element={<InstructorDetails/>} />
          <Route path='/offices_details/:officeName' element={<OfficeDetails/>} />
          <Route path='/all_leave_request' element={<LeaveRequest/>} />
          <Route path='/approved_leave_request' element={<ApprovedLeaveRequest/>} />
          <Route path='/rejected_leave_request' element={<RejectedLeaveRequest/>} />
          <Route path='/pending_leave_request' element={<PendingLeaveRequest/>} />
          <Route path='/school-student-dashboard' element={<PupilsDashboard/>} />
          <Route path='/instructor-dashboard' element={<InstructorDashboard/>} />
          <Route path='/create_instructor' element={<CreateInstructor/>} />
          <Route path='/create_courses' element={<CreateCourse/>} />
          <Route path='/create_subject' element={<CreateSubjects/>} />

      </Routes>
      
      
      </BrowserRouter>
    </div>
  );
}

export default App;
