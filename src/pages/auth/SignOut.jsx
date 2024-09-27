import React from 'react';
import { signOut } from 'aws-amplify/auth';
import { useAuth } from './AuthProvidor';

const SignOut = () => {
  const { setUserName } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserName(null);
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-red-500 text-lg opacity-75 hover:opacity-100 font-semibold py-2 transition duration-300"
    >
      Logout
    </button>
  );
};

export default SignOut;
