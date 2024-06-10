import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      {/* Header */}
      <nav className="bg-neutral text-neutral-content p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <Link to="/" className="btn btn-ghost normal-case text-6xl">One Lab Asset Inventory Management</Link>
            <div>
              {/* <Link to="/login" className="btn btn-primary mr-2">Log In</Link>
              <Link to="/signup" className="btn btn-secondary">Sign Up</Link> */}
              <Link to="/login">
              <button
                className="btn btn-primary btn-lg text-xl flex justify-center items-center"
                style={{
                  padding: '1.25rem 2.5rem', // Equivalent to py-5 px-10 in Tailwind
                  marginRight: '1rem',
                  display: 'inline-flex', // Make sure it's flex
                  alignItems: 'center', // Vertically centers text
                  justifyContent: 'center', // Horizontally centers text
                  height: '100%', // Ensure full height is used
                  width: 'auto', // Adjust width as needed or use specific size
                  lineHeight: '1' // Adjust line height to ensure vertical centering
                }}
              >
                Log In
              </button>
              </Link>
              <Link to="/signup">
              <button
                className="btn btn-secondary btn-lg text-xl flex justify-center items-center"
                style={{
                  padding: '1.25rem 2.5rem', // Equivalent to py-5 px-10 in Tailwind
                  display: 'inline-flex', // Make sure it's flex
                  alignItems: 'center', // Vertically centers text
                  justifyContent: 'center', // Horizontally centers text
                  height: '100%', // Ensure full height is used
                  width: 'auto', // Adjust width as needed or use specific size
                  lineHeight: '1' // Adjust line height to ensure vertical centering
                }}
              >
                Sign Up
              </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow container mx-auto flex flex-col justify-center p-12 text-center">
        <h1 className="mb-6 text-xl font-bold">
          Welcome to One Lab Asset Inventory Management
        </h1>
        <Link to="/signup" className="btn btn-primary btn-lg">
          Get Started
        </Link>
      </main>

      {/* Footer */}
      <footer className="bg-neutral p-4 text-neutral-content text-center">
        <div>
          <p>&copy; 2024 ContactManagement, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
