import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { fetchTools, fetchCategories, fetchTestLines } from '../slices/toolSlice';
import { checkSession } from '../slices/authSlice';
import LandingPage from './LandingPage';
import LoginForm from './LoginForm';
import NewUserForm from './NewUserForm';
import SidebarLayout from './SidebarLayout';
import MasterOperatingPlan from './MasterOperatingPlan';
import ExecutiveSummary from './ExecutiveSummary';
import ManageTestLines from './ManageTestLines';
import ManageUsers from './ManageUsers'; // Import ManageUsers
import AssetContainer from './AssetContainer';
import StockContainer from './StockContainer';

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  console.log('this is app auth', auth)

  useEffect(() => {
    dispatch(checkSession()).then((action) => {
      if (action.type.endsWith('fulfilled')) {
        dispatch(fetchTools());
        dispatch(fetchCategories());
        dispatch(fetchTestLines());
      }
    });
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {!auth.isAuthenticated ? (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<NewUserForm />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        ) : (
          <Route path="/" element={<SidebarLayout />}>
            <Route path="masteroperatingplan" element={<MasterOperatingPlan />} />
            <Route path="manage-test-lines" element={<ManageTestLines />} />
            {auth.user && auth.user.role === 'admin' && (
              <Route path="manage-users" element={<ManageUsers />} />
            )}
            <Route path="/" element={<ExecutiveSummary />} />
            <Route path="/asset-container" element={<AssetContainer />} />
          <Route path="/stock-container" element={<StockContainer />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;
