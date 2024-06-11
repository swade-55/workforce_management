import React, {useState} from 'react';
import { useNavigate, Navigate, BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { logoutUser } from '../slices/authSlice';
import { useSelector } from 'react-redux';
import ToolRoster from './ToolRoster';
import MasterOperatingPlan from './MasterOperatingPlan';
import ExecutiveSummary from './ExecutiveSummary';
import ManageTestLines from './ManageTestLines'; // Import ManageTestLines
import ManageUsers from './ManageUsers'; // Import ManageUsers

function HeroSection() {
    // State to control the visibility of the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-xl font-bold">Manage Your Tools</h1>
            <p className="py-12"></p>
            <button className="btn btn-info btn-lg p-5 text-xl flex justify-center items-center w-full h-full" onClick={openModal}>Help</button>
          </div>
        </div>
  
        {/* Modal for instructions */}
        {isModalOpen && (
          <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
            <div className="modal-box relative">
              <label htmlFor="my-modal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeModal}>✕</label>
              <h3 className="text-4xl font-bold">Instructions</h3>
              <p className="py-5 text-xl">Here are the steps to use this system efficiently:</p>
              <ul className="list-disc list-inside">
                <li className="text-xl">Navigate to Manage All Companies to add or edit company details.</li>
                <li className="text-xl">Go to Manage All Contacts to view and manage your inventory.</li>
                <li className="text-xl">For help, contact help@tamu.edu</li>
              </ul>
              <div className="modal-action">
                <button className="btn btn-info btn-lg p-5 text-xl flex justify-center items-center w-full h-full" onClick={closeModal}>Got it!</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

function Layout() {
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
      dispatch(logoutUser()).then(() => {
        console.log('Logout successful');
        // Assuming your state changes upon logout, triggering a re-render
      }).catch((error) => console.error('Logout failed', error));
    };
    return (
      <div className="flex flex-col h-screen">
        <header className="navbar bg-base-100" style={{ zIndex: '1000' }}>
          <div className="flex-grow">
            <div className="flex justify-between items-center w-full px-4">
              <Link to="/masteroperatingplan">
                <button
                  className="btn btn-primary btn-lg text-xl flex justify-center items-center"
                >
                  Manage All Tools
                </button>
              </Link>
              <Link to="/manage-test-lines">
                <button
                  className="btn btn-primary btn-lg text-xl flex justify-center items-center"
                >
                  Manage All Test Lines
                </button>
              </Link>
              <Link to="/manage-users">
                <button
                  className="btn btn-primary btn-lg text-xl flex justify-center items-center"
                >
                  Manage Users
                </button>
              </Link>
              {!auth.isAuthenticated ? (
                <>
                  <Link to="/login"><button className="btn">Login</button></Link>
                  <Link to="/signup"><button className="btn">Signup</button></Link>
                </>
              ) : (
                <button onClick={handleLogout}
                  className="btn btn-info btn-lg text-xl flex justify-center items-center"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>
        <Routes>
          <Route path="/masteroperatingplan" element={<MasterOperatingPlan />} />
          <Route path="/manage-test-lines" element={<ManageTestLines />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/" element={<ExecutiveSummary />} />
        </Routes>
        <footer className="footer bg-base-300 text-base-content">
          <div className="items-center grid-flow-col">
            <p>© 2024 Nokia One Lab</p>
          </div>
        </footer>
      </div>
    );
  }

  export default Layout;
