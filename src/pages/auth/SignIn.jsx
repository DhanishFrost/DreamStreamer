import { useState } from 'react';
import { signIn, confirmSignUp, fetchAuthSession, confirmSignIn, getCurrentUser } from 'aws-amplify/auth';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './AuthProvidor';

const SignIn = () => {
  const { setUserName } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [challenge, signInStep] = useState(null);
  const [error, setError] = useState(null);
  const [popupError, setPopupError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const user = await signIn({
        username: username,
        password: password,
      });
      console.log('User object:', user);
      if (user && user.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        signInStep('NEW_PASSWORD_REQUIRED');
        setError(null);
        console.log('New password required:', user);
      } else if (user.nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        console.log('User must confirm sign up', user);
        setShowConfirmation(true);
        setError(null);
      } else {
        console.log('Sign-in successful:', user);
        await fetchUserAttributes();
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error.message);
    }
  };

  const handleNewPasswordSubmit = async () => {
    try {
      const user = confirmSignIn({
        challengeResponse: newPassword
      });
      console.log('New password set successfully:', user);
      await fetchUserAttributes();
    } catch (error) {
      console.error('Error setting new password:', error);
      setPopupError(error.message);
    }
  };


  const fetchUserAttributes = async () => {
    try {
      const session = await fetchAuthSession();
      const user = await getCurrentUser();
      setUserName(user.username);
      console.log(session);
      const { idToken } = session.tokens ?? {};
      const decodedToken = jwtDecode(idToken.toString());
      const customRole = decodedToken['custom:role'];
      
      if (customRole === '1') {
        navigate('/dreamstreamer/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching user attributes:', error);
      setError(error.message);
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      await confirmSignUp({
        username: username,
        confirmationCode: verificationCode,
      });
      console.log('User confirmed successfully');
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error confirming sign-up:', error);
      setPopupError(error.message);
    }
  };

  return (
    <>
      <div className="bg-black flex flex-col md:flex-row h-screen items-center">

        <img
          src="https://dreamstreamer-music-assets.s3.ap-southeast-1.amazonaws.com/singinImage.jpg"
          alt="Loginimage"
          className="w-full md:w-7/12 h-full object-cover brightness-75"
        />
        <div className="absolute top-0 left-0 w-7/12 h-full flex items-center justify-center">
          <div className="text-white">
            <span className="font-[playfairdisplay] text-white text-7xl max-md:hidden font-normal">Melody Haven Harmony</span><br /><br />
            <span className="font-[poppins] text-white text-opacity-60 max-md:hidden text-2xl font-medium"> Where music lovers gather for <br />enchanting experiences in <br />harmonious bliss</span>
          </div>
        </div>
        <div className="w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
          <div className="w-full h-100 mt-6 max-md:relative max-md:bottom-16">
            <h1
              className="font-[poppins] text-gray-200 text-center text-xl md:text-2xl font-semibold leading-tight mb-6 mt-10 max-md:mb-6 max-md:mt-6">
              Log in to your account</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-envelope text-gray-300 mt-1.5"></i>
              </div>
              <input
                className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 mt-2 bg-black text-white pl-10"
                type="text"
                placeholder="Email or Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mt-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-key text-gray-300 mt-1.5"></i>
              </div>
              <input
                className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 mt-2 bg-black text-white pl-10"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="text-right mt-2">
              <a href=""
                className="text-sm font-semibold text-gray-400 hover:text-white focus:text-white">
                Forgot your password?
              </a>


              <button onClick={handleSignIn}
                className="w-full mt-6 text-center px-4 py-4 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-[#0a174a] focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150"
              >
                LOG IN
              </button>

            </div>
            <hr className="my-6 border-gray-300 w-full" />

            <p className="mt-auto text-gray-400">Don't have an account?<Link to="/dreamstreamer/signup"
              className="text-gray-200 hover:text-white font-semibold">Register</Link></p>


            {challenge === 'NEW_PASSWORD_REQUIRED' && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-gray-700 shadow-md rounded-lg p-6 w-full max-w-md relative">
                  <button
                    className="absolute top-2 right-2 text-white hover:text-red-500 transition-colors"
                    onClick={() => setShowConfirmation(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h3 className="text-center text-xl text-white font-semibold mb-4">Set New Password</h3>
                  {popupError && <p className="text-red-500">{popupError}</p>}
                  <div className="my-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="bi bi-key text-gray-300 mt-2"></i>
                    </div>
                    <input
                      className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 mt-2 bg-black text-white pl-10"
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleNewPasswordSubmit}
                    className="w-full mt-6 text-center px-4 py-4 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-[#0a174a] focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150"
                  >
                    Confirm Sign Up
                  </button>
                </div>
              </div>
            )}

            {showConfirmation && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-gray-700 shadow-md rounded-lg p-6 w-full max-w-md relative">
                  <button
                    className="absolute top-2 right-2 text-white hover:text-red-500 transition-colors"
                    onClick={() => setShowConfirmation(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h3 className="text-center text-xl text-white font-semibold mb-4">Confirm Your Account</h3>
                  <p className='text-left text-sm text-white'>Please enter the verification code sent to your email.</p>
                  {popupError && <p className="text-red-500">{popupError}</p>}
                  <div className="my-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="bi bi-key text-gray-300 mt-2"></i>
                    </div>
                    <input
                      className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 mt-2 bg-black text-white pl-10"
                      type="text"
                      placeholder="Verification Code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleConfirmSignUp}
                    className="w-full mt-6 text-center px-4 py-4 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-[#0a174a] focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150"
                  >
                    Confirm Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
