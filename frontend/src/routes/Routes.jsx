import { createBrowserRouter } from "react-router-dom";

import Main from "../Layout/Main";
import SignIn from "../Pages/SharedPages/Auth/SignIn";

import Home from "../Pages/SharedPages/Home/Home";
import EmailVerificationPage from "../Pages/EmailVerificationPage";
import SignUp from "../Pages/SharedPages/Auth/SignUp";
import EventCard from "../Pages/SharedPages/AllEvents/EventCards";
import Dashboard from "../Layout/Dashboard";
import AdminAddEvent from "../Pages/AdminPages/AdminAddEvent";
import Profile from "../Pages/SharedPages/Profile/Profile";
import AllUsers from "../Pages/AdminPages/AllUsers";
import EventDetailPage from "../Pages/SharedPages/AllEvents/Components/EventDetailPage";
import AdminEventsPage from "../Pages/AdminPages/AdminEventsPage";
import CustomizeEvent from "../Pages/SharedPages/AllEvents/Components/CustomizeEvent";
import AdminEditEvent from "../Pages/AdminPages/AdminEditEvent";
import BookmarkedEvents from "../Pages/UserPages/BookmarkedEvents";
import UserBookings from "../Pages/UserPages/UserBookings";
import AdminManageBookings from "../Pages/AdminPages/AdminManageBookings";
import PaymentPage from "../Pages/SharedPages/AllEvents/PaymentPage";
import PaymentResult from "../Pages/UserPages/PaymentResult";
import PaymentCallback from "../Pages/SharedPages/AllEvents/Components/PaymentCallback";
import PaymentsTable from "../Pages/UserPages/PaymentsTable";
import AdminPaymentsTable from "../Pages/AdminPages/AdminPaymentsTable";
import ContactPage from "../Pages/SharedPages/ContactPage/ContactPage";
import AdminReviews from "../Pages/AdminPages/AdminReviews";
import UserReviews from "../Pages/UserPages/UserReviews";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/events",
        element: <EventCard />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/events/:id",
        element: <EventDetailPage />,
      },
      {
        path: "/event/:id",
        element: <CustomizeEvent />,
      },
      {
        path: "/verify-email",
        element: <EmailVerificationPage />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/payment-callback",
        element: <PaymentCallback />,
      },
      
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard></Dashboard>,
    children: [
      {
        path: "addEvents",
        element: <AdminAddEvent />,
      },
      {
        path: "manage-users",
        element: <AllUsers />,
      },

      {
        path: "admin/events",
        element: <AdminEventsPage />,
      },
      {
        path: "edit/:id",
        element: <AdminEditEvent />,
        
      },
      {
        path: "all-orders",
        element: <AdminManageBookings />,
      },
      {
        path: "all-payments",
        element: <AdminPaymentsTable />,
      },
      {
        path: "reviews",
        element: <AdminReviews />,
      },

      //user routes
      {
        path: "my-bookmarkedEvents",
        element: <BookmarkedEvents />,
      },
      {
        path: "my-orders",
        element: <UserBookings />,
      },
      {
        path: "bookings/:id/payment",
        element: <PaymentPage />,
      },
      {
        path: "payment-result/:bookingId",
        element: <PaymentResult />,
      },
      {
        path: "payments",
        element: <PaymentsTable />,
      },
      {
        path: "user/reviews",
        element: <UserReviews />,
      },
    ],
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signUpFlow",
    element: <SignUp />,
  },
]);
