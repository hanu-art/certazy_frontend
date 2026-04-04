import { Routes, Route, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom"; // ← add karo

// Layout
import NavBarIndex      from "@/components/layout/Navbar/NavBarIndex";
import StudentLayout    from "@/components/layout/StudentLayout";

// Public pages
import CoursesPage      from "@/pages/public/Courses/CoursesPage";
import CourseDetailPage from "@/pages/public/CourseDetail/CourseDetailIndex";

// Auth pages
import LoginPage     from "@/pages/Auth/LoginPage";
import RegisterPage  from "@/pages/Auth/RegisterPage";
import OAuthCallback from "@/pages/Auth/OAuthCallback";

// Student pages
import DashboardPage      from "@/pages/student/DashboardPage";
import MyCoursesPage      from "@/pages/student/MyCoursesPage";
import CertificatesPage   from "@/pages/student/CertificatesPage";
import PaymentHistoryPage from "@/pages/student/PaymentHistoryPage";
import ProfilePage        from "@/pages/student/ProfilePage";
import CoursePlayerPage   from "@/pages/student/CoursePlayerPage";
import ExamInterface      from "@/pages/student/ExamInterface";

// Admin pages
import AdminDashboard     from "@/pages/admin/AdminDashboard";
import UsersPage          from "@/pages/admin/UsersPage";
import AdminCoursesPage   from "@/pages/admin/CoursesPage";
import CategoriesPage     from "@/pages/admin/CategoriesPage";

import CurriculumPage    from "@/pages/admin/curriculumpage.jsx";
import EnrollmentsPage    from "@/pages/admin/EnrollmentsPage";
import ContactPage        from "@/pages/admin/ContactPage";

import PaymentsPage_new   from "@/pages/admin/PaymentsPage_new";

import ProtectedRoute     from "@/components/shared/ProtectedRoute";
import AdminLayout        from "@/components/layout/AdminLayout"; 


import TestsPage     from "@/pages/admin/TestsPage";
import QuestionsPage from "@/pages/admin/QuestionsPage";

// checkout
import CheckoutPage from "@/pages/student/CheckoutPage/PaymentIndex";

const AUTH_PATHS    = ["/login", "/register", "/oauth/callback"];

export default function AppRoutes() {
    const { pathname } = useLocation();

    const isAuthPage    = AUTH_PATHS.includes(pathname);
    const isStudentPage = pathname.startsWith("/student");

    return (
        <>
            {!isAuthPage && !isStudentPage && <NavBarIndex />}

            <Routes>

                {/* ── PUBLIC ── */}
                <Route path="/" element={<div className="p-8 text-center text-text-secondary">HomePage coming soon</div>} />
                <Route path="/courses"      element={<CoursesPage />} />
                <Route path="/courses/:slug" element={<CourseDetailPage />} />

                {/* ── AUTH ── */}
                <Route path="/login"          element={<LoginPage />} />
                <Route path="/register"       element={<RegisterPage />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} />

                {/* ── STUDENT — sidebar layout ── */}
                <Route path="/student" element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <StudentLayout />
                    </ProtectedRoute>
                }>
                    <Route path="dashboard"    element={<DashboardPage />} />
                    <Route path="my-courses"   element={<MyCoursesPage />} />
                    <Route path="certificates" element={<CertificatesPage />} />
                    <Route path="payments"     element={<PaymentHistoryPage />} />
                    <Route path="profile"       element={<ProfilePage />} />
                    <Route path="course/:courseId/learn" element={<CoursePlayerPage />} />
                    <Route path="course/:courseId/exam/:testId" element={<ExamInterface />} />
                </Route>
       
  
      {/* ── CHECKOUT ── */}
         <Route path="/checkout" element={
             <ProtectedRoute allowedRoles={["student"]}>
                 <CheckoutPage />
             </ProtectedRoute>
         } />


                {/* ── COURSE PLAYER — full screen, no sidebar ── */}
                <Route
                    path="/student/course/:courseId/learn"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <CoursePlayerPage />
                        </ProtectedRoute>
                    }
                />

                {/* ── ADMIN ── */}
                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={["admin", "sub_admin"]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="courses" element={<AdminCoursesPage />} />
                    <Route path="courses/:courseId/curriculum" element={<CurriculumPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                   <Route path="payments" element={<PaymentsPage_new />} />
                    <Route path="enrollments" element={<EnrollmentsPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="courses/:courseId/tests"      element={<TestsPage />} />
                    <Route path="tests/:testId/questions"       element={<QuestionsPage />} />
                    {/* Add other admin routes here as they are created */}
                </Route>

                {/* ── 404 ── */}
                <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-[48px] font-extrabold text-primary">404</p>
                            <p className="text-[16px] text-text-secondary mt-2">Page not found</p>
                        </div>
                    </div>
                } />

            </Routes>
        </>
    );
}