import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Hooks
import { AuthProvider } from './hooks/AuthContext';

// Pages
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Blogs from './pages/Blogs/Blogs';
import GuideMain from './pages/Guides/GuideMain';
import EnablerAccount from './pages/EnablerAccount/EnablerAccount';
import GuidePage from './pages/Guides/GuidePage';
import RegistrationPage from './pages/Registration/registrationPage';
import RegistrationForm from './pages/Registration/RegistrationForm';
import EnablerRegForm from './pages/Registration/EnablerRegForm';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import VerifyPassword from './pages/ForgotPassword/VerifyPassword';
import ChangePassword from './pages/ForgotPassword/ChangePassword';
import MessagePassword from './pages/ForgotPassword/MessagePassword';
import TokenInvalid from './pages/ForgotPassword/TokenInvalid';
import PasswordChanged from './pages/ForgotPassword/PasswordChanged';
import TwoAuth from './pages/Login/TwoAuth';
import Events from './pages/Events/Events';
import FacebookAuth from './pages/FacebookAuth/FacebookAuth';
import AccountSettings from './pages/AccountSettings/AccountSettings';
import Posts from './pages/Posts/Posts';

function App() {
  return (
   <AuthProvider>
    <Router>
      <div className="w-screen">
        <Routes>
          {/* Change the default landing to login once done */}
          <Route path="/" element={<Login />} />
          <Route path="/two-auth" element={<TwoAuth />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/verifyPassword" element={<VerifyPassword />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/change-password-sent" element={<MessagePassword />} />
          <Route path="/invalid-token" element={<TokenInvalid />} />
          <Route path="/password-changed" element={<PasswordChanged />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/guides" element={<GuideMain />} />
          <Route path="/testing" element={<GuidePage />} />
          <Route path="/account" element={<EnablerAccount />} />
            <Route path="settings" element={<AccountSettings />} />
          <Route path="/registration" element={<RegistrationPage />}>
            <Route path="company" element={<RegistrationForm />} />
            <Route path="enabler" element={<EnablerRegForm />} />
          </Route>
          <Route path="/fb-auth" element={<FacebookAuth />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
