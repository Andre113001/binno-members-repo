import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Blogs from './pages/Blogs/Blogs';
import GuideMain from './pages/Guides/GuideMain';
import Account from './pages/Account/Account';
import GuidePage from './pages/Guides/GuidePage';

function App() {
  return (
    <Router>
      <div className="w-screen">
        <Routes>
          {/* Change the default landing to login once done */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/guides" element={<GuideMain />} />
          <Route path="/testing" element={<GuidePage />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
