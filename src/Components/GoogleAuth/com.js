import React from 'react';
import GoogleAuth from './GoogleAuth';

const GoogleAuth1 = () => {
  const handleLoginSuccess = (response) => {
    // Handle login success for Component1
  };

  const handleLoginFailure = (error) => {
    // Handle login failure for Component1
  };

  return (
    <div>
      <h2>Component 1</h2>
      <GoogleAuth onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />
    </div>
  );
};

const GoogleAuth2 = () => {
    const handleLoginSuccess = (response) => {
      // Handle login success for Component1
    };
  
    const handleLoginFailure = (error) => {
      // Handle login failure for Component1
    };
  
    return (
      <div>
        <h2>Component 2</h2>
        <GoogleAuth onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />
      </div>
    );
  };
  
export default GoogleAuth1;