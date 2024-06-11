import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MasterOperatingPlan from './MasterOperatingPlan';
import ToolForm from './ToolForm';
import CategoryForm from './CategoryForm';
import { fetchTools, fetchCategories } from '../slices/toolSlice';
import HeroSection from './HeroSection';
import { checkSession, logoutUser } from '../slices/authSlice';
import LandingPage from './LandingPage';
import { useSelector } from 'react-redux';
import LoginForm from './LoginForm';
import NewUserForm from './NewUserForm';
import Layout from './Layout';
import Breadcrumbs from './Breadcrumbs';
import ManageTestLines from './ManageTestLines';
import ManageUsers from './ManageUsers'; // Import ManageUsers component
import ExecutiveSummary from './ExecutiveSummary';

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkSession())
      .then((action) => {
        if (action.type.endsWith('fulfilled')) {
          const userId = action.payload.user_id;
          console.log('userId', userId);
          const userIdObject = action.payload;
          console.log('userIdObject', userIdObject);
          dispatch(fetchTools());
          dispatch(fetchCategories());
        }
      });
  }, [dispatch]);

  return (
    <Router>
      {auth.isAuthenticated && <Breadcrumbs />}

      <Routes>
        {!auth.isAuthenticated ? (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<NewUserForm />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Layout />} />
            <Route path="/toolform" element={<ToolForm />} />
            <Route path="/categoryform" element={<CategoryForm />} />
            <Route path="/executivesummary" element={<ExecutiveSummary />} />
            <Route path="/masteroperatingplan" element={<MasterOperatingPlan />} />
            <Route path="/manage-test-lines" element={<ManageTestLines />} />
            {auth.user && auth.user.role === 'admin' && (
              <Route path="/manage-users" element={<ManageUsers />} />
            )}
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
