import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import MasterOperatingPlan from './MasterOperatingPlan';
import About from './About';
import ExecutiveSummary from './ExecutiveSummary';
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
import TestLineContainer from './TestLineContainer';

function App() {

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);


  useEffect(() => {
    dispatch(checkSession())
      .then((action) => {
        if (action.type.endsWith('fulfilled')) {
          const userId = action.payload.user_id;
          console.log('useriD', userId)
          const userIdObject = action.payload;
          console.log('useriD', userIdObject)
          dispatch(fetchTools());
          dispatch(fetchCategories())
        }
      });
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(fetchTools());
  // }, [dispatch]);

  return (
    <BrowserRouter>
      {auth.isAuthenticated}

      <Breadcrumbs/>

      <Routes>
        {/* Public Routes */}
        {!auth.isAuthenticated ? (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<NewUserForm />} />
            {/* Redirect all other paths to "/" if not authenticated */}
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        ) : (
          /* Protected Routes for Authenticated Users */

          <>
            <Route path="/" element={<Layout />} />
            <Route path="/toolform" element={<ToolForm />} />
            <Route path="/categoryform" element={<CategoryForm />} />
            <Route path="/executivesummary" element={<ExecutiveSummary />} />
            <Route path="/masteroperatingplan" element={<MasterOperatingPlan />} />
            <Route path="/manage-test-lines" element={<TestLineContainer />} />
            {/* Redirect unhandled paths back to "/layout" for authenticated users */}
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        )}
      </Routes>

      {/* <div className="flex flex-col h-screen">
        <header className="navbar bg-base-100">
          <div className="flex-grow">
            <div className="flex items-center w-full px-4">
              <Link to="/" className="btn btn-primary btn-base">Roster</Link>
              <Link to="/about" className="btn btn-secondary btn-base">About</Link>
              <Link to="/toolform" className="btn btn-accent btn-base">Add New Tool</Link>
              <Link to="/categoryform" className="btn btn-accent btn-base">Add New Category</Link>
              <Link to="/executivesummary" className="btn btn-accent btn-base">Executive Summary</Link>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<MasterOperatingPlan />} />
            <Route path="/about" element={<About />} />
            <Route path="/executivesummary" element={<ExecutiveSummary />} />
            <Route path="/toolform" element={<ToolForm />} />
            <Route path="/categoryform" element={<CategoryForm />} />
          </Routes>
        </main>

        <footer className="footer bg-base-300 text-base-content p-4">
          <div className="items-center grid-flow-col">
            <p>© 2023 Your Company Name</p>
          </div>
        </footer>
      </div> */}
    </BrowserRouter>
  );
}

export default App;
