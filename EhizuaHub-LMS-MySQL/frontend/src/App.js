import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Admin/Dashboard'
import Login from './Admin/LoginForm'
import StudentDashboard from './Students/StudentDashboard';
import TutorDashboard from './Tutor/TutorDashboard';
import VerifyStudentEmail from './Students/VerifyStudentEmail';
import StudentForgotPassword from './Students/StudentForgetPassword';
import AllStaffList from './Admin/StaffSection/AllStaffList';
import AllStudentDetails from './Admin/Upskill/AllStudentDetails';
import CourseTopic from './Students/CourseTopic';
import StudentDetails from './Tutor/StudentDetails';
import CreateStudents from './Admin/Students/CreateStudents';
import TutorCreateQuestions from './Tutor/HubInstructors/HubTutorCreateQuestions';
import TutorCourseContents from './Tutor/TutorCourseContents';
import Question from './Students/Question';
import DetailsPage from './Students/DetailsPage';
import Timer from './Students/Timer';
import CreateSchool from './Admin/PartnerSchools/CreateSchool';
import RegisterStudent from './Admin/PartnerSchools/RegisterStudent';
import SingleStudentDetailsPage from './Admin/Students/SingleStudentDetails';
import StudentsProgress from './Admin/Students/StudentsProgress';
import UpdateStudent from './Admin/Upskill/UpdateStudent';
import UpdateStaff from './Admin/StaffSection/UpdateStaff';
import AllSchools from './Admin/PartnerSchools/AllSchools';
import SchoolDetails from './Admin/PartnerSchools/SchoolDetails';
import LeaveDashboard from './Staff/LeaveDashboard';
import CreateLocation from './Admin/Offices/CreateLocation';
import AllOfices from './Admin/Offices/AllOffices';
import StaffDetails from './Staff/StaffDetails';
import LeaveRequest from './Admin/LeavSection/LeaveRequest';
import ApprovedLeaveRequest from './Admin/LeavSection/ApprovedLeaveRequest';
import RejectedLeaveRequest from './Admin/LeavSection/RejectedLeaveRequest';
import PendingLeaveRequest from './Admin/LeavSection/PendingLeaveRequest';
import OfficeDetails from './Admin/Offices/OfficeDetails';
import PupilsDashboard from './SchoolPupils/PupilsDashboard';
import CreateCourse from './Admin/Upskill/CreateCourse';
import CreateSubjects from './Admin/PartnerSchools/CreateSubjects';
import CreateStaff from './Admin/StaffSection/CreateStaff';
import AdminStaffDetails from './Admin/StaffSection/AdminStaffDetails';
import AllHubInstructors from './Admin/StaffSection/HubTutors/AllHubInstructors';
import AllSchoolInstructors from './Admin/StaffSection/SchoolTutors/AllSchoolInstructors';
import HomeDashboard from './Staff/HomeDashboard';
import CreateHubCourseCurriculum from './Tutor/HubInstructors/CreateHubCourseCurriculum';
import CreateSchoolCourseCurriculum from './Tutor/SchoolInstructors/CreateSchoolCourseCurriculum';
import CreateHubCourseContent from './Tutor/HubInstructors/CreateHubCourseContent';
import CreateSchoolCourseContent from './Tutor/SchoolInstructors/CreateSchoolCourseContent';
import ViewSchoolCourseList from './Tutor/SchoolInstructors/ViewSchoolCourseList';
import ViewHubCourseContent from './Tutor/HubInstructors/ViewHubCourseContent';
import ViewHubCurriculum from './Tutor/HubInstructors/ViewHubCurriculum';
import ViewSchoolCurriculum from './Tutor/SchoolInstructors/ViewSchoolCurriculum';
import HubInstructorDetails from './Admin/StaffSection/HubTutors/HubInstructorDetails';
import SchoolInstructorDetails from './Admin/StaffSection/SchoolTutors/SchoolInstructorDetails';
import UpdateHubInstructor from './Admin/StaffSection/HubTutors/UpdateHubInstructor';
import UpdateSchoolInstructor from './Admin/StaffSection/SchoolTutors/UpdateSchoolInstructor';
import ViewCourses from './Admin/Upskill/ViewCourses';
import ViewCurriculum from './Admin/Upskill/ViewCurriculum';
import ViewSchoolCourseContent from './Tutor/SchoolInstructors/ViewSchoolCourseContent';
import CourseContent from './SchoolPupils/CourseContent';
import ViewCourseStudent from './Tutor/SchoolInstructors/ViewCourseStudents';
import CourseCurriculum from './SchoolPupils/CourseCurriculum';
import Location from './Admin/Students/Location';
import ListOfStudents from './Admin/Students/ListOfStudents';
import VerifyStaffEmail from './Staff/VerifyStaffEmail';
import StaffForgotPassword from './Staff/StaffForgotPassword';
import HubTutorCreateQuestions from './Tutor/HubInstructors/HubTutorCreateQuestions';
import SchoolTutorCreateQuestions from './Tutor/SchoolInstructors/SchoolTutorCreateQuestion';
import HubStudentHomePage from './Students/HubStudentHomePage';
import CreateCourseDiscount from './Admin/Upskill/CreateCourseDiscount';
import ViewDiscountCourses from './Admin/Upskill/ViewDiscountCourse';
import UpdateDiscountCourse from './Admin/Upskill/UpdateDiscountCourse';
import RegisterDiscountCourse from './Students/RegisterDiscountCourse';



// import AllCourses from './Pages/AllCourses';

