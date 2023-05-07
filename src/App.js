import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserList from './UserList';
import UserDetails from './UserDetails';

const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route exact path="/" element={<UserList/>} />
          <Route path="/user/:username" element={<UserDetails/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;