import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const displayNameMapping = {
    'layout': ' ',
    'toolform': 'Tool Form',
    'categoryform': 'Category Form',
    'executivesummary': 'Summary',
    'masteroperatingplan': 'Layout',
    'about': 'About',
    'login': 'Login',
    'signup': 'Sign Up',
  };

  return (
    <div className="text-4xl mb-4">
      {pathnames.length > 0 && (
        <Link to="/" className="text-4xl hover:text-blue-600">Home</Link>
      )}
      {pathnames.map((value, index) => {
        const isLast = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const displayName = displayNameMapping[value] || value;

        return isLast ? (
          <span key={to} className="text-4xl">
            {' > '}
            <span className="text-4xl">{displayName}</span>
          </span>
        ) : (
          <span key={to} className="text-4xl">
            {' > '}
            <Link to={to} className="text-4xl text-blue-600">{displayName}</Link>
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
