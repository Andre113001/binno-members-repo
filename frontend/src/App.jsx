import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Hooks
import { AuthProvider } from './hooks/AuthContext';

// Pages
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Blogs from './pages/Blogs/Blogs';
import GuideMain from './pages/Guides/GuideMain';
import Account from './pages/Account/Account';
import GuidePage from './pages/Guides/GuidePage';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import VerifyPassword from './pages/ForgotPassword/VerifyPassword';
import ChangePassword from './pages/ForgotPassword/ChangePassword';
import MessagePassword from './pages/ForgotPassword/MessagePassword';
import TokenInvalid from './pages/ForgotPassword/TokenInvalid';
import PasswordChanged from './pages/ForgotPassword/PasswordChanged';
import TwoAuth from './pages/Login/TwoAuth';

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
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/guides" element={<GuideMain />} />
          <Route path="/testing" element={<GuidePage />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