function App() {
  return (
    <div>
      
      <BrowserRouter>
      <Routes>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='/' element={<Login />} />

          <Route path='view-courses/curriculum' element={<ViewCourses />} />
          <Route path='view-courses/curriculum/:course' element={<ViewCurriculum />} />

          <Route path='/school-student-dashboard/:course/curriculum' element={<CourseCurriculum/>} />
          <Route path='/school-student-dashboard/:subtopic/:maintopic' element={<CourseContent/>} />



          <Route path='/all_schools' element={<AllSchools/>} />
          <Route path='/school_details/:schoolName' element={<SchoolDetails/>} />

          <Route path='student_dashboard' element={<StudentDashboard />} />
          <Route path='hub_student_homepage' element={<HubStudentHomePage />} />
          <Route path='tutor_dashboard' element={<TutorDashboard />} />
          <Route path='staff_dashboard' element={<HomeDashboard />} />
          <Route path='/verify-staff-email' element={<VerifyStaffEmail />} />
          <Route path='/verify-student-email' element={<VerifyStudentEmail />} />
          <Route path='/student_forgot_password' element={<StudentForgotPassword />} />
          <Route path='/staff_forgot_password' element={<StaffForgotPassword />} />
          <Route path='/all_staff' element={<AllStaffList />} />
          <Route path='/hub_instructors/:office' element={<AllHubInstructors />} />
          <Route path='/school_instructors/:office' element={<AllSchoolInstructors />} />
          <Route path='/all_student_details' element={<AllStudentDetails />} />
          <Route path='/student_dashboard/:course' element={<CourseTopic />} />
          <Route path='/tutor_student_details' element={<StudentDetails />} />
          <Route path='/create_student/:location' element={<CreateStudents />} />
          <Route path='/create_question/:course' element={<HubTutorCreateQuestions />} />
          <Route path='/create_subject_question/:course' element={<SchoolTutorCreateQuestions />} />
          <Route path='/tutor_course_contents' element={<TutorCourseContents/>} />
          <Route path='/questions/:course/:id' element={<Question/>} />
          <Route path='/:course/details/:id' element={<DetailsPage />} />
          <Route path='/timer' element={<Timer/>} />
          <Route path='/create_hub_course_curriculum/:course' element={<CreateHubCourseCurriculum/>} />
          <Route path='/create_school_course_curriculum/:course' element={<CreateSchoolCourseCurriculum/>} />
          <Route path='/create_school' element={<CreateSchool/>} />
          <Route path='/register_school_students' element={<RegisterStudent/>} />
          <Route path='/single_student_details_page/:course/:email' element={<SingleStudentDetailsPage/>} />
          <Route path='/students_progress/:_id/:course/:email' element={<StudentsProgress/>} />
          <Route path='/update_student/:_id' element={<UpdateStudent/>} />
          <Route path='/staff-details/:email' element={<StaffDetails/>} />
          <Route path='/update_staff/:_id' element={<UpdateStaff/>} />
          <Route path='/casual-leave' element={<LeaveDashboard/>} />
          <Route path='/create_hub_course_content/:course' element={<CreateHubCourseContent/>} />
          <Route path='/create_school_course_content/:course' element={<CreateSchoolCourseContent/>} />
          <Route path='/view_school_course_list/:course' element={<ViewSchoolCourseList/>} />
          <Route path='/view_hub_course_content/:course' element={<ViewHubCourseContent/>} />
          <Route path='/view_school_course_curriculum/:course' element={<ViewSchoolCurriculum/>} />
          <Route path='/view_hub_course_curriculum/:course' element={<ViewHubCurriculum/>} />
          <Route path='/create_staff' element={<CreateStaff/>} />
          <Route path='/create_location' element={<CreateLocation/>} />
          <Route path='/all_offices' element={<AllOfices/>} />
          <Route path='/view_staff_details/:_id' element={<AdminStaffDetails/>} />
          <Route path='/offices_details/:officeName' element={<OfficeDetails/>} />
          <Route path='/all_leave_request' element={<LeaveRequest/>} />
          <Route path='/approved_leave_request' element={<ApprovedLeaveRequest/>} />
          <Route path='/rejected_leave_request' element={<RejectedLeaveRequest/>} />
          <Route path='/pending_leave_request' element={<PendingLeaveRequest/>} />
          <Route path='/school-student-dashboard' element={<PupilsDashboard/>} />
          <Route path='/create_courses' element={<CreateCourse/>} />
          <Route path='/create_course_discount' element={<CreateCourseDiscount/>} />
          <Route path='/view_course_discount' element={<ViewDiscountCourses/>} />
          <Route path='/view_course_discount/:id' element={<UpdateDiscountCourse/>} />
          <Route path='/create_subject' element={<CreateSubjects/>} />
          <Route path='/hub-instuctor-details/:_id' element={<HubInstructorDetails/>} />
          <Route path='/school-instuctor-details/:_id' element={<SchoolInstructorDetails/>} />
          <Route path='/update-hub-instructor/:_id' element={<UpdateHubInstructor/>} />
          <Route path='/update-school-instructor/:_id' element={<UpdateSchoolInstructor/>} />
          <Route path='/school-course-content-details/:id' element={<ViewSchoolCourseContent/>} />
          <Route path='/select-school-of-student/:email/:course' element={<ViewCourseStudent/>} />
          <Route path='/register-discount-course/:email/:_id' element={<RegisterDiscountCourse/>} />

        {/* ADMIN STUDENT SECTION */}
        <Route path='/students-center' element={<Location/>} />
        <Route path='/hub-students/:location' element={<ListOfStudents/>} />{/*  */}




      </Routes>
      
      
      </BrowserRouter>
    </div>
  );
}

export default App;
